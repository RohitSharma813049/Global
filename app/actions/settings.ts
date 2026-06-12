'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function updateProfile(name: string, bio: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized")
    }

    // Update user metadata in Supabase
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      session.user.id,
      { user_metadata: { name, bio } }
    )

    if (error) throw error

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
