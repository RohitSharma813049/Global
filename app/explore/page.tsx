import { getExploreData } from "@/app/queries/explore";
import ExploreClient from "./explore-client";

export const revalidate = 60; // Enable ISR caching

export default async function ExplorePage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const data = await getExploreData(searchParams.category);

  return (
    <ExploreClient 
      publications={data.publications} 
      allCategories={data.categories} 
      contentTypes={data.contentTypes} 
    />
  );
}
