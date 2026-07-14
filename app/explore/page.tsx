import { getExploreData } from "@/app/queries/explore";
import ExploreClient from "./explore-client";

export const revalidate = 60; // Enable ISR caching

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams;
  const data = await getExploreData();

  return (
    <ExploreClient 
      publications={data.publications} 
      allCategories={data.categories} 
      contentTypes={data.contentTypes} 
      initialCategory={params.category}
    />
  );
}
