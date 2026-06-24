import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'
import Footer from '@/components/footer'
import SidebarSlider from '@/components/sidebar-slider'

import { prisma } from '@/lib/db'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await prisma.blogs.findUnique({
    where: { slug }
  })

  if (!blog) {
    notFound()
  }

  // Fetch related blogs (excluding the current one)
  const relatedBlogs = await prisma.blogs.findMany({
    where: { 
      status: 'published',
      id: { not: blog.id }
    },
    orderBy: { created_at: 'desc' },
    take: 3
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Hero Section of the Article */}
      <div className="bg-white pt-16 pb-12 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[rgba(47,17,93,0.03)] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-sm text-[#2F115D] hover:underline font-semibold mb-10 transition-colors group tracking-wide">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-6 font-bold uppercase tracking-[0.15em]">
            <span className="bg-white text-[#2F115D] px-3.5 py-1.5 rounded-full border border-[#E2DFF0] shadow-sm">Article</span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 opacity-70" />
              {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#000] tracking-tight leading-[1.1] max-w-4xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-6xl mx-auto px-6 w-full pb-16 flex flex-col lg:flex-row gap-10">
        <main className="flex-1 min-w-0">
          {blog.cover_image && (
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden shadow-lg mb-12">
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
            className="prose prose-lg prose-indigo md:prose-xl max-w-none text-gray-800 prose-img:rounded-xl prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </main>
        
        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] shrink-0">
          <SidebarSlider />
        </aside>
      </div>
      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-20 mt-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Read Next</h2>
              <Link href="/blog" className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-800 font-medium group">
                View all articles <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {post.cover_image ? (
                      <Image 
                        src={post.cover_image} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-gray-500 mb-3 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <div 
                      className="text-gray-600 line-clamp-2 text-sm leading-relaxed flex-1"
                      dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>?/gm, '') }}
                    />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10 sm:hidden">
              <Link href="/blog" className="flex items-center justify-center w-full py-3 px-4 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors">
                View all articles
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
