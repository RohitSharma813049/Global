import Footer from "@/components/layout/footer"
import GspFeaturedScholars from "@/components/scholars/gsp-featured-scholars"

export const metadata = {
  title: 'GSP — Featured Scholars',
  description: 'Honorary Doctorates and Distinguished Faculty at Global Scholar Publications',
}

export default function FeaturedScholarsPage() {
  return (
    <>
      <main className="min-h-screen bg-white pt-20">
        <GspFeaturedScholars />
      </main>
      <Footer />
    </>
  )
}
