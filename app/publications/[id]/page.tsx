import { notFound } from "next/navigation"
import { supabase } from "@/lib/superbaseconfig"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, BookMarked, ArrowLeft, User, Eye, FileText } from "lucide-react"
import Link from "next/link"
import { trackPublicationView } from "@/app/actions/history"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
      <main className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-6 pt-8">
          
          <Link href="/category" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discover
          </Link>

          {/* ── HEADER SECTION ── */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 uppercase tracking-widest text-xs px-3 py-1">
                {publication.content_type}
              </Badge>
              {publication.doi && (
                <Badge variant="outline" className="border-gray-300 text-gray-600 uppercase tracking-widest text-xs px-3 py-1 bg-gray-50">
                  DOI: {publication.doi}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
              {publication.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Authored by</p>
                  {publication.scholars ? (
                    <Link href={`/scholars/${publication.scholars.id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                      {(publication.scholars.users?.raw_user_meta_data as any)?.name || (publication.scholars.users?.raw_user_meta_data as any)?.full_name || "Unknown Scholar"}
                    </Link>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">Unknown Scholar</span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Published</span>
                  <span>{publishDate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Views</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {publication.views || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Downloads</span>
                  <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> {publication.downloads || 0}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              {session ? (
                <>
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-12 px-8">
                    <Download className="w-5 h-5 mr-2" /> Download {publication.content_type === 'video' ? 'Video' : 'PDF'}
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-xl border-gray-300 h-12 px-6">
                    <BookMarked className="w-5 h-5 mr-2" /> Save to Library
                  </Button>
                </>
              ) : (
                <>
                  <Link href={`/signin?callbackUrl=/publications/${publication.id}`}>
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-12 px-8">
                      <Download className="w-5 h-5 mr-2" /> Login to Download
                    </Button>
                  </Link>
                  <Link href={`/signin?callbackUrl=/publications/${publication.id}`}>
                    <Button size="lg" variant="outline" className="rounded-xl border-gray-300 h-12 px-6">
                      <BookMarked className="w-5 h-5 mr-2" /> Login to Save
                    </Button>
                  </Link>
                </>
              )}
              <Button size="lg" variant="outline" className="rounded-xl border-gray-300 h-12 px-6">
                <Share2 className="w-5 h-5 mr-2" /> Share
              </Button>
            </div>
          </div>

          {/* ── ABSTRACT & VIEWER SECTION ── */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-8">
              {/* PDF / Video Viewer */}
              <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-lg border border-gray-800 aspect-[4/3] flex items-center justify-center relative">
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
                    className="w-full h-full absolute inset-0 bg-white"
                    title={publication.title}
                  ></iframe>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600" /> Abstract
                </h3>
                <div className="prose prose-sm text-gray-600 leading-relaxed">
                  <p>{publication.abstract}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RELATED CONTENT ── */}
          {relatedPubs && relatedPubs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Publications</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPubs.map(pub => (
                  <Link href={`/publications/${pub.id}`} key={pub.id}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group">
                      <div>
                        <Badge variant="outline" className="mb-4 bg-gray-50 border-gray-200 text-gray-600 uppercase text-[10px] tracking-wider">
                          {pub.content_type}
                        </Badge>
                        <h3 className="font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-3 mb-2">
                          {pub.title}
                        </h3>
                        {pub.scholars && (
                          <p className="text-sm text-gray-500 font-medium">By {(pub.scholars.users?.raw_user_meta_data as any)?.name || (pub.scholars.users?.raw_user_meta_data as any)?.full_name || "Unknown Scholar"}</p>
                        )}
                      </div>
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
