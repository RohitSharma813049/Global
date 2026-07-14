import { getExploreData } from "@/app/queries/explore";
import ExploreClient from "@/app/explore/explore-client";

export const revalidate = 60; // Enable ISR caching

export default async function PublicationsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string, subject?: string, search?: string }>
}) {
  const params = await searchParams;
  // If a category or subject is passed in the query params, we pass it to getExploreData.
  // Note: currently getExploreData only takes categorySlug, we map both to it for now
  const categorySlug = params.category || params.subject;
  const data = await getExploreData();

  return (
    <ExploreClient 
      publications={data.publications} 
      allCategories={data.categories} 
      contentTypes={data.contentTypes}
      initialCategory={categorySlug}
      initialSearch={params.search || ""}
    />
  );
}
