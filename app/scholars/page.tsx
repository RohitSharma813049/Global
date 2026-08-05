import { prisma } from "@/lib/db"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import Image from "next/image"
import ScholarSearchForm from "./ScholarSearchForm"
import GspFeaturedScholars from "@/components/scholars/gsp-featured-scholars"

export default async function ScholarsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = (typeof params.q === 'string' ? params.q : '') || ''

  // Fetch scholars with publication counts
  const scholars = await prisma.scholars.findMany({
    where: {
      publications: {
        some: {
          status: 'published',
          deleted_at: null
        }
      },
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { 
          users: { 
            email: { contains: query, mode: 'insensitive' }
          }
        }
      ]
    },
    include: {
      users: true,
      _count: {
        select: { publications: { where: { status: 'published', deleted_at: null } } }
      }
    },
    orderBy: { users: { created_at: 'desc' } }
  })

  // Manual fallback filter for names inside JSON metadata
  const filteredScholars = scholars.filter(scholar => {
    if (!query) return true;
    const meta = scholar.users?.raw_user_meta_data as any
    const name = meta?.name || ''
    return (
      (scholar.username && scholar.username.toLowerCase().includes(query.toLowerCase())) ||
      (scholar.users?.email && scholar.users.email.toLowerCase().includes(query.toLowerCase())) ||
      (name && name.toLowerCase().includes(query.toLowerCase()))
    )
  })

  // Prepare data for featured section (using top scholars or first 10)
  const featuredScholars = scholars.slice(0, 10)

  return (
    <>
      <main className="min-h-screen bg-surface pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] font-bold text-ink mb-4">
              Our Distinguished Scholars
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover the brilliant minds behind our global research community.
            </p>
            
            {/* Client Search Bar */}
            <ScholarSearchForm initialQuery={query} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredScholars.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No scholars found matching your search.
              </div>
            ) : (
              filteredScholars.map((scholar, index) => {
                const meta = scholar.users?.raw_user_meta_data as any
                const name = meta?.name || meta?.full_name || scholar.users?.email?.split('@')[0] || 'Unknown'
                const avatar = meta?.avatar_url || meta?.picture || meta?.image || ''
                const initials = name.substring(0, 2).toUpperCase()
                const pubCount = scholar._count?.publications || 0

                return (
                  <Link href={`/scholars/${scholar.username || scholar.id}`} key={scholar.id} className="bg-white rounded-2xl p-6 border border-rule shadow-sm hover:shadow-md hover:border-violet transition-all group flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center text-primary font-bold text-xl relative">
                        {avatar ? (
                          <Image 
                            src={avatar} 
                            alt={name} 
                            fill 
                            className="object-cover" 
                            sizes="64px"
                          />
                        ) : initials}
                      </div>
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-xl font-bold group-hover:text-violet transition-colors line-clamp-1">
                          {name}
                        </h3>
                        {scholar.username && (
                          <p className="text-sm font-semibold text-violet">@{scholar.username}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{pubCount} Publication{pubCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 font-medium line-clamp-1">
                      {scholar.qualification || scholar.institution || 'Scholar'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 mb-4 grow">
                      {scholar.bio || scholar.specialization || 'General Research'}
                    </div>
                    <div className="mt-auto text-xs font-semibold text-violet uppercase tracking-wider group-hover:underline">
                      View Profile &rarr;
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
        
        {/* Featured Scholars Section */}
        {featuredScholars.length > 0 && (
          <div className="border-t border-rule pt-16 bg-white">
            <GspFeaturedScholars 
              title="Featured Scholars" 
              subtitle="Meet our top contributors" 
              scholars={featuredScholars} 
              autoplay={true} 
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
