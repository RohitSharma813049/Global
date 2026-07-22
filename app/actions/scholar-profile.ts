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
      const vidExt = videoFile.name.split('.').pop()
      const vidName = `scholar-video-${Date.now()}-${Math.random().toString(36).substring(7)}.${vidExt}`
      const vidPath = path.join(process.cwd(), 'public', 'uploads', 'videos')
      await require('fs/promises').mkdir(vidPath, { recursive: true })
      const nodeStream = Readable.fromWeb(videoFile.stream() as any)
      const writeStream = createWriteStream(path.join(vidPath, vidName))
      await pipeline(nodeStream, writeStream)
      videoUrl = `/uploads/videos/${vidName}`
    }

    // Handle Gallery Images
    const galleryImages = formData.getAll('gallery_images') as File[]
    const galleryImageUrls: string[] = [];
    if (galleryImages && galleryImages.length > 0 && galleryImages[0].size > 0) {
      for (const gImg of galleryImages) {
        if (gImg && gImg.size > 0) {
          const imgExt = gImg.name.split('.').pop();
          const imgName = `scholar-gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${imgExt}`;
          const imgPath = path.join(process.cwd(), 'public', 'uploads', 'images');
          await require('fs/promises').mkdir(imgPath, { recursive: true });
          const nodeStream = Readable.fromWeb(gImg.stream() as any)
          const writeStream = createWriteStream(path.join(imgPath, imgName))
          await pipeline(nodeStream, writeStream)
          galleryImageUrls.push(`/uploads/images/${imgName}`);
        }
      }
    }

    // Handle Gallery Videos
    const galleryVideos = formData.getAll('gallery_videos') as File[]
    const galleryVideoUrls: string[] = [];
    if (galleryVideos && galleryVideos.length > 0 && galleryVideos[0].size > 0) {
      for (const gVid of galleryVideos) {
        if (gVid && gVid.size > 0) {
          const vidExt = gVid.name.split('.').pop();
          const vidName = `scholar-gallery-vid-${Date.now()}-${Math.random().toString(36).substring(7)}.${vidExt}`;
          const vidPath = path.join(process.cwd(), 'public', 'uploads', 'videos');
          await require('fs/promises').mkdir(vidPath, { recursive: true });
          const nodeStream = Readable.fromWeb(gVid.stream() as any)
          const writeStream = createWriteStream(path.join(vidPath, vidName))
          await pipeline(nodeStream, writeStream)
          galleryVideoUrls.push(`/uploads/videos/${vidName}`);
        }
      }
    }

    // Build update payload
    const updateData: any = {
      bio,
      institution,
      qualification,
      specialization
    }

    if (videoUrl) updateData.video_url = videoUrl
    if (galleryImageUrls.length > 0) updateData.gallery_images = galleryImageUrls
    if (galleryVideoUrls.length > 0) updateData.gallery_videos = galleryVideoUrls

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
