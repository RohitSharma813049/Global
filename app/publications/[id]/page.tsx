import { notFound } from "next/navigation"
import { supabase } from "@/lib/superbaseconfig"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import Image from "next/image"
import { trackPublicationView } from "@/app/actions/history"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import SaveButton from "@/components/save-button"
import PublicationViewer from "./PublicationViewer"
import DownloadButton from "./DownloadButton"
import ShareButton from "./ShareButton"
import { User } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"


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

  // Ensure drafts/pending aren't visible to the public
  if (publication.status !== 'published') {
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin' && session.user.id !== publication.scholars?.user_id)) {
      return notFound();
    }
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
  const rawMetaData = (publication.scholars?.users?.raw_user_meta_data as any) || {};
  const authorName = rawMetaData.name || rawMetaData.full_name || publication.author_name || "Unknown Scholar";
  const authorImg = rawMetaData.avatar_url || rawMetaData.picture || rawMetaData.image || "/placeholder-user.png";
  
  const authorInitials = authorName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  
  // Format dates securely
  const publishDate = publication.created_at ? new Date(publication.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown Date';

  const doiValue = publication.doi || `10.9876/gsp.${new Date().getFullYear()}.${publication.id.substring(0,8)}`;

  return (
    <>
      <div className="gsp-publication-page">

        {/* ══ BREADCRUMB ══ */}
        <div className="bc-bar">
          <div className="bc-inner">
            <Link href="/">Home</Link><span className="bc-sep">›</span>
            <Link href="/explore">Explore</Link><span className="bc-sep">›</span>
            <span style={{ color: 'var(--mid)' }}>{publication.title}</span>
          </div>
        </div>

        {/* ══ PUBLICATION HEADER — WHITE BACKGROUND ══ */}
        <header className="pub-hd">
          <div className="pub-hd-inner">

            <div className="pub-badges">
              <span className="pbadge pbadge-type"><span className="pbadge-dot"></span>{publication.content_type || 'Publication'}</span>
              <span className="pbadge pbadge-oa"><span className="pbadge-dot"></span>Open Access</span>
            </div>

            <h1 className="pub-title">{publication.title}</h1>
            {/* Shortened abstract for subtitle if no subtitle field */}
            <p className="pub-subtitle">
              {publication.abstract ? (publication.abstract.replace(/<[^>]+>/g, '').substring(0, 150) + '...') : ''}
            </p>

            <div className="pub-rule"></div>

            <div className="pub-meta">
              <div className="pub-mi">
                <p className="pub-mi-label">Author</p>
                <Link href={publication.scholar_id ? `/scholars/${publication.scholar_id}` : "#"} className="pub-mi-link">
                  <span className="pub-mi-avatar">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={authorImg || "/placeholder-user.png"} alt={authorName} className="object-cover" />
                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 font-bold">{authorInitials}</AvatarFallback>
                    </Avatar>
                  </span>
                  {authorName}
                </Link>
              </div>
              <div className="pub-mi">
                <p className="pub-mi-label">Institution</p>
                <p className="pub-mi-val">{publication.institution || "Global Scholar Publications"}</p>
              </div>
              <div className="pub-mi">
                <p className="pub-mi-label">Published</p>
                <p className="pub-mi-val">{publishDate}</p>
              </div>
            </div>

            <div className="pub-doi-row">
              <span className="doi-label">DOI</span>
              <span className="doi-val" id="doi-val">{doiValue}</span>
              <button className="doi-copy">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><rect x="1" y="3" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><path d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                Copy DOI
              </button>
            </div>

          </div>
        </header>

        {/* ══ ACTION BAR ══ */}
        <div className="act-bar">
          <div className="act-inner">
            <p className="act-title">{publication.title}</p>

            {publication.file_url ? (
              <DownloadButton 
                publicationId={publication.id} 
                fileUrl={publication.file_url} 
                isVideo={isVideo} 
                isLoggedIn={!!session}
              />
            ) : (
              <button disabled className="abtn bg-gray-200 border-gray-300 text-gray-500">
                 <span>Not Available</span>
              </button>
            )}

            <ShareButton 
              title={publication.title} 
              text={publication.abstract?.replace(/<[^>]+>/g, '').substring(0, 150) || "Read this publication on Global Scholar Publications"}
              publicationId={publication.id}
            />
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="pub-body">

          {/* MAIN */}
          <main>

            {/* Banner Media */}
            {(publication.banner_image || publication.cover_image || publication.video_url) && (
              <div className="pub-sec mb-8">
                {publication.video_url ? (
                   <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe 
                        src={publication.video_url} 
                        className="w-full h-full border-0" 
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                   </div>
                ) : (
                   <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-zinc-100 rounded-lg overflow-hidden relative">
                      <Image 
                        src={publication.banner_image || publication.cover_image || ''} 
                        alt="Banner" 
                        fill 
                        className="object-cover"
                      />
                   </div>
                )}
              </div>
            )}

            {/* Abstract */}
            <div className="pub-sec">
              <h2 className="sec-label">Abstract</h2>
              <div className="pub-abstract">
                <div dangerouslySetInnerHTML={{ __html: publication.abstract?.replace(/&nbsp;/g, ' ') || '' }} />
              </div>
              <div className="kws">
                <span className="kw">{publication.content_type}</span>
                <span className="kw">Global Scholar</span>
              </div>
            </div>

            {/* Viewer */}
            <div className="pub-sec">
              <h2 className="sec-label">Read Publication</h2>
              <PublicationViewer publication={publication} isVideo={isVideo} />
            </div>

            {/* Related */}
            {relatedPubs && relatedPubs.length > 0 && (
              <div className="pub-sec">
                <h2 className="sec-label">Related Publications</h2>
                <div className="rel-grid">
                  {relatedPubs.map(pub => (
                    <Link href={`/publications/${pub.id}`} key={pub.id} className="rel-card">
                      <div className="rel-img">
                        {pub.cover_image ? (
                          <img src={pub.cover_image} alt="" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-zinc-100" />
                        )}
                        <span className="rel-type">{pub.content_type}</span>
                      </div>
                      <div className="rel-body">
                        <p className="rel-subj">{pub.content_type}</p>
                        <h4 className="rel-title">{pub.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="pub-sb">
            <div className="sb-card">
              <div className="sb-head">About the Author</div>
              <div className="sb-body">
                <div className="au-hero">
                  <div className="au-av overflow-hidden flex items-center justify-center bg-[#F8F7FC] border-0.5 border-white shadow-sm">
                    {authorImg && authorImg !== "/placeholder-user.png" ? (
                      <img src={authorImg} alt={authorName} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-violet">{authorInitials}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="au-name">{authorName}</h3>
                    <p className="au-inst">{publication.institution && publication.institution !== 'Not Specified' ? publication.institution : (publication.scholars?.institution || "Independent Researcher")}</p>
                    {publication.scholars?.qualification && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{publication.scholars.qualification}</p>
                    )}
                    {publication.scholars?.specialization && (
                      <p className="text-xs text-emerald-600 mt-0.5 line-clamp-1">{publication.scholars.specialization}</p>
                    )}
                  </div>
                </div>
                <Link href={publication.scholar_id ? `/scholars/${publication.scholar_id}` : "#"} className="flex items-center justify-center gap-2 w-full h-8.5 rounded-1.75 border-0.375 border-violet text-violet text-xs font-medium hover:bg-violet hover:text-white transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
      <Footer />
    </>
  )
}
