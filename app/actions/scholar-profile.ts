'use server'

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

    const { error } = await supabaseAdmin
      .from('scholars')
      .update({
        bio,
        institution,
        qualification,
        specialization
      })
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
