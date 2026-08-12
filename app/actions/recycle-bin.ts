'use server'

import { prisma } from '@/lib/db'
import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type RecycleBinItem = {
  id: string
  title: string
  type: 'publication' | 'blog' | 'news' | 'magazine' | 'scholar' | 'user'
  deleted_at: string
  created_at?: string | null
  author?: string | null
  subtitle?: string | null
  status?: string | null
}

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getRecycleBinItems(): Promise<{ items: RecycleBinItem[], counts: Record<string, number> }> {
  await checkAdmin()

  try {
    const items: RecycleBinItem[] = []

    // 1. Publications
    const deletedPublications = await prisma.publications.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        title: true,
        content_type: true,
        author_name: true,
        deleted_at: true,
        created_at: true,
        status: true,
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedPublications.forEach(p => {
      items.push({
        id: p.id,
        title: p.title,
        type: 'publication',
        deleted_at: p.deleted_at?.toISOString() || new Date().toISOString(),
        created_at: p.created_at?.toISOString() || null,
        author: p.author_name || 'Unknown Author',
        subtitle: `Content Type: ${p.content_type}`,
        status: p.status
      })
    })

    // 2. Blogs
    const deletedBlogs = await prisma.blogs.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        title: true,
        slug: true,
        deleted_at: true,
        created_at: true,
        status: true,
        users: {
          select: {
            email: true,
            raw_user_meta_data: true
          }
        }
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedBlogs.forEach(b => {
      const authorMeta = b.users?.raw_user_meta_data as any
      const authorName = authorMeta?.name || b.users?.email || 'Admin'
      items.push({
        id: b.id,
        title: b.title,
        type: 'blog',
        deleted_at: b.deleted_at?.toISOString() || new Date().toISOString(),
        created_at: b.created_at?.toISOString() || null,
        author: authorName,
        subtitle: `Slug: /blog/${b.slug}`,
        status: b.status
      })
    })

    // 3. News
    const deletedNews = await prisma.news.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        title: true,
        slug: true,
        deleted_at: true,
        created_at: true,
        status: true,
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedNews.forEach(n => {
      items.push({
        id: n.id,
        title: n.title,
        type: 'news',
        deleted_at: n.deleted_at?.toISOString() || new Date().toISOString(),
        created_at: n.created_at?.toISOString() || null,
        subtitle: `Slug: /news/${n.slug}`,
        status: n.status
      })
    })

    // 4. Magazines
    const deletedMagazines = await prisma.magazines.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        title: true,
        slug: true,
        deleted_at: true,
        created_at: true,
        status: true,
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedMagazines.forEach(m => {
      items.push({
        id: m.id,
        title: m.title,
        type: 'magazine',
        deleted_at: m.deleted_at?.toISOString() || new Date().toISOString(),
        created_at: m.created_at?.toISOString() || null,
        subtitle: `Slug: /magazines/${m.slug}`,
        status: m.status
      })
    })

    // 5. Scholars
    const deletedScholars = await prisma.scholars.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        username: true,
        institution: true,
        qualification: true,
        deleted_at: true,
        users: {
          select: {
            email: true,
            raw_user_meta_data: true
          }
        }
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedScholars.forEach(s => {
      const meta = s.users?.raw_user_meta_data as any
      const scholarName = meta?.name || s.username || s.users?.email || 'Scholar'
      items.push({
        id: s.id,
        title: scholarName,
        type: 'scholar',
        deleted_at: s.deleted_at?.toISOString() || new Date().toISOString(),
        author: s.institution || s.qualification || 'Academic',
        subtitle: `@${s.username || 'scholar'} · ${s.users?.email || ''}`
      })
    })

    // 6. Soft-deleted Users (if any in auth.users)
    const deletedUsers = await prisma.users.findMany({
      where: { deleted_at: { not: null } },
      select: {
        id: true,
        email: true,
        role: true,
        raw_user_meta_data: true,
        deleted_at: true,
        created_at: true,
      },
      orderBy: { deleted_at: 'desc' }
    })

    deletedUsers.forEach(u => {
      const meta = u.raw_user_meta_data as any
      const name = meta?.name || u.email || 'User'
      items.push({
        id: u.id,
        title: name,
        type: 'user',
        deleted_at: u.deleted_at?.toISOString() || new Date().toISOString(),
        created_at: u.created_at?.toISOString() || null,
        author: u.email || '',
        subtitle: `Role: ${u.role || 'user'}`
      })
    })

    // Sort all items descending by deleted_at date
    items.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime())

    // Counts breakdown
    const counts = {
      all: items.length,
      publication: deletedPublications.length,
      blog: deletedBlogs.length,
      news: deletedNews.length,
      magazine: deletedMagazines.length,
      scholar: deletedScholars.length,
      user: deletedUsers.length,
    }

    return { items, counts }
  } catch (error: any) {
    console.error('Error fetching recycle bin items:', error)
    throw new Error(error.message || 'Failed to load recycle bin items')
  }
}

