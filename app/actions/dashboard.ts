'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from '@/lib/db'

import { supabaseAdmin } from '@/lib/supabase-admin'

export async function getAdminStats() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    throw new Error('Unauthorized')
  }

  const [totalScholars, totalReaders, pendingPublications] = await Promise.all([
    prisma.scholars.count({ where: { deleted_at: null } }),
    prisma.profiles.count({ where: { role: { in: ['reader', 'user'] } } }),
    prisma.publications.count({ where: { status: 'pending', deleted_at: null } })
  ])

  return { totalScholars, totalReaders, pendingPublications }
}

export async function getScholarStats() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'scholar') {
    throw new Error('Unauthorized')
  }

  const scholar = await prisma.scholars.findUnique({
    where: { user_id: session.user.id },
    include: { publications: true }
  })

  if (!scholar) return { published: 0, views: 0, downloads: 0, drafts: [] }

  const activePublications = scholar.publications.filter(p => p.deleted_at === null)
  const publishedCount = activePublications.filter(p => p.status === 'published').length
  const drafts = activePublications.filter(p => p.status === 'draft')
  const totalViews = activePublications.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalDownloads = activePublications.reduce((sum, p) => sum + (p.downloads || 0), 0);
  
  return {
    published: publishedCount,
    views: totalViews,
    downloads: totalDownloads,
    drafts: drafts,
    publications: activePublications.map(p => ({
      title: p.title,
      views: p.views || 0,
      downloads: p.downloads || 0,
      status: p.status
    }))
  }
}

export async function getRecommendations() {
  try {
    const data = await prisma.$queryRaw`
      SELECT 
        p.id, p.title, p.abstract, p.content_type, p.created_at,
        p.views, p.downloads, p.file_url, p.cover_image, p.author_name, p.institution, p.email_address, p.status,
        c.name as category_name, c.slug as category_slug,
        s.id as scholar_id, s.user_id as scholar_user_id, s.profile_photo_url,
        u.raw_user_meta_data
      FROM public.publications p
      LEFT JOIN public.categories c ON p.category_id = c.id
      LEFT JOIN public.scholars s ON p.scholar_id = s.id
      LEFT JOIN auth.users u ON s.user_id = u.id
      WHERE p.status = 'published'
      ORDER BY p.views DESC
      LIMIT 4
    `;

    const formattedData = (data as any[]).map((p: any) => ({
      id: p.id,
      title: p.title,
      abstract: p.abstract,
      content_type: p.content_type,
      created_at: p.created_at?.toISOString() || new Date().toISOString(),
      views: Number(p.views) || 0,
      downloads: Number(p.downloads) || 0,
      file_url: p.file_url,
      cover_image: p.cover_image,
      author_name: p.author_name,
      categories: p.category_name ? { name: p.category_name, slug: p.category_slug } : null,
      scholars: p.scholar_id ? {
        id: p.scholar_id,
        user_id: p.scholar_user_id,
        profile_photo_url: p.profile_photo_url,
        users: {
          raw_user_meta_data: p.raw_user_meta_data || { 
            name: "Unknown Author",
            full_name: p.author_name || "Unknown Author" 
          }
        }
      } : null
    }));

    return formattedData;
  } catch (error: any) {
    console.error('[getRecommendations] Error fetching publications:', error)
    return []
  }
}
