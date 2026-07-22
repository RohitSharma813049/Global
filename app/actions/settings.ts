'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

import { prisma } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function getScholarProfile() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) return null

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(session.user.id)
    const userMeta = userData?.user?.user_metadata || {}

    const scholar = await prisma.scholars.findUnique({
      where: { user_id: session.user.id }
    })
    
    return {
      name: userMeta.name || session.user.name || "",
      email: session.user.email || "",
      country: userMeta.country || "",
      bio: scholar?.bio || userMeta.bio || "",
      institution: scholar?.institution || "",
      qualification: scholar?.qualification || "",
      specialization: scholar?.specialization || "",
      video_url: scholar?.video_url || userMeta.video_url || "",
      avatar_url: userMeta.avatar_url || session.user?.image || "",
      gallery_images: scholar?.gallery_images || [],
      gallery_videos: scholar?.gallery_videos || [],
    }
  } catch (error) {
    console.error("Error fetching settings data:", error)
    return null
  }
}

export async function updateProfile(
  name: string, 
  bio: string, 
  country?: string,
  avatar_url?: string,
  scholarData?: { 
    institution: string, 
    qualification: string, 
    specialization: string, 
    video_url?: string,
    gallery_images?: string[],
    gallery_videos?: string[]
  }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized")
    }

    // Get current metadata
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(session.user.id)
    const existingMeta = userData.user?.user_metadata || {}

    // Update user metadata in Supabase
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      session.user.id,
      { user_metadata: { ...existingMeta, name, bio, country: country || existingMeta.country, avatar_url: avatar_url || existingMeta.avatar_url, video_url: scholarData?.video_url || existingMeta.video_url } }
    )

    if (error) throw error

    if (scholarData) {
      await prisma.scholars.upsert({
        where: { user_id: session.user.id },
        update: {
          bio,
          institution: scholarData.institution,
          qualification: scholarData.qualification,
          specialization: scholarData.specialization,
          video_url: scholarData.video_url,
          gallery_images: scholarData.gallery_images || [],
          gallery_videos: scholarData.gallery_videos || [],
        },
        create: {
          users: { connect: { id: session.user.id } },
          bio,
          institution: scholarData.institution,
          qualification: scholarData.qualification,
          specialization: scholarData.specialization,
          video_url: scholarData.video_url,
          gallery_images: scholarData.gallery_images || [],
          gallery_videos: scholarData.gallery_videos || [],
        }
      })
    } else {
      // Just update bio if they are a scholar anyway
      const scholar = await prisma.scholars.findUnique({ where: { user_id: session.user.id } })
      if (scholar) {
        await prisma.scholars.update({
          where: { user_id: session.user.id },
          data: { bio }
        })
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return { error: error.message || "Failed to update profile" }
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized")
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      session.user.id,
      { password: newPassword }
    )

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error updating password:", error)
    return { error: error.message || "Failed to update password" }
  }
}

export async function uploadVideoFile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) throw new Error("Unauthorized")

    const file = formData.get("video") as File
    if (!file || file.size === 0) throw new Error("No file uploaded")

    // Limit to 100MB roughly
    if (file.size > 100 * 1024 * 1024) throw new Error("File too large (max 100MB)")

    const ext = file.name.split(".").pop()
    const fileName = `scholar-video-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const dirPath = path.join(process.cwd(), "public", "uploads", "videos")
    
    await mkdir(dirPath, { recursive: true })
    
    const filePath = path.join(dirPath, fileName)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    await writeFile(filePath, buffer)

    return { success: true, url: `/uploads/videos/${fileName}` }
  } catch (error: any) {
    console.error("Video upload error:", error)
    return { error: error.message || "Upload failed" }
  }
}

export async function uploadImageFile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) throw new Error("Unauthorized")

    const file = formData.get("image") as File
    if (!file || file.size === 0) throw new Error("No file uploaded")

    if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)")

    const ext = file.name.split(".").pop()
    const fileName = `scholar-gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const dirPath = path.join(process.cwd(), "public", "uploads", "images")
    
    await mkdir(dirPath, { recursive: true })
    
    const filePath = path.join(dirPath, fileName)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    await writeFile(filePath, buffer)

    return { success: true, url: `/uploads/images/${fileName}` }
  } catch (error: any) {
    console.error("Image upload error:", error)
    return { error: error.message || "Upload failed" }
  }
}