export async function restoreRecycleBinItem(id: string, type: string) {
  await checkAdmin()

  try {
    switch (type) {
      case 'publication':
        await prisma.publications.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/dashboard/admin/publications')
        revalidatePath('/explore')
        break

      case 'blog':
        await prisma.blogs.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/blog')
        revalidatePath('/dashboard/admin/blogs')
        break

      case 'news':
        await prisma.news.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/news')
        revalidatePath('/dashboard/admin/news')
        break

      case 'magazine':
        await prisma.magazines.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/dashboard/admin/magazines')
        break

      case 'scholar':
        await prisma.scholars.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/dashboard/admin/scholars')
        revalidatePath('/scholars')
        break

      case 'user':
        await prisma.users.update({
          where: { id },
          data: { deleted_at: null }
        })
        revalidatePath('/dashboard/admin/users')
        break

      default:
        throw new Error(`Unsupported item type: ${type}`)
    }

    revalidatePath('/dashboard/admin/recycle-bin')
    revalidatePath('/dashboard/super-admin/recycle-bin')
    return { success: true }
  } catch (error: any) {
    console.error('Error restoring recycle bin item:', error)
    return { error: error.message || 'Failed to restore item' }
  }
}

export async function permanentlyDeleteRecycleBinItem(id: string, type: string) {
  await checkAdmin()

  try {
    switch (type) {
      case 'publication':
        await prisma.publications.delete({ where: { id } })
        break

      case 'blog':
        await prisma.blogs.delete({ where: { id } })
        break

      case 'news':
        await prisma.news.delete({ where: { id } })
        break

      case 'magazine':
        await prisma.magazines.delete({ where: { id } })
        break

      case 'scholar':
        await prisma.scholars.delete({ where: { id } })
        break

      case 'user':
        // Clean up references & delete user account via Supabase
        await supabaseAdmin.from('scholar_applications').delete().eq('user_id', id)
        await supabaseAdmin.from('scholars').delete().eq('user_id', id)
        await supabaseAdmin.from('profiles').delete().eq('id', id)
        await supabaseAdmin.auth.admin.deleteUser(id)
        break

      default:
        throw new Error(`Unsupported item type: ${type}`)
    }

    revalidatePath('/dashboard/admin/recycle-bin')
    revalidatePath('/dashboard/super-admin/recycle-bin')
    return { success: true }
  } catch (error: any) {
    console.error('Error permanently deleting recycle bin item:', error)
    return { error: error.message || 'Failed to permanently delete item' }
  }
}

export async function emptyRecycleBin(typeFilter?: string) {
  await checkAdmin()

  try {
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'publication') {
      await prisma.publications.deleteMany({ where: { deleted_at: { not: null } } })
    }
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'blog') {
      await prisma.blogs.deleteMany({ where: { deleted_at: { not: null } } })
    }
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'news') {
      await prisma.news.deleteMany({ where: { deleted_at: { not: null } } })
    }
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'magazine') {
      await prisma.magazines.deleteMany({ where: { deleted_at: { not: null } } })
    }
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'scholar') {
      await prisma.scholars.deleteMany({ where: { deleted_at: { not: null } } })
    }
    if (!typeFilter || typeFilter === 'all' || typeFilter === 'user') {
      await prisma.users.deleteMany({ where: { deleted_at: { not: null } } })
    }

    revalidatePath('/dashboard/admin/recycle-bin')
    revalidatePath('/dashboard/super-admin/recycle-bin')
    return { success: true }
  } catch (error: any) {
    console.error('Error emptying recycle bin:', error)
    return { error: error.message || 'Failed to empty recycle bin' }
  }
}
