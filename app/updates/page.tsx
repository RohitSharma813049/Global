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

  // Combine and sort
  const allItems = [
    ...(blogsData || []).map(b => ({ ...b, type: 'blog' as const, dateToSort: b.created_at })),
    ...(newsData || []).map(n => ({ ...n, type: 'news' as const, dateToSort: n.published_at || n.created_at }))
  ].sort((a, b) => {
    const timeB = b.dateToSort ? new Date(b.dateToSort).getTime() : 0;
    const timeA = a.dateToSort ? new Date(a.dateToSort).getTime() : 0;
    return timeB - timeA;
  });

  const featuredItems = allItems.filter(item => item.is_featured);
  const restItems = allItems.filter(item => !item.is_featured);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-surface pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 border-b border-rule pb-10">
            <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.2em] uppercase text-violet mb-4">
              <span className="w-8 h-[1.5px] bg-violet"></span>
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
                    {featuredItems.map((featured) => (
                      <Link 
                        key={`${featured.type}-${featured.id}`}
                        href={`/${featured.type === 'blog' ? 'blog' : 'news'}/${featured.slug}`}
                        className={`group ${featuredItems.length === 1 ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col'} bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(47,17,93,0.16)] border border-rule hover:border-violet/20 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                      >
                        <div className={`relative w-full bg-gray-100 overflow-hidden shrink-0 ${featuredItems.length === 1 ? 'h-64 md:h-full' : 'h-56'}`}>
                          {featured.cover_image ? (
                            <Image 
                              src={featured.cover_image} 
                              alt={featured.title} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                              <span className="text-indigo-300 font-bold text-6xl">{featured.title.charAt(0)}</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm ${featured.type === 'blog' ? 'bg-violet text-white' : 'bg-gold text-white'}`}>
                              {featured.type === 'blog' ? 'Featured Blog' : 'Featured News'}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`p-8 ${featuredItems.length === 1 ? 'md:p-12 justify-center' : 'grow'} flex flex-col`}>
                          <div className="flex items-center text-xs font-semibold text-violet mb-4 tracking-wider uppercase">
                            <time dateTime={featured.dateToSort ? new Date(featured.dateToSort).toISOString() : ''}>
                              {featured.dateToSort ? formatDistanceToNow(new Date(featured.dateToSort), { addSuffix: true }) : 'Recently'}
                            </time>
                          </div>
                          <h3 className={`${featuredItems.length === 1 ? 'text-3xl' : 'text-2xl'} font-serif font-bold text-ink mb-4 group-hover:text-violet transition-colors leading-tight`}>
                            {featured.title}
                          </h3>
                          <div 
                            className="text-black/60 text-[14.5px] font-light leading-relaxed mb-8 line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: featured.content.substring(0, 300) + '...' }}
                          />
                          <div className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-violet border-b-[1.5px] border-transparent hover:border-violet pb-1 w-max transition-all group-hover:gap-3">
                            Read Full Story
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Latest Stories Grid */}
              {restItems.length > 0 && (
                <section>
                  <h2 className="text-2xl font-serif font-bold text-ink mb-6">Latest Stories</h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {restItems.map((item) => (
                      <Link 
                        href={`/${item.type === 'blog' ? 'blog' : 'news'}/${item.slug}`} 
                        key={`${item.type}-${item.id}`}
                        className="group flex flex-col bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_48px_rgba(47,17,93,0.16)] border border-rule hover:border-violet/20 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
                          {item.cover_image ? (
                            <Image 
                              src={item.cover_image} 
                              alt={item.title} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                              <span className="text-indigo-300 font-bold text-4xl">{item.title.charAt(0)}</span>
                            </div>
                          )}
                          <div className="absolute top-4 left-4 z-10">
                            <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-md shadow-sm ${item.type === 'blog' ? 'bg-violet/90 text-white' : 'bg-gold/90 text-white'} backdrop-blur-sm`}>
                              {item.type === 'blog' ? 'Blog' : 'News'}
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
                            dangerouslySetInnerHTML={{ __html: item.content.substring(0, 150) + '...' }}
                          />
                          <div className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-medium text-violet transition-all group-hover:gap-2.5">
                            Read more 
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
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
