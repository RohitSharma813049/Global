'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { prisma } from '@/lib/db'

// Note: For actual admin actions, we also verify session role.
async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    throw new Error('Unauthorized')
  }
  return session
}

// ---- HOMEPAGE SETTINGS ----

export async function getHomepageSettings() {
  const settingsRow = await prisma.homepage_settings.findFirst({
    orderBy: { created_at: 'desc' }
  })
  if (!settingsRow) {
    return {
      hero_title: 'Empowering Global Research & Knowledge Sharing',
      hero_subtitle: 'Discover millions of peer-reviewed papers, thesis, articles, and eBooks.',
      hero_image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070',
      
      stats_title: 'Trusted by Scholars Worldwide',
      stats_subtitle: 'Platform Metrics',
      
      featured_title: 'Discover Trending Research',
      featured_subtitle: 'Featured Content',
      
      categories_title: 'Explore by Category',
      categories_subtitle: 'Browse Topics',
      
      how_it_works_title: 'How It Works',
      how_it_works_subtitle: 'Simple Process',
      
      scholars_title: 'Featured Scholars',
      scholars_subtitle: 'Top Contributors',
      
      testimonials_title: 'What Scholars Say',
      testimonials_subtitle: 'Success Stories',

      show_stats_section: true,
      show_categories_section: true,
      show_featured_content: true,
      show_featured_scholars: true,
      show_testimonials: true,
    }
  }
  return settingsRow.settings as any
}

export async function updateHomepageSettings(newSettings: any) {
  await checkAdmin()
  
  const existing = await prisma.homepage_settings.findFirst()
  if (existing) {
    await prisma.homepage_settings.update({
      where: { id: existing.id },
      data: { settings: newSettings }
    })
  } else {
    await prisma.homepage_settings.create({
      data: { settings: newSettings }
    })
  }
  
  revalidatePath('/')
  revalidatePath('/dashboard/admin/settings')
  return { success: true }
}

// ---- BLOGS ----

export async function getBlogs() {
  return await prisma.blogs.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function createBlog(data: { title: string, slug: string, content: string, cover_image?: string }) {
  const session = await checkAdmin()
  await prisma.blogs.create({
    data: {
      ...data,
      author_id: session.user.id,
      status: 'published'
    }
  })
  revalidatePath('/blog')
  revalidatePath('/dashboard/admin/blogs')
}

export async function deleteBlog(id: string) {
  await checkAdmin()
  await prisma.blogs.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/dashboard/admin/blogs')
}

// ---- NEWS ----

export async function getNews() {
  return await prisma.news.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function createNews(data: { title: string, slug: string, content: string, cover_image?: string }) {
  await checkAdmin()
  await prisma.news.create({
    data: {
      ...data,
      published_at: new Date(),
      status: 'published'
    }
  })
  revalidatePath('/news')
  revalidatePath('/dashboard/admin/news')
}

export async function deleteNews(id: string) {
  await checkAdmin()
  await prisma.news.delete({ where: { id } })
  revalidatePath('/news')
  revalidatePath('/dashboard/admin/news')
}

// ---- TESTIMONIALS ----

export async function getTestimonials() {
  return await prisma.testimonials.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function createTestimonial(data: { quote: string, author: string, role: string, rating: number, image?: string }) {
  await checkAdmin()
  await prisma.testimonials.create({ data })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/testimonials')
}

export async function deleteTestimonial(id: string) {
  await checkAdmin()
  await prisma.testimonials.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/testimonials')
}

// ---- FEATURED SCHOLARS ----

export async function getAllScholarsForAdmin() {
  await checkAdmin()
  return await prisma.scholars.findMany({
    include: {
      users: { select: { email: true, raw_user_meta_data: true } },
      _count: { select: { publications: true } }
    },
    orderBy: { total_views: 'desc' }
  })
}

export async function getFeaturedScholars() {
  return await prisma.scholars.findMany({
    where: { is_featured: true },
    include: {
      users: { select: { email: true, raw_user_meta_data: true } },
      _count: { select: { publications: true } }
    },
    orderBy: { total_views: 'desc' },
    take: 6
  })
}

export async function toggleScholarFeaturedStatus(id: string, is_featured: boolean) {
  await checkAdmin()
  await prisma.scholars.update({
    where: { id },
    data: { is_featured }
  })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/featured-scholars')
}
