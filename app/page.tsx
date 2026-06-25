import dynamic from 'next/dynamic'
import HomeHero from '@/components/home-hero'

// Lazy load below-the-fold components
const FeaturedContent = dynamic(() => import('@/components/featured-content'))
const ExploreCategories = dynamic(() => import('@/components/explore-categories'))
const GspFeaturedContent = dynamic(() => import('@/components/gsp-featured-content'))
const GspExploreCategories = dynamic(() => import('@/components/gsp-explore-categories'))
const GspSubjectCategories = dynamic(() => import('@/components/gsp-subject-categories'))
const GspFeaturedScholars = dynamic(() => import('@/components/gsp-featured-scholars'))
const HowItWorks = dynamic(() => import('@/components/how-it-works'))
const FeaturedScholars = dynamic(() => import('@/components/featured-scholars'))
const Testimonials = dynamic(() => import('@/components/testimonials'))
const Footer = dynamic(() => import('@/components/footer'))
const RecentNewsBlogs = dynamic(() => import('@/components/gsp-recent-blogs'))
const FaqSection = dynamic(() => import('@/components/faq-section'))
import { getHomepageSettings, getBlogs, getNews, getTestimonials, getFeaturedScholars } from '@/app/actions/cms'
import { getPlatformStats } from '@/app/actions/stats'

import ScrollAnimation from '@/components/scroll-animation'

export const revalidate = 60 // Enable ISR caching (60 seconds)

export default async function Page() {
  const [settings, blogsData, newsData, statsData, testimonialsData, scholarsData] = await Promise.all([
    getHomepageSettings(),
    getBlogs(),
    getNews(),
    getPlatformStats(),
    getTestimonials(),
    getFeaturedScholars()
  ]);

  const recentItems = [
    ...(blogsData || []).map((b: any) => ({ ...b, type: 'blog' as const })),
    ...(newsData || []).map((n: any) => ({ ...n, type: 'news' as const }))
  ].sort((a, b) => {
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    return timeB - timeA;
  }).slice(0, 8);

  return (
    <main className="w-full">
      <HomeHero />
                   {/* New Custom Sections */}
      <GspExploreCategories />
      <GspSubjectCategories />
      {settings.show_featured_content && <ScrollAnimation><FeaturedContent title={settings.featured_title} subtitle={settings.featured_subtitle} autoplay={settings.enable_carousel_autoplay} /></ScrollAnimation>}
      <GspFeaturedContent />
      {/* {settings.show_categories_section && <ExploreCategories title={settings.categories_title} subtitle={settings.categories_subtitle} />} */}
      

  

      <HowItWorks title={settings.how_it_works_title} subtitle={settings.how_it_works_subtitle} />
      {recentItems.length > 0 && <ScrollAnimation><RecentNewsBlogs items={recentItems} autoplay={settings.enable_carousel_autoplay} /></ScrollAnimation>}
      
      <GspFeaturedScholars />
      {/* {settings.show_featured_scholars && <ScrollAnimation><FeaturedScholars title={settings.scholars_title} subtitle={settings.scholars_subtitle} scholars={scholarsData} autoplay={settings.enable_carousel_autoplay} /></ScrollAnimation>} */}
      {settings.show_testimonials && <ScrollAnimation><Testimonials title={settings.testimonials_title} subtitle={settings.testimonials_subtitle} testimonials={testimonialsData} autoplay={settings.enable_carousel_autoplay} /></ScrollAnimation>}
      {settings.show_faq_section && settings.faqs && settings.faqs.length > 0 && <ScrollAnimation><FaqSection title={settings.faq_title} subtitle={settings.faq_subtitle} faqs={settings.faqs} /></ScrollAnimation>}
      <Footer />
    </main>
  )
}
