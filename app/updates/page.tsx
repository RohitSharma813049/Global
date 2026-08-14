import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { formatDistanceToNow } from 'date-fns'

import { prisma } from '@/lib/db'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export const revalidate = 0 // always fetch fresh data

export default async function UpdatesPage() {
  const blogsData = await prisma.blogs.findMany({
    where: { status: 'published' },
    orderBy: { created_at: 'desc' }
  })
  
  const newsData = await prisma.news.findMany({
    where: { status: 'published' },
    orderBy: { published_at: 'desc' }
  })
  
  const magazinesData = await prisma.publications.findMany({
    where: { status: 'published', content_type: { equals: 'Magazine', mode: 'insensitive' } },
    orderBy: { created_at: 'desc' }
  })

  // Combine and sort
  const allItems = [
    ...(blogsData || []).map(b => ({ ...b, type: 'blog' as const, dateToSort: b.created_at, link: `/blog/${b.slug}` })),
    ...(newsData || []).map(n => ({ ...n, type: 'news' as const, dateToSort: n.published_at || n.created_at, link: `/news/${n.slug}` })),
    ...(magazinesData || []).map(m => ({ 
      id: m.id, 
      title: m.title, 
      content: m.abstract, 
      cover_image: m.cover_image, 
      is_featured: m.is_featured, 
      type: 'magazine' as const, 
      dateToSort: m.created_at, 
      link: m.file_url || `/explore?type=Magazine`
    }))
  ].sort((a, b) => {
    const timeB = b.dateToSort ? new Date(b.dateToSort).getTime() : 0;
    const timeA = a.dateToSort ? new Date(a.dateToSort).getTime() : 0;
    return timeB - timeA;
  });

  const featuredItems = allItems.filter(item => item.is_featured);
  const restItems = allItems.filter(item => !item.is_featured);

  return (
    <>
      <div className="bc-bar">
        <div className="bc-inner">
          <Link href="/">Home</Link><span className="bc-sep">›</span>
          <span style={{ color: 'var(--mid)' }}>News & Insights</span>
        </div>
      </div>
      <div className="min-h-screen bg-surface pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 border-b border-rule pb-10">
            <p className="inline-flex items-center text-[10.5px] font-semibold tracking-[0.2em] uppercase text-violet mb-4">
              Global Scholar Magazine
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-ink tracking-tight leading-tight">
              Insights & <em>Perspectives</em>
            </h1>
            <p className="mt-4 text-[14.5px] font-light text-black/60 max-w-2xl mx-auto leading-relaxed">
              Stay informed with the latest news, announcements, and featured scholarly blogs from the Global Scholar community.
            </p>
          </div>

          {allItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-rule">
              <h3 className="text-xl font-medium text-gray-900">No updates found</h3>
              <p className="mt-2 text-gray-500">Check back later for new blogs and news.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {/* Featured Section */}
              {featuredItems.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-ink mb-6">Featured Stories</h2>
                  <div className={`grid gap-8 ${featuredItems.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-2'}`}>
                    {featuredItems.map((featured) => {
                      const cleanCover = featured.cover_image && !featured.cover_image.toLowerCase().includes('sahab') && !featured.cover_image.toLowerCase().includes('luffy') && !featured.cover_image.toLowerCase().includes('placeholder')
                        ? featured.cover_image
                        : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop&auto=format&q=80';
                      const cleanLink = featured.link && !featured.link.toLowerCase().includes('.url') ? featured.link : '/blog';

                      return (
                        <Link 
                          key={`${featured.type}-${featured.id}`}
                          href={cleanLink}
                          className={`group ${featuredItems.length === 1 ? 'flex flex-col md:grid md:grid-cols-12' : 'flex flex-col'} bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(47,17,93,0.16)] border border-rule hover:border-violet/20 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                        >
                          <div className={`relative w-full bg-gray-100 overflow-hidden shrink-0 ${featuredItems.length === 1 ? 'md:col-span-6 h-56 sm:h-64 md:h-full' : 'h-52 sm:h-60'}`}>
                            <Image 
                              src={cleanCover} 
                              alt={featured.title} 
                              fill 
                              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                              unoptimized
                            />
                            <div className="absolute top-4 left-4 z-10">
                              <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm ${featured.type === 'blog' ? 'bg-violet text-white' : featured.type === 'magazine' ? 'bg-emerald-600 text-white' : 'bg-gold text-white'}`}>
                                {featured.type === 'blog' ? 'Featured Blog' : featured.type === 'magazine' ? 'Featured Magazine' : 'Featured News'}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`p-6 sm:p-8 ${featuredItems.length === 1 ? 'md:col-span-6 md:p-10 justify-center' : 'grow'} flex flex-col bg-white`}>
                            <div className="flex items-center text-xs font-semibold text-violet mb-3 tracking-wider uppercase">
                              <time dateTime={featured.dateToSort ? new Date(featured.dateToSort).toISOString() : ''}>
                                {featured.dateToSort ? formatDistanceToNow(new Date(featured.dateToSort), { addSuffix: true }) : 'Recently'}
                              </time>
                            </div>
                            <h3 className={`${featuredItems.length === 1 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} font-serif font-bold text-ink mb-3 group-hover:text-violet transition-colors leading-tight`}>
                              {featured.title}
                            </h3>
                            <div 
                              className="text-black/60 text-[14px] font-light leading-relaxed mb-6 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: (featured.content || "").substring(0, 300) + '...' }}
                            />
                            <div className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-violet border-b-[1.5px] border-transparent hover:border-violet pb-1 w-max transition-all group-hover:gap-3">
                              Read Full Story
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Latest Stories Grid */}
              {restItems.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-ink mb-6">Latest Stories</h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {restItems.map((item) => {
                      const cleanItemCover = item.cover_image && !item.cover_image.toLowerCase().includes('sahab') && !item.cover_image.toLowerCase().includes('luffy') && !item.cover_image.toLowerCase().includes('placeholder')
                        ? item.cover_image
                        : 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop&auto=format&q=80';
                      const cleanItemLink = item.link && !item.link.toLowerCase().includes('.url') ? item.link : '/blog';

                      return (
                        <Link 
                          href={cleanItemLink} 
                          key={`${item.type}-${item.id}`}
                          className="group flex flex-col bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(47,17,93,0.16)] border border-rule hover:border-violet/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full"
                        >
                          <div className="relative h-48 sm:h-52 w-full bg-gray-100 overflow-hidden shrink-0">
                            <Image 
                              src={cleanItemCover} 
                              alt={item.title} 
                              fill 
                              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                            <div className="absolute top-4 left-4 z-10">
                              <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-md shadow-sm ${item.type === 'blog' ? 'bg-violet/90 text-white' : item.type === 'magazine' ? 'bg-emerald-600/90 text-white' : 'bg-gold/90 text-white'} backdrop-blur-sm`}>
                                {item.type === 'blog' ? 'Blog' : item.type === 'magazine' ? 'Magazine' : 'News'}
                              </span>
                            </div>
                          </div>
                        
                        <div className="p-6 flex flex-col grow">
                          <div className="flex items-center text-[10px] font-semibold text-violet mb-3 tracking-wider uppercase">
                            <time dateTime={item.dateToSort ? new Date(item.dateToSort).toISOString() : ''}>
                              {item.dateToSort ? formatDistanceToNow(new Date(item.dateToSort), { addSuffix: true }) : 'Recently'}
                            </time>
                          </div>
                          <h3 className="text-[19px] font-serif font-bold text-ink mb-3 group-hover:text-violet transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <div 
                            className="text-black/50 text-[12.5px] font-light leading-relaxed mb-6 line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: (item.content || "").substring(0, 150) + '...' }}
                          />
                          <div className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-violet transition-all group-hover:gap-2.5">
                            Read more 
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
