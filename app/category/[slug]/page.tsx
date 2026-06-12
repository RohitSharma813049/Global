import { getPublishedPublications } from '@/app/actions/publications'
import CategoryClient from '@/components/explore/category-client'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { publications, error } = await getPublishedPublications(params.slug)
  
  // Transform real database data into the structure expected by the UI
  const mappedData = (publications || []).map((pub: any) => ({
    id: pub.id,
    title: pub.title,
    // Safely extract the author's full name, fallback to 'Unknown Author'
    author: pub.scholars?.users?.raw_user_meta_data?.full_name || 'Unknown Author',
    type: pub.content_type || 'article',
    category: pub.categories?.name || 'General', 
    description: pub.abstract || '',
    views: pub.views || 0,
    downloads: pub.downloads || 0,
    // Extract year from creation date
    publishedYear: pub.created_at ? new Date(pub.created_at).getFullYear() : 2024,
    subject: pub.categories?.name || 'General', 
    fileUrl: pub.file_url,
  }))

  return (
    <CategoryClient initialData={mappedData} />
  )
}
