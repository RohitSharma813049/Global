import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getHomepageSettings = unstable_cache(
  async () => {
    const defaultSettings = {
      show_home_hero: true,
      hero_title: 'Advancing Global<br /><em>Scholarly Excellence</em>',
      hero_eyebrow: 'Peer-Reviewed · Open Access · Global Impact',
      hero_subtitle: 'A home for distinguished scholars, honorary doctorate holders, and original research voices — connecting ideas across 80 nations and 350+ peer-reviewed journals.',
      hero_image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070',
      hero_slides: [
        { label: 'Featured Article', title: 'ESG Integration in GCC Markets: A Framework for Sustainable Finance', author: 'Dr. Priya Nair-Kapoor', cred: 'Hon. D.B.A.', badge: 'eBook', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=60&h=60&fit=crop&crop=face&auto=format&q=80', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=900&fit=crop&auto=format&q=85' },
        { label: 'Research Paper', title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm', author: 'Dr. Ngozi Adeyemi', cred: 'Ph.D., FAAN', badge: 'Article', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&face&auto=format&q=80', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=900&fit=crop&auto=format&q=85' },
        { label: 'GSP Interview Series', title: 'Climate Policy in Transition Economies: Pathways to Net Zero by 2050', author: 'Dr. Amira Al-Rashidi', cred: 'Hon. D.Sc.', badge: 'Magazine', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=60&h=60&fit=crop&crop=face&auto=format&q=80', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=900&fit=crop&auto=format&q=85' },
        { label: 'Featured eBook', title: 'GCC Economic Diversification: Vision 2030 and Beyond', author: 'Prof. Khalid Al-Mansouri', cred: 'Hon. D.B.A.', badge: 'eBook', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format&q=80', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=900&fit=crop&auto=format&q=85' },
        { label: 'Doctoral Thesis', title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments', author: 'Prof. Li Wei', cred: 'Ph.D.', badge: 'Thesis', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format&q=80', image: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=1200&h=900&fit=crop&auto=format&q=85' }
      ],
      hero_ticker_items: [
        { prefix: 'New', text: 'ESG & Sustainable Finance — Dr. Priya Nair-Kapoor' },
        { prefix: 'Featured', text: 'GCC Economic Diversification — Prof. Khalid Al-Mansouri' },
        { prefix: 'Open Access', text: 'Decolonising Knowledge Systems — Dr. Ngozi Adeyemi' }
      ],
      hero_search_placeholder: 'Search journals, papers, authors, books…',
      hero_search_filters: ['All', 'Articles', 'eBooks', 'Theses', 'Magazines', 'Scholars'],
      hero_top_pill: 'Open Access 2026',
      hero_cta_primary_text: 'Explore Publications',
      hero_cta_secondary_text: 'Meet Our Scholars',
      hero_trust_text: '<strong>25,000+ researchers</strong> published<br />across 80 countries this year',
      hero_trust_avatars: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=80',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=80'
      ],
      hero_stats: [
        { number: '12K+', label: 'Publications' },
        { number: '350+', label: 'Journals' },
        { number: '25K+', label: 'Researchers' },
        { number: '80+', label: 'Countries' }
      ],
      enable_dynamic_hero_stats: false,

      show_stats_section: true,
      stats_title: 'Trusted by Scholars Worldwide',
      stats_subtitle: 'Platform Metrics',
      
      show_featured_content: true,
      featured_title: 'Explore Trending Research',
      featured_subtitle: 'Featured Content',

      show_featured_content_gsp: true,
      featured_content_gsp_title: 'Featured <em>Research</em>',
      featured_content_gsp_subtitle: 'Curated Content',
      
      show_categories_section: true,
      categories_title: 'Explore by Category',
      categories_subtitle: 'Browse Topics',

      enable_dynamic_subject_categories: false,

      show_explore_categories_gsp: true,
      explore_categories_gsp_title: 'Publication <em>Categories</em>',
      explore_categories_gsp_subtitle: 'Browse By Format',

      show_subject_categories_gsp: true,
      subject_categories_gsp_title: 'Browse by <em>Subject</em>',
      subject_categories_gsp_subtitle: 'Academic Disciplines',
      
      show_how_it_works: true,
      how_it_works_title: 'Publish in 3 Steps',
      how_it_works_subtitle: 'Simple Process',
      how_it_works_steps: [
        { title: 'Sign Up', description: 'Create your account in seconds and join our global community of scholars.' },
        { title: 'Explore or Apply', description: 'Browse thousands of research papers, thesis, and publications or apply to become a publisher.' },
        { title: 'Publish & Read', description: 'Share your research with the world or read groundbreaking publications from peers.' }
      ],
      
      show_featured_scholars: true,
      scholars_title: 'Featured Scholars',
      scholars_subtitle: 'Top Contributors',

      show_featured_scholars_gsp: true,
      featured_scholars_gsp_title: 'Featured <em>Scholars</em>',
      featured_scholars_gsp_subtitle: 'Global Excellence',
      
      show_testimonials: true,
      testimonials_title: 'What Scholars Say',
      testimonials_subtitle: 'Success Stories',

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
        { title: 'Featured<br/>Thesis', count: '1,240+ Theses', image: '/placeholder.svg', link: '/explore?category=theses' },
        { title: 'Trending<br/>Articles', count: '3,860+ Articles', image: '/placeholder.svg', link: '/explore?category=articles' },
        { title: 'Latest<br/>eBooks', count: '980+ eBooks', image: '/placeholder.svg', link: '/explore?category=ebooks' },
        { title: 'Latest<br/>Magazine', count: '410+ Issues', image: '/placeholder.svg', link: '/explore?category=magazine' }
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

      show_cta_banner: true,

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
      faqs: Array.isArray(dbSettings.faqs) ? dbSettings.faqs : defaultSettings.faqs,
      explore_categories: Array.isArray(dbSettings.explore_categories) ? dbSettings.explore_categories : defaultSettings.explore_categories,
      subject_categories: Array.isArray(dbSettings.subject_categories) ? dbSettings.subject_categories : defaultSettings.subject_categories,
      hero_slides: Array.isArray(dbSettings.hero_slides) ? dbSettings.hero_slides : defaultSettings.hero_slides,
      hero_ticker_items: Array.isArray(dbSettings.hero_ticker_items) ? dbSettings.hero_ticker_items : defaultSettings.hero_ticker_items,
      hero_trust_avatars: Array.isArray(dbSettings.hero_trust_avatars) ? dbSettings.hero_trust_avatars : defaultSettings.hero_trust_avatars,
      hero_stats: Array.isArray(dbSettings.hero_stats) ? dbSettings.hero_stats : defaultSettings.hero_stats,
      featured_publications: Array.isArray(dbSettings.featured_publications) ? dbSettings.featured_publications : defaultSettings.featured_publications,
      how_it_works_steps: Array.isArray(dbSettings.how_it_works_steps) ? dbSettings.how_it_works_steps : defaultSettings.how_it_works_steps
    }
  },
  ['cms-homepage-settings'],
  { revalidate: 60, tags: ['cms-homepage-settings'] }
)

export const getBlogs = unstable_cache(
  async () => {
    return await prisma.blogs.findMany({
      orderBy: { created_at: 'desc' },
      take: 500
    })
  },
  ['cms-blogs'],
  { revalidate: 60, tags: ['cms-blogs'] }
)

export const getNews = unstable_cache(
  async () => {
    return await prisma.news.findMany({
      orderBy: { created_at: 'desc' },
      take: 500
    })
  },
  ['cms-news'],
  { revalidate: 60, tags: ['cms-news'] }
)

export const getTestimonials = unstable_cache(
  async () => {
    return await prisma.testimonials.findMany({
      orderBy: { created_at: 'desc' },
      take: 500
    })
  },
  ['cms-testimonials'],
  { revalidate: 60, tags: ['cms-testimonials'] }
)

export const getFeaturedScholars = unstable_cache(
  async () => {
    return await prisma.scholars.findMany({
      where: { is_featured: true },
      include: {
        users: { select: { email: true, raw_user_meta_data: true } },
        _count: { select: { publications: true } }
      },
      orderBy: { total_views: 'desc' },
      take: 6
    })
  },
  ['cms-featured-scholars'],
  { revalidate: 60, tags: ['cms-featured-scholars'] }
)
