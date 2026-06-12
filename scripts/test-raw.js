const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const data = await prisma.$queryRaw`
    SELECT 
      p.id, p.title, p.abstract, p.content_type, p.created_at,
      p.views, p.downloads, p.doi, p.file_url, p.status,
      c.name as category_name, c.slug as category_slug,
      s.id as scholar_id, s.user_id as scholar_user_id,
      u.raw_user_meta_data
    FROM public.publications p
    LEFT JOIN public.categories c ON p.category_id = c.id
    LEFT JOIN public.scholars s ON p.scholar_id = s.id
    LEFT JOIN auth.users u ON s.user_id = u.id
    WHERE p.status = 'published'
  `;
  console.log(data);
}
test();
