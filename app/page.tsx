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
import { getAllCategories } from '@/app/queries/categories'
import { getRecentPublishedPublications } from '@/app/queries/publications'

export const revalidate = 60 // Enable ISR caching (60 seconds)

export default async function Page() {
  const [
    settings,
    blogsData,
    newsData,
    statsData,
    testimonialsData,
    scholarsData,
    dbCategories,
    dbPublications
  ] = await Promise.all([
    getHomepageSettings(),
    getBlogs(),
    getNews(),
    getPlatformStats(),
    getTestimonials(),
    getFeaturedScholars(),
    getAllCategories(),
    getRecentPublishedPublications(8)
  ]);

  const formattedPublications = dbPublications.map((pub: any) => ({
    id: pub.id,
    type: pub.content_type,
    subject: pub.categories?.name || 'Uncategorized',
    title: pub.title,
    author: pub.author_name || pub.scholars?.users?.raw_user_meta_data?.full_name || 'Anonymous',
    authorImg: pub.scholars?.users?.raw_user_meta_data?.avatar_url || '/placeholder-user.jpg',
    desc: pub.abstract,
    description: pub.abstract,
    img: pub.cover_image || '/placeholder.svg',
    image: pub.cover_image || '/placeholder.svg',
    views: `${pub.views || 0} reads`,
    link: `/publications/${pub.id}`
  }));

  const recentItems = [
    ...(blogsData || []).map((b: any) => ({ ...b, type: 'blog' as const })),
    ...(newsData || []).map((n: any) => ({ ...n, type: 'news' as const }))
  ].sort((a, b) => {
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    return timeB - timeA;
  }).slice(0, 8);

  const totalPublications = statsData.articleCount + statsData.ebookCount + statsData.magazineCount + statsData.thesisCount;
  
  const dynamicStats = settings.hero_stats.map((stat: any) => {
    const labelLower = stat.label.toLowerCase();
    if (labelLower === 'publications' || labelLower === 'publication') {
      return { ...stat, number: totalPublications.toString() };
    }
    if (labelLower === 'researchers' || labelLower === 'scholars' || labelLower === 'researcher' || labelLower === 'scholar') {
      return { ...stat, number: statsData.scholarsCount.toString() };
    }
    return stat;
  });

  const finalStats = settings.enable_dynamic_hero_stats ? dynamicStats : settings.hero_stats;

  const formattedCategories = dbCategories.slice(0, 12).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    image: cat.image_url || "/placeholder-user.jpg"
  }));

  console.log("Rendering homepage with dynamic categories", formattedCategories);

  return (
    <main className="w-full">
      {settings.show_home_hero && (
        <HomeHero 
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          eyebrow={settings.hero_eyebrow}
          slidesData={settings.hero_slides}
          tickerItems={settings.hero_ticker_items}
          searchPlaceholder={settings.hero_search_placeholder}
          searchFilters={settings.hero_search_filters}
          topPill={settings.hero_top_pill}
          ctaSecondaryText={settings.hero_cta_secondary_text}
          trustText={settings.hero_trust_text}
          trustAvatars={settings.hero_trust_avatars}
          stats={finalStats}
        />
      )}

      {settings.show_explore_categories_gsp && (
        <ScrollAnimation>
          <GspExploreCategories 
            title={settings.explore_categories_gsp_title} 
            subtitle={settings.explore_categories_gsp_subtitle} 
            categories={settings.explore_categories}
          />
        </ScrollAnimation>
      )}

      {settings.show_subject_categories_gsp && (
        <ScrollAnimation>
          <GspSubjectCategories 
            title={settings.subject_categories_gsp_title} 
            subtitle={settings.subject_categories_gsp_subtitle} 
            categories={settings.enable_dynamic_subject_categories ? formattedCategories : settings.subject_categories}
            autoplay={settings.enable_carousel_autoplay}
          />
        </ScrollAnimation>
      )}

      {settings.show_featured_content && (
        <ScrollAnimation>
          <FeaturedContent 
            title={settings.featured_title} 
            subtitle={settings.featured_subtitle} 
            autoplay={settings.enable_carousel_autoplay} 
            publications={formattedPublications}
          />
        </ScrollAnimation>
      )}

      {settings.show_featured_content_gsp && (
        <ScrollAnimation>
          <GspFeaturedContent 
            title={settings.featured_content_gsp_title}
            subtitle={settings.featured_content_gsp_subtitle}
            publications={formattedPublications.length > 0 ? formattedPublications : settings.featured_publications}
            autoplay={settings.enable_carousel_autoplay}
          />
        </ScrollAnimation>
      )}
      
      {settings.show_how_it_works && (
        <HowItWorks 
          title={settings.how_it_works_title} 
          subtitle={settings.how_it_works_subtitle} 
          steps={settings.how_it_works_steps}
        />
      )}

      {recentItems.length > 0 && (
        <ScrollAnimation>
          <RecentNewsBlogs 
            items={recentItems} 
            autoplay={settings.enable_carousel_autoplay} 
          />
        </ScrollAnimation>
      )}
      
      {settings.show_featured_scholars_gsp && (
        <ScrollAnimation>
          <GspFeaturedScholars 
            title={settings.featured_scholars_gsp_title}
            subtitle={settings.featured_scholars_gsp_subtitle}
            scholars={scholarsData}
            autoplay={settings.enable_carousel_autoplay}
          />
        </ScrollAnimation>
      )}

      {settings.show_testimonials && (
        <ScrollAnimation>
          <Testimonials 
            title={settings.testimonials_title} 
            subtitle={settings.testimonials_subtitle} 
            testimonials={testimonialsData} 
            autoplay={settings.enable_carousel_autoplay} 
          />
        </ScrollAnimation>
      )}

      {settings.show_faq_section && settings.faqs && settings.faqs.length > 0 && (
        <ScrollAnimation>
          <FaqSection 
            title={settings.faq_title} 
            subtitle={settings.faq_subtitle} 
            faqs={settings.faqs} 
          />
        </ScrollAnimation>
      )}

      {settings.show_cta_banner && (
        <ScrollAnimation>
          <CtaBanner 
            title={settings.cta_title}
            subtitle={settings.cta_subtitle}
          />
        </ScrollAnimation>
      )}

      <Footer />
    </main>
  )
}
