import dynamic from 'next/dynamic'
import HomeHero from "@/components/home/home-hero"

// Lazy load below-the-fold components
const FeaturedContent = dynamic(() => import("@/components/home/featured-content"))
const ExploreCategories = dynamic(() => import("@/components/home/explore-categories"))
const GspFeaturedContent = dynamic(() => import("@/components/home/gsp-featured-content"))
const GspExploreCategories = dynamic(() => import("@/components/home/gsp-explore-categories"))
const GspSubjectCategories = dynamic(() => import("@/components/home/gsp-subject-categories"))
const GspFeaturedScholars = dynamic(() => import("@/components/scholars/gsp-featured-scholars"))
const HowItWorks = dynamic(() => import("@/components/shared/how-it-works"))
const FeaturedScholars = dynamic(() => import("@/components/scholars/featured-scholars"))
const Testimonials = dynamic(() => import("@/components/shared/testimonials"))
const Footer = dynamic(() => import("@/components/layout/footer"))
const RecentNewsBlogs = dynamic(() => import("@/components/home/gsp-recent-blogs"))
const FaqSection = dynamic(() => import("@/components/shared/faq-section"))
const CtaBanner = dynamic(() => import("@/components/shared/cta-banner"))
import { getHomepageSettings, getBlogs, getNews, getTestimonials, getFeaturedScholars } from '@/app/queries/cms'
import { getPlatformStats } from '@/app/actions/stats'

import ScrollAnimation from "@/components/shared/scroll-animation"

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
      <ScrollAnimation><CtaBanner /></ScrollAnimation>
      <Footer />
    </main>
  )
}
