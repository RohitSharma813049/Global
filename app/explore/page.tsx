import { getAdvancedSearchData } from "@/app/queries/search";
import ExploreClient from "./explore-client";

export const dynamic = 'force-dynamic'; // Ensure searchParams bypass cache

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  
  const query = typeof params.q === 'string' ? params.q : undefined;
  const categories = typeof params.category === 'string' ? [params.category] : Array.isArray(params.category) ? params.category : undefined;
  const types = typeof params.type === 'string' ? [params.type] : Array.isArray(params.type) ? params.type : undefined;
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const sort = typeof params.sort === 'string' ? params.sort : 'newest';

  const data = await getAdvancedSearchData({ query, categories, types, page, sort });

  return (
    <ExploreClient 
      publications={data.publications as any} 
      allCategories={data.categories} 
      contentTypes={data.contentTypes}
      totalCount={data.totalCount}
      currentPage={page}
      initialSearch={query || ""}
      initialCategories={categories || []}
      initialTypes={types || []}
      initialSort={sort}
      allAuthors={data.allAuthors}
      typeCounts={data.typeCounts}
    />
  );
}
