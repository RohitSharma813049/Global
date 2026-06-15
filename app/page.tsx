import Hero from '@/components/hero'
import Statistics from '@/components/statistics'
import FeaturedContent from '@/components/featured-content'
import ExploreCategories from '@/components/explore-categories'
import HowItWorks from '@/components/how-it-works'
import FeaturedScholars from '@/components/featured-scholars'
import Testimonials from '@/components/testimonials'
import Footer from '@/components/footer'
import RecentNewsBlogs from '@/components/recent-news-blogs'

import { getHomepageSettings, getBlogs, getNews, getTestimonials, getFeaturedScholars } from '@/app/actions/cms'
import { getPlatformStats } from '@/app/actions/stats'

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
    ...(blogsData || []).map(b => ({ ...b, type: 'blog' as const })),
    ...(newsData || []).map(n => ({ ...n, type: 'news' as const }))
  ].sort((a, b) => {
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    return timeB - timeA;
  }).slice(0, 8);

  return (
    <main className="w-full">
      <Hero 
        title={settings.hero_title}
        subtitle={settings.hero_subtitle}
        imageUrl={settings.hero_image_url}
      />
      {settings.show_stats_section && <Statistics title={settings.stats_title} subtitle={settings.stats_subtitle} statsData={statsData} />}
      {settings.show_featured_content && <FeaturedContent title={settings.featured_title} subtitle={settings.featured_subtitle} />}
      {settings.show_categories_section && <ExploreCategories title={settings.categories_title} subtitle={settings.categories_subtitle} />}
      <HowItWorks title={settings.how_it_works_title} subtitle={settings.how_it_works_subtitle} />
      {recentItems.length > 0 && <RecentNewsBlogs items={recentItems} />}
      {settings.show_featured_scholars && <FeaturedScholars title={settings.scholars_title} subtitle={settings.scholars_subtitle} scholars={scholarsData} />}
      {settings.show_testimonials && <Testimonials title={settings.testimonials_title} subtitle={settings.testimonials_subtitle} testimonials={testimonialsData} />}
      <Footer />
    </main>
  )
}
