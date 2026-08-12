'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { invalidateCache } from "@/lib/redis-cache"
import { prisma } from '@/lib/db'

import { blogSchema, newsSchema, testimonialSchema, magazineSchema } from '@/lib/validations/cms'

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
  const defaultSettings = {
    hero_title: 'Empowering Global Research & Knowledge Sharing',
    hero_subtitle: 'Explore millions of peer-reviewed papers, thesis, articles, and eBooks.',
    hero_image_url: '/placeholder-user.png',
    hero_slides: [
      { label: 'Featured Article', title: 'ESG Integration in GCC Markets: A Framework for Sustainable Finance', author: 'Dr. Priya Nair-Kapoor', cred: 'Hon. D.B.A.', badge: 'eBook', avatar: '/placeholder-user.png', image: '/placeholder-user.png' },
      { label: 'Research Paper', title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm', author: 'Dr. Ngozi Adeyemi', cred: 'Ph.D., FAAN', badge: 'Article', avatar: '/placeholder-user.png', image: '/placeholder-user.png' },
      { label: 'GSP Interview Series', title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050', author: 'Dr. Amira Al-Rashidi', cred: 'Hon. D.Sc.', badge: 'Magazine', avatar: '/placeholder-user.png', image: '/placeholder-user.png' },
      { label: 'Featured eBook', title: 'GCC Economic Diversification: Vision 2030 and Beyond', author: 'Prof. Khalid Al-Mansouri', cred: 'Hon. D.B.A.', badge: 'eBook', avatar: '/placeholder-user.png', image: '/placeholder-user.png' },
      { label: 'Doctoral Thesis', title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments', author: 'Prof. Li Wei', cred: 'Ph.D.', badge: 'Thesis', avatar: '/placeholder-user.png', image: '/placeholder-user.png' }
    ],
    hero_ticker_items: [
      { prefix: 'New', text: 'ESG & Sustainable Finance — Dr. Priya Nair-Kapoor' },
      { prefix: 'Featured', text: 'GCC Economic Diversification — Prof. Khalid Al-Mansouri' },
      { prefix: 'Open Access', text: 'Decolonising Knowledge Systems — Dr. Ngozi Adeyemi' }
    ],
    hero_search_placeholder: 'Search journals, papers, authors, books…',
    hero_search_filters: ['All', 'Agriculture', 'Computer Science', 'Business', 'Humanities', 'Scholars'],
    hero_top_pill: 'Open Access 2026',
    hero_cta_primary_text: 'Explore Publications',
    hero_cta_secondary_text: 'Meet Our Scholars',
    hero_trust_text: '<strong>25,000+ researchers</strong> published<br />across 80 countries this year',
    hero_trust_avatars: [
      '/placeholder-user.png',
      '/placeholder-user.png',
      '/placeholder-user.png',
      '/placeholder-user.png'
    ],
    hero_stats: [
      { number: '12K+', label: 'Publications' },
      { number: '350+', label: 'Journals' },
      { number: '25K+', label: 'Researchers' },
      { number: '80+', label: 'Countries' }
    ],

    
    stats_title: 'Trusted by Scholars Worldwide',
    stats_subtitle: 'Platform Metrics',
    
    featured_title: 'Explore Trending Research',
    featured_subtitle: 'Featured Content',
    
    categories_title: 'Explore by Category',
    categories_subtitle: 'Browse Topics',
    
    how_it_works_title: 'How It Works',
    how_it_works_subtitle: 'Simple Process',
    how_it_works_steps: [
      { title: 'Sign Up', description: 'Create your account in seconds and join our global community of scholars.' },
      { title: 'Explore or Apply', description: 'Browse thousands of research papers, thesis, and publications or apply to become a publisher.' },
      { title: 'Publish & Read', description: 'Share your research with the world or read groundbreaking publications from peers.' }
    ],
    
    scholars_title: 'Featured Scholars',
    scholars_subtitle: 'Top Contributors',
    
    testimonials_title: 'What Scholars Say',
    testimonials_subtitle: 'Success Stories',

    show_stats_section: true,
    show_categories_section: true,
    show_featured_content: true,
    show_featured_scholars: true,
    show_testimonials: true,
    show_faq_section: true,
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Got questions? We have answers.',
    faqs: [
      { question: 'What is Global Scholar Publications?', answer: 'Global Scholar Publications is a platform for scholars to share and discover research, publications, and connect with other academics worldwide.' },
      { question: 'How can I publish my research?', answer: 'You can publish your research by signing up as a scholar and using the "Upload Publication" feature from your dashboard.' },
      { question: 'Is my data secure?', answer: 'Yes, we take security very seriously. All your data is encrypted and stored securely.' },
      { question: 'Can I collaborate with other researchers?', answer: 'Absolutely! Our platform is built for collaboration. You can connect with peers, co-author publications, and share datasets.' }
    ],

    featured_publications: [
      { type: 'Thesis', subject: 'Computer Science · Ethics', title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments', author: 'Prof. Li Wei, Ph.D.', authorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format&q=80', desc: 'A cross-cultural framework examining ethical accountability in AI systems deployed across divergent regulatory and academic research contexts.', img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=340&fit=crop&auto=format&q=80', views: '2.3k reads', link: '/publications' },
      { type: 'Article', subject: 'Social Sciences · Education', title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm', author: 'Dr. Ngozi Adeyemi, FAAN', authorImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=face&auto=format&q=80', desc: 'An incisive look at restructuring curricula and research methodology to center indigenous African epistemologies in higher education.', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=340&fit=crop&auto=format&q=80', views: '4.1k reads', link: '/publications' },
      { type: 'eBook', subject: 'Economics · Public Policy', title: 'GCC Economic Diversification: Vision 2030 and Beyond', author: 'Prof. Khalid Al-Mansouri', authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format&q=80', desc: "A comprehensive eBook tracing the GCC's structural shift away from hydrocarbon dependency through Vision 2030's policy levers.", img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=340&fit=crop&auto=format&q=80', views: '3.7k reads', link: '/publications' },
      { type: 'Magazine', subject: 'Environmental Policy', title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050', author: 'Dr. Amira Al-Rashidi, D.Sc.', authorImg: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&h=60&fit=crop&crop=face&auto=format&q=80', desc: "GSP's exclusive interview series feature exploring realistic decarbonisation pathways for emerging and transition economies.", img: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=500&h=340&fit=crop&auto=format&q=80', views: '1.9k reads', link: '/publications' }
    ],

    explore_categories: [
      { title: 'Featured<br/>Agriculture', count: '1,240+ Papers', image: '/placeholder-user.png', link: '/explore?category=agriculture' },
      { title: 'Trending<br/>Computer Science', count: '3,860+ Papers', image: '/placeholder-user.png', link: '/explore?category=computer-science-ai' },
      { title: 'Latest<br/>Business', count: '980+ Papers', image: '/placeholder-user.png', link: '/explore?category=business-management' },
      { title: 'Latest<br/>Humanities', count: '410+ Papers', image: '/placeholder-user.png', link: '/explore?category=humanities' }
    ],

    subject_categories: [
      { id: "01", name: 'Computer Science<br/>&amp; AI', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "02", name: 'Engineering<br/>&amp; Technology', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "03", name: 'Medical &amp;<br/>Health Sciences', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "04", name: 'Business &amp;<br/>Management', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "05", name: 'Social<br/>Sciences', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "06", name: 'Education', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "07", name: 'Humanities', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "08", name: 'Law', image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "09", name: 'Agriculture', image: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "10", name: 'Environmental<br/>Studies', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=400&fit=crop&auto=format&q=85' },
      { id: "11", name: 'Other<br/>Disciplines', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop&auto=format&q=85' }
    ],

    enable_carousel_autoplay: true
  }

  const settingsRow = await prisma.homepage_settings.findFirst({
    orderBy: { created_at: 'desc' }
  })
  
  if (!settingsRow) {
    return defaultSettings
  }
  
  const dbSettings = settingsRow.settings as any;
  return { 
    ...dbSettings,
    faqs: Array.isArray(dbSettings.faqs) ? dbSettings.faqs : defaultSettings.faqs,
    explore_categories: Array.isArray(dbSettings.explore_categories) ? dbSettings.explore_categories : defaultSettings.explore_categories,
    subject_categories: Array.isArray(dbSettings.subject_categories) ? dbSettings.subject_categories : defaultSettings.subject_categories,
    hero_slides: Array.isArray(dbSettings.hero_slides) ? dbSettings.hero_slides : defaultSettings.hero_slides,
    hero_ticker_items: Array.isArray(dbSettings.hero_ticker_items) ? dbSettings.hero_ticker_items : defaultSettings.hero_ticker_items,
    hero_search_filters: Array.isArray(dbSettings.hero_search_filters) ? dbSettings.hero_search_filters : defaultSettings.hero_search_filters,
    hero_trust_avatars: Array.isArray(dbSettings.hero_trust_avatars) ? dbSettings.hero_trust_avatars : defaultSettings.hero_trust_avatars,
    hero_stats: Array.isArray(dbSettings.hero_stats) ? dbSettings.hero_stats : defaultSettings.hero_stats,
    featured_publications: Array.isArray(dbSettings.featured_publications) ? dbSettings.featured_publications : defaultSettings.featured_publications,
    how_it_works_steps: Array.isArray(dbSettings.how_it_works_steps) ? dbSettings.how_it_works_steps : defaultSettings.how_it_works_steps
  }
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
  
  await invalidateCache(['cms-homepage-settings', 'cms-blogs', 'cms-news', 'cms-featured-scholars'])
  revalidatePath('/')
  revalidatePath('/dashboard/admin/settings')
  return { success: true }

}

// ---- BLOGS ----

export async function getBlogs() {
  const existing = await prisma.homepage_settings.findFirst()
  const settings = (existing?.settings as any) || {}
  const pinned = Array.isArray(settings.featured_blog_ids) ? settings.featured_blog_ids : []
  
  const blogs = await prisma.blogs.findMany({
    where: { deleted_at: null },
    orderBy: { created_at: 'desc' },
    take: 50
  })
  
  return blogs.map(b => ({
    ...b,
    is_featured: pinned.includes(b.id)
  }))
}

export async function createBlog(data: { title: string, slug: string, content: string, cover_image?: string }) {
  const session = await checkAdmin()
  const parsed = blogSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
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

export async function updateBlog(id: string, data: { title: string, slug: string, content: string, cover_image?: string }) {
  await checkAdmin()
  const parsed = blogSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
  await prisma.blogs.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  })
  revalidatePath('/blog')
  revalidatePath('/dashboard/admin/blogs')
}

export async function deleteBlog(id: string) {
  await checkAdmin()
  await prisma.blogs.update({ where: { id }, data: { deleted_at: new Date() } })
  revalidatePath('/blog')
  revalidatePath('/dashboard/admin/blogs')
}

export async function toggleBlogFeaturedStatus(id: string, is_featured: boolean) {
  await checkAdmin()
  const existing = await prisma.homepage_settings.findFirst()
  let settings = (existing?.settings as any) || {}
  let pinned = Array.isArray(settings.featured_blog_ids) ? settings.featured_blog_ids : []
  
  if (is_featured) {
    if (!pinned.includes(id)) pinned.push(id)
  } else {
    pinned = pinned.filter((p: string) => p !== id)
  }
  
  settings.featured_blog_ids = pinned
  
  if (existing) {
    await prisma.homepage_settings.update({ where: { id: existing.id }, data: { settings } })
  } else {
    await prisma.homepage_settings.create({ data: { settings } })
  }
  revalidatePath('/')
  revalidatePath('/dashboard/admin/blogs')
}

// ---- NEWS ----

export async function getNews() {
  const existing = await prisma.homepage_settings.findFirst()
  const settings = (existing?.settings as any) || {}
  const pinned = Array.isArray(settings.featured_news_ids) ? settings.featured_news_ids : []
  
  const news = await prisma.news.findMany({
    where: { deleted_at: null },
    orderBy: { created_at: 'desc' },
    take: 50
  })
  
  return news.map(n => ({
    ...n,
    is_featured: pinned.includes(n.id)
  }))
}

export async function createNews(data: { title: string, slug: string, content: string, cover_image?: string }) {
  await checkAdmin()
  const parsed = newsSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
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

export async function updateNews(id: string, data: { title: string, slug: string, content: string, cover_image?: string }) {
  await checkAdmin()
  const parsed = newsSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
  await prisma.news.update({
    where: { id },
    data: {
      ...data,
      updated_at: new Date()
    }
  })
  revalidatePath('/news')
  revalidatePath('/dashboard/admin/news')
}

export async function deleteNews(id: string) {
  await checkAdmin()
  await prisma.news.update({ where: { id }, data: { deleted_at: new Date() } })
  revalidatePath('/news')
  revalidatePath('/dashboard/admin/news')
}

export async function toggleNewsFeaturedStatus(id: string, is_featured: boolean) {
  await checkAdmin()
  const existing = await prisma.homepage_settings.findFirst()
  let settings = (existing?.settings as any) || {}
  let pinned = Array.isArray(settings.featured_news_ids) ? settings.featured_news_ids : []
  
  if (is_featured) {
    if (!pinned.includes(id)) pinned.push(id)
  } else {
    pinned = pinned.filter((p: string) => p !== id)
  }
  
  settings.featured_news_ids = pinned
  
  if (existing) {
    await prisma.homepage_settings.update({ where: { id: existing.id }, data: { settings } })
  } else {
    await prisma.homepage_settings.create({ data: { settings } })
  }
  revalidatePath('/')
  revalidatePath('/dashboard/admin/news')
}

// ---- TESTIMONIALS ----

export async function getTestimonials() {
  const existing = await prisma.homepage_settings.findFirst()
  const settings = (existing?.settings as any) || {}
  const pinned = Array.isArray(settings.featured_testimonial_ids) ? settings.featured_testimonial_ids : []

  const test = await prisma.testimonials.findMany({
    orderBy: { created_at: 'desc' },
    take: 50
  })

  return test.map(t => ({
    ...t,
    is_featured: pinned.includes(t.id)
  }))
}

export async function createTestimonial(data: { quote: string, author: string, role: string, rating: number, image?: string }) {
  await checkAdmin()
  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
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

export async function toggleTestimonialFeaturedStatus(id: string, is_featured: boolean) {
  await checkAdmin()
  const existing = await prisma.homepage_settings.findFirst()
  let settings = (existing?.settings as any) || {}
  let pinned = Array.isArray(settings.featured_testimonial_ids) ? settings.featured_testimonial_ids : []
  
  if (is_featured) {
    if (!pinned.includes(id)) pinned.push(id)
  } else {
    pinned = pinned.filter((p: string) => p !== id)
  }
  
  settings.featured_testimonial_ids = pinned
  
  if (existing) {
    await prisma.homepage_settings.update({ where: { id: existing.id }, data: { settings } })
  } else {
    await prisma.homepage_settings.create({ data: { settings } })
  }
  revalidatePath('/')
  revalidatePath('/dashboard/admin/testimonials')
}

export async function updateTestimonial(id: string, data: { quote: string, author: string, role: string, rating: number, image?: string }) {
  await checkAdmin()
  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
  await prisma.testimonials.update({ where: { id }, data })
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
    orderBy: { total_views: 'desc' },
    take: 50
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


// ---- MAGAZINES ----

export async function createMagazine(data: { title: string, slug: string, content: string, cover_image?: string }) {
  const session = await checkAdmin()
  const parsed = magazineSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
  const { title, slug, content, cover_image } = parsed.data

  const existing = await prisma.magazines.findUnique({ where: { slug } })
  if (existing) throw new Error('A magazine with this slug already exists')

  await prisma.magazines.create({
    data: {
      title,
      slug,
      content,
      cover_image,
      author_id: session.user.id
    }
  })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/magazines')
}

export async function updateMagazine(id: string, data: { title: string, slug: string, content: string, cover_image?: string }) {
  await checkAdmin()
  const parsed = magazineSchema.safeParse(data)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || 'Validation failed'
    throw new Error(firstError)
  }
  const { title, slug, content, cover_image } = parsed.data

  const existing = await prisma.magazines.findUnique({ where: { slug } })
  if (existing && existing.id !== id) throw new Error('A magazine with this slug already exists')

  await prisma.magazines.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      cover_image
    }
  })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/magazines')
}

export async function deleteMagazine(id: string) {
  await checkAdmin()
  await prisma.magazines.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/magazines')
}

export async function toggleMagazineFeaturedStatus(id: string, is_featured: boolean) {
  await checkAdmin()
  await prisma.magazines.update({ where: { id }, data: { is_featured } })
  revalidatePath('/')
  revalidatePath('/dashboard/admin/magazines')
}

import { getMagazines } from '@/app/queries/cms'

export async function fetchMagazines() {
  return await getMagazines()
}
