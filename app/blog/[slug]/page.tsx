
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft } from 'lucide-react'

import { prisma } from '@/lib/db'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blogs.findUnique({
    where: { slug }
  })

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link href="/updates" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Updates
          </Link>
          <div className="flex items-center text-sm text-gray-500 mb-4 font-medium uppercase tracking-wide">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full mr-4">Blog</span>
            <Calendar className="w-4 h-4 mr-2" />
            {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Recently'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {blog.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {blog.cover_image && (
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-10">
            <Image 
              src={blog.cover_image} 
              alt={blog.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}
        <div 
          className="prose prose-lg prose-indigo max-w-none bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  )
}
