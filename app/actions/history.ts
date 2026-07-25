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
  }

  return { success: true }
}

export async function getReadingHistory() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  try {
    const data = await prisma.$queryRaw`
      SELECT 
        rh.last_read_at,
        p.id as pub_id, p.title, p.abstract, p.content_type, p.author_name,
        c.name as category_name,
        s.id as scholar_id, s.user_id as scholar_user_id,
        u.raw_user_meta_data
      FROM public.reading_history rh
      JOIN public.publications p ON rh.publication_id = p.id
      LEFT JOIN public.categories c ON p.category_id = c.id
      LEFT JOIN public.scholars s ON p.scholar_id = s.id
      LEFT JOIN auth.users u ON s.user_id = u.id
      WHERE rh.user_id = ${session.user.id}
      ORDER BY rh.last_read_at DESC
      LIMIT 10
    `;

    const formattedData = (data as any[]).map(row => ({
      last_read_at: row.last_read_at,
      publications: {
        id: row.pub_id,
        title: row.title,
        abstract: row.abstract,
        content_type: row.content_type,
        categories: row.category_name ? { name: row.category_name } : null,
        scholars: row.scholar_id ? {
          id: row.scholar_id,
          users: {
            raw_user_meta_data: row.raw_user_meta_data || {
              full_name: row.author_name || "Unknown Author"
            }
          }
        } : null
      }
    }));

    return formattedData;
  } catch (error) {
    console.error('Failed to fetch reading history:', error)
    return []
  }
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

