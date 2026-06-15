'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  slug: string
  cover_image: string | null
  created_at: Date
  type: 'blog' | 'news'
}

export default function RecentNewsBlogs({ items }: { items: ContentItem[] }) {
  if (!items || items.length === 0) return null

  return (
    <section className="px-6 py-16 sm:py-24 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
              Latest Updates
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
              Blogs & News
            </h2>
          </div>
          <Link href="/blog" className="text-indigo-600 font-semibold hover:underline hidden sm:block">
            View All Updates &rarr;
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 hide-scrollbar">
          {items.map((item) => (
            <Link 
              href={`/${item.type}/${item.slug}`} 
              key={`${item.type}-${item.id}`}
              className="group relative flex-none w-[85vw] sm:w-80 snap-center rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {item.cover_image ? (
                  <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-500 font-bold text-4xl">{item.title.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase text-gray-700 shadow-sm">
                  {item.type}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 sm:hidden text-center">
          <Link href="/blog" className="text-indigo-600 font-semibold hover:underline">
            View All Updates &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
