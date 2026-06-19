import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { formatDistanceToNow } from 'date-fns'

import { prisma } from '@/lib/db'

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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Latest <span className="text-indigo-600">Updates</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest news, announcements, and featured blogs from the Global Scholar community.
          </p>
        </div>

        {allItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900">No updates found</h3>
            <p className="mt-2 text-gray-500">Check back later for new blogs and news.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item) => (
              <Link 
                href={`/${item.type === 'blog' ? 'blog' : 'news'}/${item.slug}`} 
                key={`${item.type}-${item.id}`}
                className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
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
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${item.type === 'blog' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                      {item.type === 'blog' ? 'Blog' : 'News'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3 gap-2">
                    <time dateTime={item.dateToSort ? new Date(item.dateToSort).toISOString() : ''}>
                      {item.dateToSort ? formatDistanceToNow(new Date(item.dateToSort), { addSuffix: true }) : 'Recently'}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div 
                    className="text-gray-600 text-sm line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: item.content.substring(0, 150) + '...' }}
                  />
                  <div className="mt-auto flex items-center text-indigo-600 text-sm font-medium">
                    Read more 
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
