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

  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const totalReaders = users?.users?.filter((u: any) => !u.user_metadata?.role || u.user_metadata?.role === 'reader' || u.user_metadata?.role === 'user').length || 0

  const [totalScholars, pendingPublications] = await Promise.all([
    prisma.scholars.count(),
    prisma.publications.count({ where: { status: 'pending' } })
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

  const publishedCount = scholar.publications.filter(p => p.status === 'published').length
  const drafts = scholar.publications.filter(p => p.status === 'draft')
  
  return {
    published: publishedCount,
    views: scholar.total_views || 0,
    downloads: scholar.total_downloads || 0,
    drafts: drafts,
    publications: scholar.publications.map(p => ({
      title: p.title,
      views: p.views || 0,
      downloads: p.downloads || 0,
      status: p.status
    }))
  }
}
