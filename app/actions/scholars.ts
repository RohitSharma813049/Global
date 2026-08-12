'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function createScholar(formData: any) {
  // Check auth
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized. Only admins can create scholars.' }
  }

  try {
    const { 
      name, initials, professional_role, description, 
      country, country_code, flag_emoji, domain,
      is_honorary, is_verified, is_featured,
      videos, publications 
    } = formData

    // Insert Scholar
    const { data: scholar, error: scholarError } = await supabaseAdmin
      .from('scholars')
      .insert({
        name, initials, professional_role, description,
        country, country_code, flag_emoji, domain,
        is_honorary, is_verified, is_featured
      })
      .select()
      .single()

    if (scholarError) throw scholarError

    const scholarId = scholar.id

    // Insert Videos
    if (videos && videos.length > 0) {
      const { error: videoError } = await supabaseAdmin
        .from('scholar_videos')
        .insert(videos.map((v: any) => ({ ...v, scholar_id: scholarId })))
      
      if (videoError) throw videoError
    }

    // Insert Publications
    if (publications && publications.length > 0) {
      const { error: pubError } = await supabaseAdmin
        .from('scholar_publications')
        .insert(publications.map((p: any) => ({ ...p, scholar_id: scholarId })))
      
      if (pubError) throw pubError
    }

    revalidatePath('/dashboard/admin/scholars')
    revalidatePath('/')
    
    return { success: true, scholarId }
  } catch (error: any) {
    console.error('Error creating scholar:', error)
    return { error: error.message || 'Failed to create scholar' }
  }
}

export async function deleteScholar(id: string) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized. Only admins can delete scholars.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('scholars')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/scholars')
    revalidatePath('/scholars')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting scholar:', error)
    return { error: error.message || 'Failed to delete scholar' }
  }
}

