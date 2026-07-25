'use server'

import path from 'path'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function updateScholarProfile(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'scholar') {
    return { error: 'Unauthorized. Only approved scholars can update their profile.' }
  }

  try {
    const bio = formData.get('bio') as string
    const institution = formData.get('institution') as string
    const qualification = formData.get('qualification') as string
    const specialization = formData.get('specialization') as string
    const linkedin_url = formData.get('linkedin_url') as string
    const twitter_url = formData.get('twitter_url') as string
    const website_url = formData.get('website_url') as string

    // Handle Profile Photo Upload
    const profilePhotoFile = formData.get('profile_photo') as File | null
    let profilePhotoUrl = undefined;
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      const buffer = Buffer.from(await profilePhotoFile.arrayBuffer())
      try {
        const { uploadFileToR2 } = await import('@/lib/r2');
        profilePhotoUrl = await uploadFileToR2(buffer, profilePhotoFile.name, `scholars/${session.user.id}/images`, profilePhotoFile.type);
      } catch (err: any) {
        console.error("R2 Upload failed:", err);
        throw new Error("Cloud storage upload failed: " + (err.message || "Unknown error"));
      }
    }

    // Handle Main Video Upload
    const videoFile = formData.get('video_file') as File | null
    let videoUrl = undefined;
    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      try {
        const { uploadFileToR2 } = await import('@/lib/r2');
        videoUrl = await uploadFileToR2(buffer, videoFile.name, `scholars/${session.user.id}/videos`, videoFile.type);
      } catch (err: any) {
        console.error("R2 Upload failed:", err);
        throw new Error("Cloud storage upload failed: " + (err.message || "Unknown error"));
      }
    }

    // Handle Gallery Images
    const galleryImages = formData.getAll('gallery_images') as File[]
    const galleryImageUrls: string[] = [];
    if (galleryImages && galleryImages.length > 0 && galleryImages[0].size > 0) {
      for (const gImg of galleryImages) {
        if (gImg && gImg.size > 0) {
          const buffer = Buffer.from(await gImg.arrayBuffer())
          try {
            const { uploadFileToR2 } = await import('@/lib/r2');
            const imgUrl = await uploadFileToR2(buffer, gImg.name, `scholars/${session.user.id}/images`, gImg.type);
            galleryImageUrls.push(imgUrl);
          } catch (err: any) {
            console.error("R2 Upload failed:", err);
            throw new Error("Cloud storage upload failed: " + (err.message || "Unknown error"));
          }
        }
      }
    }

    // Handle Gallery Videos
    const galleryVideos = formData.getAll('gallery_videos') as File[]
    const galleryVideoUrls: string[] = [];
    if (galleryVideos && galleryVideos.length > 0 && galleryVideos[0].size > 0) {
      for (const gVid of galleryVideos) {
        if (gVid && gVid.size > 0) {
          const buffer = Buffer.from(await gVid.arrayBuffer())
          try {
            const { uploadFileToR2 } = await import('@/lib/r2');
            const vUrl = await uploadFileToR2(buffer, gVid.name, `scholars/${session.user.id}/videos`, gVid.type);
            galleryVideoUrls.push(vUrl);
          } catch (err: any) {
            console.error("R2 Upload failed:", err);
            throw new Error("Cloud storage upload failed: " + (err.message || "Unknown error"));
          }
        }
      }
    }

    // Fetch existing scholar profile to append images instead of replacing
    const { data: existingScholar } = await supabaseAdmin
      .from('scholars')
      .select('video_url, gallery_images, gallery_videos, profile_photo_url')
      .eq('user_id', session.user.id)
      .single()

    let deletedMediaUrls: string[] = []
    try {
      deletedMediaUrls = JSON.parse((formData.get('deletedMedia') as string) || '[]')
    } catch(e) {}

    // Build update payload
    const updateData: any = {
      bio,
      institution,
      qualification,
      specialization,
      linkedin_url,
      twitter_url,
      website_url
    }

    if (profilePhotoUrl) {
      updateData.profile_photo_url = profilePhotoUrl
    } else if (existingScholar?.profile_photo_url && deletedMediaUrls.includes(existingScholar.profile_photo_url)) {
      updateData.profile_photo_url = null
    }

    // Process video deletions and additions
    if (existingScholar?.video_url && deletedMediaUrls.includes(existingScholar.video_url)) {
      updateData.video_url = null
    }
    if (videoUrl) updateData.video_url = videoUrl
    
    // Process gallery image deletions and additions
    const existingImages = existingScholar?.gallery_images || []
    const keptImages = existingImages.filter((url: string) => !deletedMediaUrls.includes(url))
    if (keptImages.length !== existingImages.length || galleryImageUrls.length > 0) {
      updateData.gallery_images = [...keptImages, ...galleryImageUrls]
    }
    
    // Process gallery video deletions and additions
    const existingVideos = existingScholar?.gallery_videos || []
    const keptVideos = existingVideos.filter((url: string) => !deletedMediaUrls.includes(url))
    if (keptVideos.length !== existingVideos.length || galleryVideoUrls.length > 0) {
      updateData.gallery_videos = [...keptVideos, ...galleryVideoUrls]
    }

    const { error } = await supabaseAdmin
      .from('scholars')
      .update(updateData)
      .eq('user_id', session.user.id)

    if (error) throw error

    revalidatePath('/dashboard/scholar')
    revalidatePath(`/scholars/${session.user.id}`) // In case the public profile page uses user_id
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating scholar profile:', error)
    return { error: error.message || 'Failed to update profile' }
  }
}
