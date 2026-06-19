'use server'

import { prisma } from '@/lib/db'

export interface SearchParams {
  query?: string;
  type?: string;
  category?: string;
  year?: string;
  sortBy?: string;
  limit?: number;
  cursor?: string;
}

export async function searchPublications(params: SearchParams) {
  const { query, type, category, year, sortBy = 'Relevance', limit = 10, cursor } = params;

  let where: any = { status: 'published' };

  if (query && query.length >= 2) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { abstract: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (type && type !== 'All') {
    // Map standard UI labels to DB values
    const typeMap: Record<string, string> = {
      'Thesis': 'thesis',
      'Research Papers': 'article', // assuming
      'Articles': 'article',
      'eBooks': 'ebook'
    };
    const dbType = typeMap[type] || type.toLowerCase();
    where.content_type = dbType;
  }

  if (category) {
    // This expects the category to have the same string name in the DB, or we match its name
    where.categories = {
      name: category
    };
  }

  // Handle year filtering
  if (year && year !== 'Any Year') {
    if (year === '2023 & Older') {
      where.created_at = { lt: new Date('2024-01-01') };
    } else {
      const y = parseInt(year);
      where.created_at = {
        gte: new Date(`${y}-01-01`),
        lt: new Date(`${y + 1}-01-01`)
      };
    }
  }

  let orderBy: any = {};
  if (sortBy === 'Newest First') {
    orderBy = { created_at: 'desc' };
  } else if (sortBy === 'Most Viewed') {
    orderBy = { views: 'desc' };
  } else {
    // default relevance could just be newest first for now
    orderBy = { created_at: 'desc' };
  }

  const queryArgs: any = {
    where,
    orderBy,
    take: limit + 1, // take 1 extra to check if there is a next page
    include: {
      scholars: {
        include: {
          users: true
        }
      },
      categories: true
    }
  };

  if (cursor) {
    queryArgs.cursor = { id: cursor };
    queryArgs.skip = 1; // skip the cursor itself
  }

  const results = await prisma.publications.findMany(queryArgs);

  let nextCursor: string | undefined = undefined;
  if (results.length > limit) {
    const nextItem = results.pop();
    nextCursor = nextItem!.id;
  }

  // Transform results for UI
  const formattedResults = results.map(p => {
    let authorName = 'Unknown Scholar';
    if (p.scholars && p.scholars.users) {
      const meta = p.scholars.users.raw_user_meta_data as any;
      authorName = meta?.name || p.scholars.users.email || 'Unknown Scholar';
    }

    return {
      id: p.id,
      title: p.title,
      author: authorName,
      type: p.content_type === 'article' ? 'Research Paper' : (p.content_type || 'Publication'),
      category: p.categories?.name || 'Uncategorized',
      year: p.created_at ? p.created_at.getFullYear().toString() : 'Unknown',
      abstract: p.abstract,
      views: p.views || 0,
      downloads: p.downloads || 0,
    };
  });

  return {
    results: formattedResults,
    nextCursor
  };
}
