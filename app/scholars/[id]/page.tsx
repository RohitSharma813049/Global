import GSPDistinguishedScholars from "@/components/scholars/GSPDistinguishedScholars"
import Header from "@/components/layout/header"
import { notFound } from "next/navigation"
import Footer from "@/components/layout/footer"
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

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  // Fetch scholar using Prisma
  const scholar = await prisma.scholars.findFirst({
    where: isUuid ? {
      OR: [
        { id: id },
        { user_id: id }
      ]
    } : {
      username: id
    },
    include: {
      users: true
    }
  });

  if (!scholar) {
    return notFound()
  }

  const [rawPublications, rawBlogs, rawOtherScholars] = await Promise.all([
    prisma.publications.findMany({
      where: { scholar_id: scholar.id, status: 'published', deleted_at: null }
    }),
    scholar.user_id ? prisma.blogs.findMany({
      where: { author_id: scholar.user_id, status: 'published' }
    }) : Promise.resolve([]),
    prisma.scholars.findMany({
      where: { id: { not: scholar.id } },
      take: 4,
      orderBy: { total_views: 'desc' },
      include: { users: true }
    })
  ]);

  const publications = rawPublications.map((p: any) => ({
    id: p.id,
    scholar_id: p.scholar_id,
    title: p.title,
    metadata: p.abstract || '',
    tag: p.content_type ? (p.content_type.charAt(0).toUpperCase() + p.content_type.slice(1).toLowerCase()) : 'Article',
    url: p.file_url || `/publications/${p.id}`,
    date: p.created_at
  }));

  const blogs = rawBlogs.map((b: any) => ({
    id: b.id,
    scholar_id: scholar.id,
    title: b.title,
    metadata: 'Blog Post',
    tag: 'Blog',
    url: `/blog/${b.slug}`,
    date: b.created_at
  }));

  const allWorks = [...publications, ...blogs].sort((a, b) => {
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    return timeB - timeA;
  });

  const isOwner = session?.user?.id === scholar.user_id || session?.user?.role === 'admin';

  const rawMetaData = scholar.users?.raw_user_meta_data as any || {};

  const formattedScholar = {
    ...scholar,
    id: scholar.id,
    name: rawMetaData.name || scholar.users?.email?.split('@')[0] || 'Unknown',
    initials: (() => {
      const nameParts = (rawMetaData.name || scholar.users?.email?.split('@')[0] || 'U').split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    })(),
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
    avatar_url: scholar.profile_photo_url || rawMetaData.avatar_url || rawMetaData.picture || rawMetaData.image || '',
    linkedin_url: scholar.linkedin_url,
    twitter_url: scholar.twitter_url,
    website_url: scholar.website_url,
  }

  const videoUrl = scholar.video_url || rawMetaData.video_url;
  const videos = videoUrl ? [{ 
    id: '1', 
    scholar_id: scholar.id, 
    title: 'Featured Video', 
    metadata: 'Scholar introduction and insights', 
    video_url: videoUrl, 
    is_main_video: true 
  }] : [];

  const mockReviews = [
    {
      id: 'mock-1',
      reviewer_name: 'Dr. Alistair Vance',
      reviewer_role: 'Stanford University',
      content: 'An exceptional contributor to the field of macroeconomics. The frameworks presented in recent publications are highly rigorous and practically applicable.'
    },
    {
      id: 'mock-2',
      reviewer_name: 'Prof. Evelyn Reyes',
      reviewer_role: 'Oxford Research Inst.',
      content: 'The depth of knowledge and interdisciplinary approach is truly commendable. Always a pleasure collaborating on public policy papers.'
    }
  ];

  const formattedOtherScholars = rawOtherScholars.map((s: any) => {
    const rawMetaData = s.users?.raw_user_meta_data as any || {};
    const name = rawMetaData.name || s.users?.email?.split('@')[0] || 'Unknown';
    const initials = (() => {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    })();

    return {
      id: s.id,
      name: name,
      initials: initials,
      professional_role: s.qualification || s.institution || 'Scholar',
      country: rawMetaData.country || 'Global',
      country_code: 'UN',
      flag_emoji: '🌐',
      domain: s.specialization || 'General Research',
      description: s.bio || '',
      is_honorary: false,
      is_verified: s.verified ?? false,
      is_featured: s.is_featured ?? false,
      total_views: s.total_views ?? 0,
      total_downloads: s.total_downloads ?? 0,
      avatar_url: s.profile_photo_url || rawMetaData.avatar_url || rawMetaData.picture || rawMetaData.image || ''
    };
  });

  return (
    <>
      <main className="min-h-screen bg-white">
        <GSPDistinguishedScholars 
          scholar={formattedScholar}
          videos={videos}
          publications={allWorks}
          reviews={mockReviews}
          allScholars={formattedOtherScholars}
          isOwner={isOwner}
        />
      </main>
      <Footer />
    </>
  )
}
