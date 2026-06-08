import Hero from '@/components/hero'
import Statistics from '@/components/statistics'
import FeaturedContent from '@/components/featured-content'
import ExploreCategories from '@/components/explore-categories'
import HowItWorks from '@/components/how-it-works'
import FeaturedScholars from '@/components/featured-scholars'
import Testimonials from '@/components/testimonials'
import Footer from '@/components/footer'

export default function Page() {
  return (
    <main className="w-full">
      <Hero />
      <Statistics />
      <FeaturedContent />
      <ExploreCategories />
      <HowItWorks />
      <FeaturedScholars />
      <Testimonials />
      <Footer />
    </main>
  )
}
