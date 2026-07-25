
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'
import SidebarSlider from '@/components/sidebar-slider'

import { prisma } from '@/lib/db'

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug }
  })

  if (!news) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white pt-16 pb-12 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-64 bg-linear-to-b from-[rgba(47,17,93,0.03)] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link href="/updates" className="inline-flex items-center text-sm text-violet hover:underline font-semibold mb-10 transition-colors group tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Updates
          </Link>
          <div className="flex items-center gap-3 text-2.75 text-gray-500 mb-6 font-bold uppercase tracking-[0.15em]">
            <span className="bg-white text-violet px-3.5 py-1.5 rounded-full border border-[#E2DFF0] shadow-sm">News</span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              {news.published_at ? new Date(news.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : news.created_at ? new Date(news.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#000] tracking-tight leading-[1.1] max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {news.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-col lg:flex-row gap-10">
        <main className="flex-1 min-w-0">
          {news.cover_image && (
          <div className="relative w-full h-100 sm:h-125 rounded-2xl overflow-hidden shadow-lg mb-10">
            <Image 
              src={news.cover_image} 
              alt={news.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}
          <div 
            className="prose prose-lg prose-emerald max-w-none bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </main>
        
        {/* Sidebar */}
        <aside className="w-full lg:w-85 shrink-0">
          <SidebarSlider />
        </aside>
      </div>
    </div>
  )
}
