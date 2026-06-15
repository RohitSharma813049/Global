import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'

const prisma = new PrismaClient()

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/updates" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Updates
          </Link>
          <div className="flex items-center text-sm text-gray-500 mb-4 font-medium uppercase tracking-wide">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full mr-4">News</span>
            <Calendar className="w-4 h-4 mr-2" />
            {news.published_at ? new Date(news.published_at).toLocaleDateString() : news.created_at ? new Date(news.created_at).toLocaleDateString() : 'Recently'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {news.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {news.cover_image && (
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-10">
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
      </div>
    </div>
  )
}
