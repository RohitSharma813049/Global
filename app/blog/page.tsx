import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Calendar, ArrowRight } from "lucide-react";
import Footer from "@/components/footer";

export default async function Blog() {
  const blogs = await prisma.blogs.findMany({
    where: { status: 'published' },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Hero Section */}
      <div className="bg-indigo-900 py-20 px-6 sm:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6">Our Blog</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Stay up to date with the latest research, academic insights, and platform updates from Global Scholar Publications.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
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
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 shadow-sm">
                    Article
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center text-xs text-gray-500 mb-4 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  <div 
                    className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>?/gm, '') }}
                  />
                  <div className="mt-auto flex items-center text-indigo-600 font-semibold text-sm group-hover:text-indigo-700">
                    Read Article <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-500">Check back later for new articles and updates.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
