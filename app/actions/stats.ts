import { prisma } from '@/lib/db'

import { unstable_cache } from 'next/cache'

export const getPlatformStats = unstable_cache(
  async () => {
    const scholarsCount = await prisma.scholars.count()
    const thesisCount = await prisma.publications.count({ where: { content_type: { in: ['Thesis', 'thesis'], mode: 'insensitive' }, status: 'published' } })
    const ebookCount = await prisma.publications.count({ where: { content_type: { in: ['Ebook', 'ebook', 'e-book'], mode: 'insensitive' }, status: 'published' } })
    const articleCount = await prisma.publications.count({ where: { content_type: { in: ['Article', 'article'], mode: 'insensitive' }, status: 'published' } })
    const magazineCount = await prisma.publications.count({ where: { content_type: { in: ['Magazine', 'magazine'], mode: 'insensitive' }, status: 'published' } })
    return {
      scholarsCount,
      thesisCount,
      ebookCount,
      articleCount,
      magazineCount
    }
  },
  ['stats-platform'],
  { revalidate: 60, tags: ['stats-platform'] }
)
