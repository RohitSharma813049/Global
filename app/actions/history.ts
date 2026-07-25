'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function trackPublicationView(publicationId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false }

  const userId = session.user.id

  // Check if it's the first time this user is viewing it
  const { data: existingRecord } = await supabaseAdmin
    .from('reading_history')
    .select('id')
    .eq('user_id', userId)
    .eq('publication_id', publicationId)
    .single()

  const isNewView = !existingRecord;

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

  // Only actually increment the views counter for real data tracking if it's a new view
  if (isNewView) {
    try {
      await prisma.publications.update({
        where: { id: publicationId },
        data: { views: { increment: 1 } }
      });

      const pub = await prisma.publications.findUnique({
        where: { id: publicationId },
        select: { scholar_id: true }
    });

    if (pub?.scholar_id) {
      await prisma.scholars.update({
        where: { id: pub.scholar_id },
        data: { total_views: { increment: 1 } }
      });
    }
  } catch (incError) {
    console.error('Failed to increment views:', incError);
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

export async function trackPublicationDownload(publicationId: string) {
  try {
    await prisma.publications.update({
      where: { id: publicationId },
      data: { downloads: { increment: 1 } }
    });

    const pub = await prisma.publications.findUnique({
      where: { id: publicationId },
      select: { scholar_id: true }
    });

    if (pub?.scholar_id) {
      await prisma.scholars.update({
        where: { id: pub.scholar_id },
        data: { total_downloads: { increment: 1 } }
      });
    }
  } catch (err) {
    console.error('Failed to increment downloads:', err);
  }
}

