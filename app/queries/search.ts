import { prisma } from "@/lib/db"

export interface SearchParams {
  query?: string;
  categories?: string[];
  types?: string[];
  authors?: string[];
  page?: number;
  limit?: number;
  sort?: string;
}

export async function getAdvancedSearchData(params: SearchParams) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: 'published',
      deleted_at: null,
    };

    if (params.query) {
      whereClause.OR = [
        { title: { contains: params.query, mode: 'insensitive' } },
        { abstract: { contains: params.query, mode: 'insensitive' } },
        { author_name: { contains: params.query, mode: 'insensitive' } },
      ];
    }

    if (params.categories && params.categories.length > 0) {
      whereClause.categories = {
        name: { in: params.categories, mode: 'insensitive' }
      };
    }

    if (params.types && params.types.length > 0) {
      // Exclude 'magazine' from publications query if it's there
      const pubTypes = params.types.filter(t => t.toLowerCase() !== 'magazine');
      if (pubTypes.length > 0) {
        whereClause.content_type = { in: pubTypes, mode: 'insensitive' };
      } else {
        // If ONLY magazine is selected, publications shouldn't match anything
        whereClause.id = 'no-match'; 
      }
    }

    if (params.authors && params.authors.length > 0) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const authorIds = params.authors.filter(a => uuidRegex.test(a));
      const authorNames = params.authors.filter(a => !uuidRegex.test(a));
      
      whereClause.AND = whereClause.AND || [];
      const orConditions: any[] = [];
      
      if (authorIds.length > 0) {
        orConditions.push({ scholar_id: { in: authorIds } });
      }
      
      if (authorNames.length > 0) {
        const lowerAuthors = authorNames.map(a => a.toLowerCase());
        const allScholarsForFilter = await prisma.scholars.findMany({
          where: { deleted_at: null },
          select: { id: true, users: { select: { raw_user_meta_data: true } } }
        });
        const validScholarIds = allScholarsForFilter.filter(s => {
          const name = (s.users?.raw_user_meta_data as any)?.full_name || (s.users?.raw_user_meta_data as any)?.name;
          return name && lowerAuthors.includes(name.toLowerCase());
        }).map(s => s.id);

        if (validScholarIds.length > 0) {
          orConditions.push({ scholar_id: { in: validScholarIds } });
        }
        
        const authorOrs = authorNames.map(a => ({ author_name: { equals: a, mode: 'insensitive' } }));
        orConditions.push(...authorOrs);
      }
      
      if (orConditions.length > 0) {
        whereClause.AND.push({ OR: orConditions });
      }
    }

    // MAGAZINE LOGIC
    let includeMagazines = true;
    if (params.types && params.types.length > 0) {
      includeMagazines = params.types.some(t => t.toLowerCase() === 'magazine');
    }
    const magazineWhere: any = {};
    if (params.query) {
      magazineWhere.OR = [
        { title: { contains: params.query, mode: 'insensitive' } },
        { content: { contains: params.query, mode: 'insensitive' } },
      ];
    }
    // Note: Authors and categories aren't directly on magazines right now, so we skip filtering them for magazines

    let orderBy: any = { created_at: 'desc' };
    if (params.sort === 'oldest') orderBy = { created_at: 'asc' };
    if (params.sort === 'views') orderBy = { views: 'desc' };
    if (params.sort === 'downloads') orderBy = { downloads: 'desc' };

    // Fetch all for pagination in memory to merge correctly
    const [allPubs, allMags, catsResponse, typesResponse, allScholarsResponse, uniqueAuthorNames, pubTypeCounts, magCount] = await Promise.all([
      prisma.publications.findMany({
        where: whereClause,
        orderBy,
        include: {
          categories: { select: { name: true, slug: true } },
          scholars: {
            select: { id: true, user_id: true, users: { select: { raw_user_meta_data: true } } }
          }
        }
      }),
      includeMagazines ? prisma.magazines.findMany({
        where: magazineWhere,
        orderBy: { created_at: params.sort === 'oldest' ? 'asc' : 'desc' }
      }) : Promise.resolve([]),
      prisma.categories.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
      prisma.content_types.findMany({ orderBy: { name: 'asc' } }),
      prisma.scholars.findMany({
        where: { deleted_at: null, publications: { some: { status: 'published', deleted_at: null } } },
        select: { id: true, users: { select: { raw_user_meta_data: true } } }
      }),
      prisma.publications.findMany({
        where: { status: 'published', deleted_at: null },
        select: { author_name: true },
        distinct: ['author_name']
      }),
      prisma.publications.groupBy({
        by: ['content_type'],
        _count: { id: true },
        where: { status: 'published', deleted_at: null }
      }),
      prisma.magazines.count({ where: magazineWhere })
    ]);

    const formattedPublications = allPubs.map((p) => ({
      id: p.id,
      title: p.title,
      abstract: p.abstract,
      content_type: p.content_type,
      created_at: p.created_at?.toISOString() || new Date().toISOString(),
      views: Number(p.views) || 0,
      downloads: Number(p.downloads) || 0,
      file_url: p.file_url,
      cover_image: p.cover_image,
      banner_image: p.banner_image,
      gallery_images: p.gallery_images,
      doi: p.doi,
      video_url: p.video_url,
      author_name: p.author_name,
      institution: p.institution,
      email_address: p.email_address,
      status: p.status,
      categories: p.categories ? { name: p.categories.name, slug: p.categories.slug } : null,
      scholars: p.scholars ? {
        id: p.scholars.id,
        user_id: p.scholars.user_id,
        users: {
          raw_user_meta_data: p.scholars.users?.raw_user_meta_data || { name: "Unknown Author", full_name: "Unknown Author" }
        }
      } : null
    }));

    const mappedMagazines = allMags.map((m) => ({
      id: m.id,
      title: m.title,
      abstract: m.content,
      content_type: 'magazine',
      created_at: m.created_at?.toISOString() || new Date().toISOString(),
      views: 0,
      downloads: 0,
      file_url: null,
      cover_image: m.cover_image,
      banner_image: null,
      gallery_images: [],
      doi: null,
      video_url: null,
      author_name: 'Admin',
      institution: null,
      email_address: null,
      status: 'published',
      categories: null,
      scholars: null
    }));

    let mergedData = [...formattedPublications, ...mappedMagazines];
    
    // In-memory sort
    if (params.sort === 'oldest') {
      mergedData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (params.sort === 'views') {
      mergedData.sort((a, b) => b.views - a.views);
    } else if (params.sort === 'downloads') {
      mergedData.sort((a, b) => b.downloads - a.downloads);
    } else {
      // newest
      mergedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const totalCount = mergedData.length;
    const paginatedData = mergedData.slice(skip, skip + limit);

    const scholarsMapped = allScholarsResponse.map(s => {
      const name = (s.users?.raw_user_meta_data as any)?.full_name || (s.users?.raw_user_meta_data as any)?.name || 'Unknown';
      return { id: s.id, name };
    });
    
    const legacyMapped = uniqueAuthorNames.filter(p => p.author_name).map(p => ({
      id: p.author_name as string,
      name: p.author_name as string
    }));

    const allAuthorsMap = new Map<string, { id: string, name: string }>();
    [...scholarsMapped, ...legacyMapped].forEach(a => {
      if (a.id && !allAuthorsMap.has(a.id)) {
        allAuthorsMap.set(a.id, a);
      }
    });

    const allAuthors = Array.from(allAuthorsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    const formattedTypeCounts = pubTypeCounts.reduce((acc, curr) => {
      const typeKey = (curr.content_type || '').toLowerCase();
      acc[typeKey] = (acc[typeKey] || 0) + curr._count.id;
      return acc;
    }, {} as Record<string, number>);
    
    formattedTypeCounts['magazine'] = (formattedTypeCounts['magazine'] || 0) + magCount;

    return {
      publications: paginatedData,
      totalCount,
      categories: catsResponse || [],
      contentTypes: typesResponse || [],
      allAuthors,
      typeCounts: formattedTypeCounts
    }
  } catch (error: any) {
    console.error('[getAdvancedSearchData] Error fetching data:', error)
    return {
      publications: [],
      totalCount: 0,
      categories: [],
      contentTypes: [],
      allAuthors: []
    }
  }
}
