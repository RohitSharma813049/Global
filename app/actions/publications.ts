'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir, unlink } from "fs/promises"
import path from "path"
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
    const subcategoryIds = formData.getAll('subcategory_ids[]') as string[]
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return { error: 'Please upload a valid file.' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // We need to convert the File to an ArrayBuffer to upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save locally to public/uploads folder
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', 'publications', contentType)
    await mkdir(publicUploadDir, { recursive: true })
    const localFilePath = path.join(publicUploadDir, fileName)
    
    await writeFile(localFilePath, buffer)
    
    const fileUrl = `/uploads/publications/${contentType}/${fileName}`

    // Insert into publications table
    const { error: dbError } = await supabaseAdmin
      .from('publications')
      .insert({
        scholar_id: scholar.id,
        category_id: categoryId || null,
        subcategory_ids: subcategoryIds || [],
        title,
        abstract,
        content_type: contentType,
        file_url: fileUrl,
        status: 'submitted' // Submitting it for admin review
      })

    if (dbError) {
      // Cleanup the uploaded file if DB insert fails
      await unlink(localFilePath).catch(console.error)
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
    const updateData: any = { status }
    
    // If we are publishing, and a DOI was provided, save it
    if (status === 'published' && doi) {
      updateData.doi = doi
    }

    const { data: pubData, error } = await supabaseAdmin
      .from('publications')
      .update(updateData)
      .eq('id', id)
      .select('title, scholars(user_id)')
      .single()

    if (error) throw error

    // Create a notification for the scholar
    const scholarData = pubData?.scholars as any;
    if (pubData && scholarData?.user_id) {
      if (status === 'published') {
        await createNotification(
          scholarData.user_id,
          'Publication Approved!',
          `Your publication "${pubData.title}" has been approved and published.`,
          'publication_approved',
          '/dashboard/scholar/publications'
        )
      } else if (status === 'rejected') {
        await createNotification(
          scholarData.user_id,
          'Publication Rejected',
          `Your publication "${pubData.title}" was not approved by the admin. ${reason ? `Reason: ${reason}` : ''}`,
          'publication_rejected',
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
          p.views, p.downloads, p.doi, p.file_url, p.status, p.subcategory_ids,
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
          p.views, p.downloads, p.doi, p.file_url, p.status, p.subcategory_ids,
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
      doi: p.doi,
      file_url: p.file_url,
      status: p.status,
      subcategory_ids: p.subcategory_ids || [],
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
    revalidatePath('/category')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deletePublication(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('publications')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/publications')
    revalidatePath('/dashboard/scholar/publications')
    revalidatePath('/category')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting publication:', error)
    return { error: error.message || 'Failed to delete publication' }
  }
}

