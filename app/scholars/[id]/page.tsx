import GSPDistinguishedScholars from "@/components/GSPDistinguishedScholars"
import { notFound } from "next/navigation"
import Footer from "@/components/footer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/db"

interface Props {
  params: {
    id: string
  }
}

export default async function ScholarProfilePage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  // Fetch scholar using Prisma
  const scholar = await prisma.scholars.findFirst({
    where: {
      OR: [
        { id: id },
        { user_id: id }
      ]
    },
    include: {
      users: true
    }
  });

  if (!scholar) {
    return notFound()
  }

  // Fetch publications using Prisma
  const rawPublications = await prisma.publications.findMany({
    where: {
      scholar_id: scholar.id
    }
  });

  const publications = rawPublications.map((p: any) => ({
    id: p.id,
    scholar_id: p.scholar_id,
    title: p.title,
    metadata: p.abstract || '',
    tag: p.content_type || 'article',
    url: p.file_url || `/publications/${p.id}`,
  }))

  const isOwner = session?.user?.id === scholar.user_id || session?.user?.role === 'admin';

  const rawMetaData = scholar.users?.raw_user_meta_data as any || {};

  const formattedScholar = {
    ...scholar,
    id: scholar.id,
    name: rawMetaData.name || scholar.users?.email?.split('@')[0] || 'Unknown',
    initials: (rawMetaData.name || scholar.users?.email?.split('@')[0] || 'U').substring(0, 2).toUpperCase(),
    professional_role: scholar.qualification || scholar.institution || 'Scholar',
    country: rawMetaData.country || 'Global',
    country_code: 'UN',
    flag_emoji: '🌐',
    domain: scholar.specialization || 'General Research',
    description: scholar.bio || 'No biography available for this scholar.',
    is_honorary: false,
    is_verified: scholar.verified ?? false,
    is_featured: scholar.is_featured ?? false,
    total_views: scholar.total_views ?? 0,
    total_downloads: scholar.total_downloads ?? 0,
    avatar_url: rawMetaData.avatar_url || '',
  }

  const videoUrl = rawMetaData.video_url;
  const videos = videoUrl ? [{ 
    id: '1', 
    scholar_id: scholar.id, 
    title: 'Featured Video', 
    metadata: '', 
    video_url: videoUrl, 
    is_main_video: true 
  }] : [];

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <GSPDistinguishedScholars 
          scholar={formattedScholar}
          videos={videos}
          publications={publications || []}
          isOwner={isOwner}
        />
      </main>
      <Footer />
    </>
  )
}
