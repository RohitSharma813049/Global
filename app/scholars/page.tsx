import { prisma } from "@/lib/db"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import Image from "next/image"

export default async function ScholarsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = (typeof params.q === 'string' ? params.q : '') || ''

  // Fetch scholars
  const scholars = await prisma.scholars.findMany({
    where: {
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
      users: true
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

  return (
    <>
      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold text-[#0A0A0A] mb-4">
              Our Distinguished Scholars
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover the brilliant minds behind our global research community.
            </p>
            
            {/* Search Bar */}
            <form className="max-w-md mx-auto relative">
              <input 
                type="text" 
                name="q"
                defaultValue={query}
                placeholder="Search by username or name..." 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[#ECEAF4] shadow-sm focus:outline-none focus:ring-2 focus:ring-violet"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredScholars.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No scholars found matching your search.
              </div>
            ) : (
              filteredScholars.map((scholar, index) => {
                const meta = scholar.users?.raw_user_meta_data as any
                const name = meta?.name || scholar.users?.email?.split('@')[0] || 'Unknown'
                const avatar = meta?.avatar_url || ''
                const initials = name.substring(0, 2).toUpperCase()

                return (
                  <Link href={`/scholars/${scholar.username || scholar.id}`} key={scholar.id} className="bg-white rounded-2xl p-6 border border-[#ECEAF4] shadow-sm hover:shadow-md hover:border-violet transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-xl relative">
                        {avatar ? (
                          <Image 
                            src={avatar} 
                            alt={name} 
                            fill 
                            className="object-cover" 
                            sizes="64px"
                            priority={index < 6}
                          />
                        ) : initials}
                      </div>
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-xl font-bold group-hover:text-violet transition-colors">
                          {name}
                        </h3>
                        {scholar.username && (
                          <p className="text-sm font-semibold text-violet">@{scholar.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 font-medium">
                      {scholar.qualification || scholar.institution || 'Scholar'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {scholar.bio || scholar.specialization || 'General Research'}
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
