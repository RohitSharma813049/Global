import { prisma } from "@/lib/db"
import Footer from "@/components/layout/footer"
import ScholarsClient from "./ScholarsClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Distinguished Scholars & Researchers | Global Scholar Publications",
  description: "Browse academic profiles, published works, theses, and research papers from top scholars and researchers worldwide.",
  openGraph: {
    title: "Distinguished Scholars & Researchers | Global Scholar Publications",
    description: "Browse academic profiles, published works, theses, and research papers from top scholars worldwide.",
    url: "https://global-wine.vercel.app/scholars",
    siteName: "Global Scholar Publications",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distinguished Scholars & Researchers | Global Scholar Publications",
    description: "Browse academic profiles, published works, theses, and research papers from top scholars worldwide.",
  }
}

export default async function ScholarsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = (typeof params.q === 'string' ? params.q : '') || ''

  // Fetch scholars with publication count
  const rawScholars = await prisma.scholars.findMany({
    where: {
      deleted_at: null
    },
    include: {
      users: {
        select: {
          email: true,
          raw_user_meta_data: true
        }
      },
      _count: {
        select: { publications: { where: { status: 'published', deleted_at: null } } }
      }
    },
    orderBy: { is_featured: 'desc' }
  })

  const formattedScholars = rawScholars.map(s => ({
    id: s.id,
    username: s.username,
    qualification: s.qualification,
    institution: s.institution,
    specialization: s.specialization,
    bio: s.bio,
    profile_photo_url: s.profile_photo_url,
    is_featured: s.is_featured,
    users: s.users,
    pubCount: s._count?.publications || 0
  }))

  const featuredScholars = rawScholars
    .filter(s => s.is_featured || s._count.publications > 0)
    .slice(0, 10)

  return (
    <>
      <main className="min-h-screen bg-surface pt-28 pb-16">
        <ScholarsClient
          initialScholars={formattedScholars}
          query={query}
          featuredScholars={featuredScholars}
        />
      </main>
      <Footer />
    </>
  )
}
