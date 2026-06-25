import { prisma } from '@/lib/db'

export async function getHomepageSettings() {
  const defaultSettings = {
    hero_title: 'Empowering Global Research & Knowledge Sharing',
    hero_subtitle: 'Explore millions of peer-reviewed papers, thesis, articles, and eBooks.',
    hero_image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070',
    
    stats_title: 'Trusted by Scholars Worldwide',
    stats_subtitle: 'Platform Metrics',
    
    featured_title: 'Explore Trending Research',
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
    show_faq_section: true,
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Got questions? We have answers.',
    faqs: [
      { question: 'What is Global Scholar Publications?', answer: 'Global Scholar Publications is a platform for scholars to share and discover research, publications, and connect with other academics worldwide.' },
      { question: 'How can I publish my research?', answer: 'You can publish your research by signing up as a scholar and using the "Upload Publication" feature from your dashboard.' },
      { question: 'Is my data secure?', answer: 'Yes, we take security very seriously. All your data is encrypted and stored securely.' },
      { question: 'Can I collaborate with other researchers?', answer: 'Absolutely! Our platform is built for collaboration. You can connect with peers, co-author publications, and share datasets.' }
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
    ...defaultSettings, 
    ...dbSettings,
    faqs: Array.isArray(dbSettings.faqs) ? dbSettings.faqs : defaultSettings.faqs
  }
}

export async function getBlogs() {
  return await prisma.blogs.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function getNews() {
  return await prisma.news.findMany({
    orderBy: { created_at: 'desc' }
  })
}

export async function getTestimonials() {
  return await prisma.testimonials.findMany({
    orderBy: { created_at: 'desc' }
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
