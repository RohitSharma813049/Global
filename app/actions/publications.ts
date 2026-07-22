'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { createWriteStream } from "fs"
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import path from "path"
import { unlink } from "fs/promises"
import { createNotification } from "./notifications"
import { prisma } from "@/lib/db"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function getAllCategories() {
  const { data, error } = await supabaseAdmin.from('categories').select('id, name')
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export async function uploadPublication(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'scholar') {
    return { error: 'Unauthorized. Only scholars can upload publications.' }
  }

  try {
    // Get the scholar ID for this user
    const { data: scholar, error: scholarError } = await supabaseAdmin
      .from('scholars')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    if (scholarError || !scholar) {
      return { error: 'Scholar profile not found.' }
    }

    const title = formData.get('title') as string
    const abstract = formData.get('abstract') as string
    const contentType = formData.get('content_type') as string
    const categoryId = formData.get('category_id') as string
    const authorName = formData.get('author_name') as string
    const institution = formData.get('institution') as string
    const emailAddress = formData.get('email_address') as string
    const originalityDeclaration = formData.get('originality_declaration') === 'true'
    const copyrightDeclaration = formData.get('copyright_declaration') === 'true'
    const termsAcceptance = formData.get('terms_acceptance') === 'true'
    const file = formData.get('file') as File | null
    const coverImage = formData.get('cover_image') as File | null
    const bannerImage = formData.get('banner_image') as File | null
    const galleryImages = formData.getAll('gallery_images') as File[]
    const galleryVideos = formData.getAll('gallery_videos') as File[]
    const doi = formData.get('doi') as string | null
    const videoFile = formData.get('video_file') as File | null
    
    if ((!file || file.size === 0) && (!videoFile || videoFile.size === 0)) {
      return { error: 'Please upload a valid document file or a main video file.' }
    }

    let fileUrl = ''
    let localFilePath: string | null = null;
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'publications', contentType)
      await require('fs/promises').mkdir(uploadDir, { recursive: true })
      localFilePath = path.join(uploadDir, fileName)
      const buffer = Buffer.from(await file.arrayBuffer())
      await require('fs/promises').writeFile(localFilePath, buffer)
      fileUrl = `/uploads/publications/${contentType}/${fileName}`
    }

    let videoUrl = null;
    if (videoFile && videoFile.size > 0) {
      const vidExt = videoFile.name.split('.').pop()
      const vidName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${vidExt}`
      const vidPath = path.join(process.cwd(), 'public', 'uploads', 'videos')
      await require('fs/promises').mkdir(vidPath, { recursive: true })
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      await require('fs/promises').writeFile(path.join(vidPath, vidName), buffer)
      videoUrl = `/uploads/videos/${vidName}`
      
      // If no other file was uploaded, make the video URL the main file_url
      if (!fileUrl) {
        fileUrl = videoUrl;
      }
    }

    // Handle Cover Image
    let coverImageUrl = null;
    if (coverImage && coverImage.size > 0) {
      const imgExt = coverImage.name.split('.').pop();
      const imgName = `cover-${Date.now()}-${Math.random().toString(36).substring(7)}.${imgExt}`;
      const imgPath = path.join(process.cwd(), 'public', 'uploads', 'images');
      await require('fs/promises').mkdir(imgPath, { recursive: true });
      const buffer = Buffer.from(await coverImage.arrayBuffer())
      await require('fs/promises').writeFile(path.join(imgPath, imgName), buffer)
      coverImageUrl = `/uploads/images/${imgName}`;
    }

    // Handle Banner Image
    let bannerImageUrl = null;
    if (bannerImage && bannerImage.size > 0) {
      const imgExt = bannerImage.name.split('.').pop();
      const imgName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${imgExt}`;
      const imgPath = path.join(process.cwd(), 'public', 'uploads', 'images');
      await require('fs/promises').mkdir(imgPath, { recursive: true });
      const buffer = Buffer.from(await bannerImage.arrayBuffer())
      await require('fs/promises').writeFile(path.join(imgPath, imgName), buffer)
      bannerImageUrl = `/uploads/images/${imgName}`;
    }

    // Handle Gallery Images
    const galleryImageUrls: string[] = [];
    for (const gImg of galleryImages) {
      if (gImg && gImg.size > 0) {
        const imgExt = gImg.name.split('.').pop();
        const imgName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${imgExt}`;
        const imgPath = path.join(process.cwd(), 'public', 'uploads', 'images');
        await require('fs/promises').mkdir(imgPath, { recursive: true });
        const buffer = Buffer.from(await gImg.arrayBuffer())
        await require('fs/promises').writeFile(path.join(imgPath, imgName), buffer)
        galleryImageUrls.push(`/uploads/images/${imgName}`);
      }
    }

    // Handle Gallery Videos
    const galleryVideoUrls: string[] = [];
    for (const gVid of galleryVideos) {
      if (gVid && gVid.size > 0) {
        const vidExt = gVid.name.split('.').pop();
        const vidName = `gallery-vid-${Date.now()}-${Math.random().toString(36).substring(7)}.${vidExt}`;
        const vidPath = path.join(process.cwd(), 'public', 'uploads', 'videos');
        await require('fs/promises').mkdir(vidPath, { recursive: true });
        const buffer = Buffer.from(await gVid.arrayBuffer())
        await require('fs/promises').writeFile(path.join(vidPath, vidName), buffer)
        galleryVideoUrls.push(`/uploads/videos/${vidName}`);
      }
    }

    // Insert into publications table
    const { error: dbError } = await supabaseAdmin
      .from('publications')
      .insert({
        scholar_id: scholar.id,
        category_id: categoryId || null,
        title,
        abstract,
        content_type: contentType,
        file_url: fileUrl,
        cover_image: coverImageUrl,
        banner_image: bannerImageUrl,
        gallery_images: galleryImageUrls,
        gallery_videos: galleryVideoUrls,
        doi: doi,
        video_url: videoUrl,
        author_name: authorName,
        institution,
        email_address: emailAddress,
        originality_declaration: originalityDeclaration,
        copyright_declaration: copyrightDeclaration,
        terms_acceptance: termsAcceptance,
        status: 'submitted' // Submitting it for admin review
      })

    if (dbError) {
      // Cleanup the uploaded file if DB insert fails
      if (localFilePath) await unlink(localFilePath).catch(console.error)
      throw dbError
    }

    revalidatePath('/dashboard/scholar/publications')
    revalidatePath('/dashboard/admin/publications')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error uploading publication:', error)
    return { error: error.message || 'Failed to submit publication' }
  }
}

export async function updatePublicationStatus(id: string, status: string, doi?: string, reason?: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized.' }
  }

  try {
    if (status === 'rejected') {
      // Fetch the publication details to delete files
      const { data: pubToReject, error: fetchError } = await supabaseAdmin
        .from('publications')
        .select('title, file_url, cover_image, banner_image, gallery_images, scholars(user_id)')
        .eq('id', id)
        .single()
        
      if (!fetchError && pubToReject) {
        // Delete physical files
        const filesToDelete = [
          pubToReject.file_url,
          pubToReject.cover_image,
          pubToReject.banner_image,
          ...(pubToReject.gallery_images || [])
        ].filter(Boolean) as string[];

        for (const file of filesToDelete) {
          try {
            // Remove the leading slash to get the relative path inside public
            const localPath = path.join(process.cwd(), 'public', file.replace(/^\//, ''))
            await unlink(localPath)
          } catch (e) {
            console.error(`Failed to delete file ${file}:`, e)
          }
        }

        // Send notification
        const scholarData = pubToReject.scholars as any;
        if (scholarData?.user_id) {
          await createNotification(
            scholarData.user_id,
            'Publication Rejected',
            `Your publication "${pubToReject.title}" was not approved by the admin. ${reason ? `Reason: ${reason}` : ''}`,
            'publication_rejected',
            '/dashboard/scholar/publications'
          )
        }

        // Delete from database
        await supabaseAdmin.from('publications').delete().eq('id', id)
      }
    } else {
      const updateData: any = { status }

      const { data: pubData, error } = await supabaseAdmin
        .from('publications')
        .update(updateData)
        .eq('id', id)
        .select('title, scholars(user_id)')
        .single()

      if (error) throw error

      // Create a notification for the scholar
      const scholarData = pubData?.scholars as any;
      if (pubData && scholarData?.user_id && status === 'published') {
        await createNotification(
          scholarData.user_id,
          'Publication Approved!',
          `Your publication "${pubData.title}" has been approved and published.`,
          'publication_approved',
          '/dashboard/scholar/publications'
        )
      }
    }

    revalidatePath('/dashboard/admin/publications')
    revalidatePath('/dashboard/scholar/publications')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating publication status:', error)
    return { error: error.message || 'Failed to update status' }
  }
}

export async function getPublishedPublications(categorySlug?: string) {
  try {
    // Use raw SQL to bypass both the Windows stale Prisma client schema issue 
    // AND the Supabase PostgREST cross-schema join restrictions for auth.users.
    let data: any[];
    
    if (categorySlug) {
      data = await prisma.$queryRaw`
        SELECT 
          p.id, p.title, p.abstract, p.content_type, p.created_at,
          p.views, p.downloads, p.file_url, p.cover_image, p.author_name, p.institution, p.email_address, p.status,
          c.name as category_name, c.slug as category_slug,
          s.id as scholar_id, s.user_id as scholar_user_id,
          u.raw_user_meta_data
        FROM public.publications p
        LEFT JOIN public.categories c ON p.category_id = c.id
        LEFT JOIN public.scholars s ON p.scholar_id = s.id
        LEFT JOIN auth.users u ON s.user_id = u.id
        WHERE p.status = 'published' AND c.slug = ${categorySlug}
        ORDER BY p.created_at DESC
      `;
    } else {
      data = await prisma.$queryRaw`
        SELECT 
          p.id, p.title, p.abstract, p.content_type, p.created_at,
          p.views, p.downloads, p.file_url, p.cover_image, p.author_name, p.institution, p.email_address, p.status,
          c.name as category_name, c.slug as category_slug,
          s.id as scholar_id, s.user_id as scholar_user_id,
          u.raw_user_meta_data
        FROM public.publications p
        LEFT JOIN public.categories c ON p.category_id = c.id
        LEFT JOIN public.scholars s ON p.scholar_id = s.id
        LEFT JOIN auth.users u ON s.user_id = u.id
        WHERE p.status = 'published'
        ORDER BY p.created_at DESC
      `;
    }

    const formattedData = data.map((p: any) => ({
      id: p.id,
      title: p.title,
      abstract: p.abstract,
      content_type: p.content_type,
      created_at: p.created_at?.toISOString() || new Date().toISOString(),
      views: p.views || 0,
      downloads: p.downloads || 0,
      file_url: p.file_url,
      cover_image: p.cover_image,
      banner_image: p.banner_image,
      gallery_images: p.gallery_images,
      doi: p.doi,
      video_url: p.video_url,
      author_name: p.author_name,
      institution: p.institution,
      email_address: p.email_address,
      status: p.status,
      categories: p.category_name ? { name: p.category_name, slug: p.category_slug } : null,
      scholars: p.scholar_id ? {
        id: p.scholar_id,
        user_id: p.scholar_user_id,
        users: {
          raw_user_meta_data: p.raw_user_meta_data || { 
            name: "Unknown Author",
            full_name: "Unknown Author" 
          }
        }
      } : null
    }));

    return { publications: formattedData }
  } catch (error: any) {
    console.error('[getPublishedPublications] Error fetching publications:', error)
    return { error: error.message || 'Failed to fetch publications' }
  }
}
export async function getPublication(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('publications')
      .select(`*`)
      .eq('id', id)
      .single()

    if (error) throw error
    return { data }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updatePublicationContent(id: string, updates: { title?: string, abstract?: string, content_type?: string, category_id?: string | null }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('publications')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/publications')
    revalidatePath('/explore')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deletePublication(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'scholar')) {
      return { error: 'Unauthorized' }
    }

    const { data: pub, error: fetchError } = await supabaseAdmin
      .from('publications')
      .select('scholar_id')
      .eq('id', id)
      .single()

    if (fetchError || !pub) {
      return { error: 'Publication not found' }
    }

    if (session.user.role === 'scholar') {
      const { data: scholar } = await supabaseAdmin
        .from('scholars')
        .select('id')
        .eq('user_id', session.user.id)
        .single()
        
      if (!scholar || pub.scholar_id !== scholar.id) {
        return { error: 'You do not have permission to delete this publication' }
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from('publications')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    revalidatePath('/dashboard/scholar/publications')
    revalidatePath('/dashboard/admin/publications')
    revalidatePath('/explore')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting publication:', error)
    return { error: error.message || 'Failed to delete publication' }
  }
}
