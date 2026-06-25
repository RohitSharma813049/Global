import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [publications, blogs, news, categories, scholars] = await Promise.all([
      prisma.publications.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { abstract: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { id: true, title: true, abstract: true, content_type: true },
        take: 4,
      }),
      prisma.blogs.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, slug: true },
        take: 3,
      }),
      prisma.news.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        select: { id: true, title: true, slug: true },
        take: 3,
      }),
      prisma.categories.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true, slug: true },
        take: 3,
      }),
      prisma.scholars.findMany({
        where: {
          OR: [
            { bio: { contains: q, mode: 'insensitive' } },
            { specialization: { contains: q, mode: 'insensitive' } },
            { institution: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { users: true },
        take: 3,
      }),
    ]);

    const results = [
      ...publications.map((p) => ({
        type: 'publication',
        id: p.id,
        title: p.title,
        subtitle: p.abstract ? p.abstract.substring(0, 60) + '...' : '',
        link: `/publications/${p.id}`,
      })),
      ...blogs.map((b) => ({
        type: 'blog',
        id: b.id,
        title: b.title,
        subtitle: 'Blog Post',
        link: `/blog/${b.slug}`,
      })),
      ...news.map((n) => ({
        type: 'news',
        id: n.id,
        title: n.title,
        subtitle: 'News',
        link: `/news/${n.slug}`,
      })),
      ...categories.map((c) => ({
        type: 'category',
        id: c.id,
        title: c.name,
        subtitle: 'Category',
        link: `/explore/${c.slug}`,
      })),
      ...scholars.map((s) => {
        const name = (s.users?.raw_user_meta_data as any)?.name || s.users?.email || 'Unknown Scholar';
        return {
          type: 'scholar',
          id: s.id,
          title: name,
          subtitle: s.specialization || s.institution || 'Scholar Profile',
          link: `/scholars/${s.id}`,
        };
      }),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
