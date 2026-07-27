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
import { getRecentPublishedPublications, getFeaturedPublications, getHeroPublications } from '@/app/queries/publications'

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
    dbPublications,
    dbFeaturedPublications,
    dbHeroPublications
  ] = await Promise.all([
    getHomepageSettings(),
    getBlogs(),
    getNews(),
    getPlatformStats(),
    getTestimonials(),
    getFeaturedScholars(),
    getAllCategories(),
    getRecentPublishedPublications(8),
    getFeaturedPublications(8),
    getHeroPublications(5)
  ]);

  const mapPublication = (pub: any) => ({
    id: pub.id,
    type: pub.content_type,
    subject: pub.categories?.name || 'Uncategorized',
    title: pub.title,
    author: pub.author_name || pub.scholars?.users?.raw_user_meta_data?.full_name || 'Anonymous',
    authorImg: pub.scholars?.users?.raw_user_meta_data?.avatar_url || pub.scholars?.users?.raw_user_meta_data?.picture || pub.scholars?.users?.raw_user_meta_data?.image || '/placeholder-user.png',
    desc: pub.abstract,
    description: pub.abstract,
    img: pub.cover_image || '/placeholder-user.png',
    image: pub.cover_image || '/placeholder-user.png',
    views: `${pub.views || 0} reads`,
    link: `/publications/${pub.id}`
  });

  const formattedPublications = dbPublications.map(mapPublication);
  const formattedFeaturedPublications = dbFeaturedPublications.map(mapPublication);

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
    image: cat.image_url || "/placeholder-user.png"
  }));

  const dynamicExploreCategories = [
    {
      title: 'Research Articles',
      count: `${statsData.articleCount}+ Papers`,
      image: settings.explore_categories?.[0]?.image || '/placeholder-user.png',
      link: '/explore?type=article'
    },
    {
      title: 'eBooks',
      count: `${statsData.ebookCount}+ Books`,
      image: settings.explore_categories?.[1]?.image || '/placeholder-user.png',
      link: '/explore?type=ebook'
    },
    {
      title: 'Magazines',
      count: `${statsData.magazineCount}+ Issues`,
      image: settings.explore_categories?.[2]?.image || '/placeholder-user.png',
      link: '/explore?type=magazine'
    },
    {
      title: 'Theses',
      count: `${statsData.thesisCount}+ Papers`,
      image: settings.explore_categories?.[3]?.image || '/placeholder-user.png',
      link: '/explore?type=thesis'
    }
  ];

  const exploreCategoriesToUse = settings.enable_dynamic_explore_categories !== false 
    ? dynamicExploreCategories 
    : settings.explore_categories;

  console.log("Rendering homepage with dynamic categories", formattedCategories);

  const finalScholars = () => {
    if (settings.featured_scholars_mode === 'hidden' || !settings.show_featured_scholars_gsp) return null;
    if (settings.featured_scholars_mode === 'manual') return settings.pinned_scholars || [];
    
    // Dynamic or Random
    const baseScholars = scholarsData || [];
    return [...baseScholars].sort(() => 0.5 - Math.random());
  };
  const scholarsToRender = finalScholars();

  const finalBlogs = () => {
    if (settings.featured_blogs_mode === 'hidden' || !settings.show_recent_blogs) return null;
    if (settings.featured_blogs_mode === 'manual') {
      return (settings.pinned_blogs || []).map((b: any, i: number) => ({
        id: `pinned-${i}`,
        title: b.title || '',
        slug: '#',
        cover_image: b.image || null,
        created_at: b.date ? new Date(b.date) : new Date(),
        type: b.badge?.toLowerCase() === 'news' ? 'news' : 'blog',
        excerpt: b.description || '',
        author_name: b.author || 'GSP Editorial',
      }));
    }
    
    // Dynamic or Random
    const baseBlogs = recentItems;
    if (settings.featured_blogs_mode === 'random') {
      return [...baseBlogs].sort(() => 0.5 - Math.random());
    }
    return baseBlogs;
  };
  const blogsToRender = finalBlogs();

  const finalHeroSlides = settings.hero_carousel_mode === 'manual' 
    ? settings.hero_slides 
    : (dbHeroPublications.length > 0 ? dbHeroPublications : (dbFeaturedPublications.length > 0 ? dbFeaturedPublications : dbPublications)).slice(0, 5).map((pub: any) => ({
        label: `Latest ${pub.content_type || 'Publication'}`,
        title: pub.title,
        author: pub.author_name || pub.scholars?.users?.raw_user_meta_data?.full_name || 'Anonymous',
        cred: pub.scholars?.qualification || '',
        badge: pub.content_type || 'Article',
        avatar: pub.scholars?.users?.raw_user_meta_data?.avatar_url || pub.scholars?.users?.raw_user_meta_data?.picture || pub.scholars?.users?.raw_user_meta_data?.image || '/placeholder-user.png',
        image: pub.cover_image || '/placeholder-user.png'
      }));

  const combinedPublications = [
    ...formattedFeaturedPublications,
    ...formattedPublications
  ];
  const uniqueCombined = Array.from(new Map(combinedPublications.map(item => [item.id, item])).values());
  
  const finalFeaturedPublications = [...(uniqueCombined.length > 0 
    ? uniqueCombined.slice(0, 8) 
    : settings.featured_publications || []
  )].sort(() => 0.5 - Math.random());

  return (
    <main className="w-full">
      {settings.show_home_hero && (
        <HomeHero 
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          eyebrow={settings.hero_eyebrow}
          slidesData={finalHeroSlides}
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
            categories={exploreCategoriesToUse}
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
            publications={finalFeaturedPublications}
          />
        </ScrollAnimation>
      )}

      {settings.show_featured_content_gsp && (
        <ScrollAnimation>
          <GspFeaturedContent 
            title={settings.featured_content_gsp_title}
            subtitle={settings.featured_content_gsp_subtitle}
            description={settings.featured_content_gsp_desc}
            publications={finalFeaturedPublications}
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

      {blogsToRender && blogsToRender.length > 0 && (
        <ScrollAnimation>
          <RecentNewsBlogs 
            items={blogsToRender} 
            autoplay={settings.enable_carousel_autoplay} 
          />
        </ScrollAnimation>
      )}
      
      {scholarsToRender && scholarsToRender.length > 0 && (
        <ScrollAnimation>
          <GspFeaturedScholars 
            title={settings.featured_scholars_gsp_title}
            subtitle={settings.featured_scholars_gsp_subtitle}
            scholars={scholarsToRender}
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
