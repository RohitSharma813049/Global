'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function trackPublicationView(publicationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false }

  const userId = session.user.id

  // Upsert history record
  const { error } = await supabaseAdmin
    .from('reading_history')
    .upsert(
      { 
        user_id: userId, 
        publication_id: publicationId,
        last_read_at: new Date().toISOString()
      },
      { onConflict: 'user_id,publication_id' }
    )

  if (error) {
    console.error('Failed to track view history:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getReadingHistory() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  const { data, error } = await supabaseAdmin
    .from('reading_history')
    .select(`
      last_read_at,
      publications (
        id,
        title,
        abstract,
        content_type,
        scholars ( id, users ( raw_user_meta_data ) ),
        categories ( name )
      )
    `)
    .eq('user_id', session.user.id)
    .order('last_read_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Failed to fetch reading history:', error)
    return []
  }

  return data
}
