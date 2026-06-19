import { notFound } from "next/navigation"
import { supabase } from "@/lib/superbaseconfig"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, BookMarked, ArrowLeft, User, Eye, FileText, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { trackPublicationView } from "@/app/actions/history"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SaveButton from "@/components/save-button"

interface Props {
  params: {
    id: string
  }
}

export default async function PublicationDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  // Fetch publication
  const publication = await prisma.publications.findUnique({
    where: { id },
    include: {
      scholars: {
        include: { users: true }
      }
    }
  });

  if (!publication) {
    return notFound()
  }

  // Track the view for history
  await trackPublicationView(id)

  // Fetch related publications (same category, excluding current)
  const relatedPubs = await prisma.publications.findMany({
    where: {
      content_type: publication.content_type,
      id: { not: id },
      status: 'published'
    },
    include: {
      scholars: {
        include: { users: true }
      }
    },
    take: 4
  });

  const isVideo = publication.content_type === 'video'
  
  // Format dates securely
  const publishDate = publication.created_at ? new Date(publication.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown Date';

  return (
    <>
      <main className="min-h-screen bg-white">
        
        {/* ── MASSIVE FULL-WIDTH BANNER ── */}
        {publication.banner_image || publication.cover_image ? (
          <div className="w-full h-[50vh] md:h-[65vh] relative bg-zinc-100">
            <Image 
              src={publication.banner_image || publication.cover_image || ''} 
              alt="Publication Banner" 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-24 left-6 md:left-12">
              <Link href="/category" className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors drop-shadow-md">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
            <Link href="/category" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
            </Link>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
          
          {/* ── EDITORIAL HEADER ── */}
          <div className={`pt-12 md:pt-16 pb-12 ${!(publication.banner_image || publication.cover_image) && 'border-t border-zinc-200 mt-8'}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    {publication.content_type}
                  </span>
                  {publication.doi && (
                    <>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs font-medium tracking-wider text-zinc-500">
                        DOI: {publication.doi}
                      </span>
                    </>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-zinc-900 tracking-tight leading-[1.1] mb-8">
                  {publication.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Authored By</p>
                    {publication.scholars ? (
                      <Link href={`/scholars/${publication.scholars.id}`} className="text-lg font-medium text-zinc-900 hover:text-blue-600 transition-colors">
                        {(publication.scholars.users?.raw_user_meta_data as any)?.name || (publication.scholars.users?.raw_user_meta_data as any)?.full_name || "Unknown Scholar"}
                      </Link>
                    ) : (
                      <span className="text-lg font-medium text-zinc-900">Unknown Scholar</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-6 text-sm text-zinc-500 md:text-right border-t md:border-t-0 border-zinc-100 pt-6 md:pt-0">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Published</span>
                  <span className="text-zinc-900 font-medium">{publishDate}</span>
                </div>
                <div className="flex gap-6 md:justify-end">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Views</span>
                    <span className="text-zinc-900 font-medium">{publication.views || 0}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Downloads</span>
                    <span className="text-zinc-900 font-medium">{publication.downloads || 0}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Gallery */}
              {publication.gallery_images && publication.gallery_images.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-8 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-900"></span> Visual Appendix
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publication.gallery_images.map((imgUrl, index) => (
                      <div key={index} className={`relative bg-zinc-100 overflow-hidden ${index % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/5]'}`}>
                        <Image 
                          src={imgUrl} 
                          alt={`Gallery Image ${index + 1}`} 
                          fill 
                          className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="w-full h-px bg-zinc-200 mb-16" />

          {/* ── TWO COLUMN EDITORIAL LAYOUT ── */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 relative">
            
            {/* LEFT COLUMN: Abstract & Actions (Sticky) */}
            <div className="lg:col-span-4 relative">
              <div className="sticky top-32 space-y-12">
                
                {/* Actions */}
                <div className="flex flex-col gap-3">
                  {session ? (
                    <>
                      {publication.file_url ? (
                        <Link href={publication.file_url} target="_blank" download className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none h-14 text-sm font-bold tracking-wider uppercase transition-colors">
                            <Download className="w-4 h-4 mr-2" /> Download {publication.content_type === 'video' ? 'Video' : 'PDF'}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="w-full bg-gray-400 text-white rounded-none h-14 text-sm font-bold tracking-wider uppercase transition-colors">
                          <Download className="w-4 h-4 mr-2" /> Not Available
                        </Button>
                      )}
                      <SaveButton 
                        publication={{
                          id: publication.id,
                          title: publication.title,
                          type: publication.content_type,
                          author: (publication.scholars?.users?.raw_user_meta_data as any)?.name || 'Unknown Scholar',
                          url: `/publications/${publication.id}`
                        }} 
                        variant="full" 
                      />
                    </>
                  ) : (
                    <>
                      <Link href={`/signin?callbackUrl=/publications/${publication.id}`} className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none h-14 text-sm font-bold tracking-wider uppercase transition-colors">
                          <Download className="w-4 h-4 mr-2" /> Login to Download
                        </Button>
                      </Link>
                      <Link href={`/signin?callbackUrl=/publications/${publication.id}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-none border-zinc-200 text-zinc-900 hover:bg-zinc-50 h-14 text-sm font-bold tracking-wider uppercase transition-colors">
                          <BookMarked className="w-4 h-4 mr-2" /> Login to Save
                        </Button>
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" className="w-full rounded-none text-zinc-500 hover:text-zinc-900 h-14 text-sm font-bold tracking-wider uppercase transition-colors">
                    <Share2 className="w-4 h-4 mr-2" /> Share
                  </Button>
                </div>

                {/* Abstract */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-900"></span> Abstract
                  </h3>
                  <div 
                    className="prose prose-zinc text-sm leading-relaxed text-justify text-zinc-600 max-w-none break-words" 
                    dangerouslySetInnerHTML={{ __html: publication.abstract?.replace(/&nbsp;/g, ' ') }} 
                  />
                </div>
                
              </div>
            </div>

            {/* RIGHT COLUMN: Media Viewer & Gallery */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Main Viewer */}
              <div className="bg-zinc-100 aspect-[4/3] w-full relative overflow-hidden group">
                {isVideo ? (
                  <iframe 
                    src={publication.file_url} 
                    className="w-full h-full absolute inset-0"
                    allowFullScreen
                    title={publication.title}
                  ></iframe>
                ) : (
                  <iframe 
                    src={`${publication.file_url}#toolbar=0`} 
                    className="w-full h-full absolute inset-0 mix-blend-multiply"
                    title={publication.title}
                  ></iframe>
                )}
              </div>

            </div>
          </div>

          {/* ── RELATED CONTENT ── */}
          {relatedPubs && relatedPubs.length > 0 && (
            <div className="mt-32 pt-16 border-t border-zinc-200">
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-12">More in this Category</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {relatedPubs.map(pub => (
                  <Link href={`/publications/${pub.id}`} key={pub.id} className="group">
                    <div className="flex flex-col h-full">
                      <div className="w-full aspect-[4/3] bg-zinc-100 mb-6 overflow-hidden relative">
                         {pub.cover_image ? (
                           <Image src={pub.cover_image} alt={pub.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                         ) : (
                           <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                             <FileText className="w-12 h-12" />
                           </div>
                         )}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-3 block">
                        {pub.content_type}
                      </span>
                      <h3 className="font-bold text-lg text-zinc-900 leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-3">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-auto">
                        {(pub.scholars?.users?.raw_user_meta_data as any)?.name || "Unknown Scholar"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
