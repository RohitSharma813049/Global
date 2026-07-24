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

    // Handle Main Video Upload
    const videoFile = formData.get('video_file') as File | null
    let videoUrl = undefined;
    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      try {
        const { uploadFileToR2 } = await import('@/lib/r2');
        videoUrl = await uploadFileToR2(buffer, videoFile.name, 'videos', videoFile.type);
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
            const imgUrl = await uploadFileToR2(buffer, gImg.name, 'images', gImg.type);
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
            const vUrl = await uploadFileToR2(buffer, gVid.name, 'videos', gVid.type);
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
      .select('gallery_images, gallery_videos')
      .eq('user_id', session.user.id)
      .single()

    // Build update payload
    const updateData: any = {
      bio,
      institution,
      qualification,
      specialization
    }

    if (videoUrl) updateData.video_url = videoUrl
    
    if (galleryImageUrls.length > 0) {
      updateData.gallery_images = [...(existingScholar?.gallery_images || []), ...galleryImageUrls]
    }
    
    if (galleryVideoUrls.length > 0) {
      updateData.gallery_videos = [...(existingScholar?.gallery_videos || []), ...galleryVideoUrls]
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
