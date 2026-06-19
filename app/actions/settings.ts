'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

import { prisma } from "@/lib/db"

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
      video_url: userMeta.video_url || ""
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
  scholarData?: { institution: string, qualification: string, specialization: string, video_url?: string }
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
      { user_metadata: { ...existingMeta, name, bio, country: country || existingMeta.country, video_url: scholarData?.video_url || existingMeta.video_url } }
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
        },
        create: {
          user_id: session.user.id,
          bio,
          institution: scholarData.institution,
          qualification: scholarData.qualification,
          specialization: scholarData.specialization,
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
