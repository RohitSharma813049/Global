import { createClient } from "@supabase/supabase-js"
import { prisma } from "@/lib/db"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function getExploreData() {
  try {
    const [catsResponse, typesResponse] = await Promise.all([
      supabaseAdmin.from('categories').select('id, name').order('name'),
      supabaseAdmin.from('content_types').select('*').order('name'),
    ]);

    const data: any[] = await prisma.$queryRaw`
      SELECT 
        p.id, p.title, p.abstract, p.content_type, p.created_at,
        p.views, p.downloads, p.file_url, p.cover_image, p.author_name, p.institution, p.email_address, p.status,
        c.name as category_name, c.slug as category_slug,
        s.id as scholar_id, s.user_id as scholar_user_id,
        u.raw_user_meta_data
      FROM public.publications p
      LEFT JOIN public.categories c ON p.category_id = c.id
      LEFT JOIN public.scholars s ON p.scholar_id = s.id
      LEFT JOIN auth.users u ON s.user_id = u.id
      WHERE p.status = 'published' AND p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `;

    const formattedPublications = data.map((p: any) => ({
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
      categories: p.category_name ? { name: p.category_name, slug: p.category_slug } : null,
      scholars: p.scholar_id ? {
        id: p.scholar_id,
        user_id: p.scholar_user_id,
        users: {
          raw_user_meta_data: p.raw_user_meta_data || { 
            name: "Unknown Author",
            full_name: "Unknown Author" 
          }
        }
      } : null
    }));

    return {
      publications: formattedPublications,
      categories: catsResponse.data || [],
      contentTypes: typesResponse.data || []
    }
  } catch (error: any) {
    console.error('[getExploreData] Error fetching data:', error)
    return {
      publications: [],
      categories: [],
      contentTypes: []
    }
  }
}
