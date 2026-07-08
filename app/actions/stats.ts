import { prisma } from '@/lib/db'

import { unstable_cache } from 'next/cache'

export const getPlatformStats = unstable_cache(
  async () => {
    const scholarsCount = await prisma.scholars.count()
    const thesisCount = await prisma.publications.count({ where: { content_type: 'Thesis', status: 'published' } })
    const ebookCount = await prisma.publications.count({ where: { content_type: 'Ebook', status: 'published' } })
    const articleCount = await prisma.publications.count({ where: { content_type: 'Article', status: 'published' } })
    return {
      scholarsCount,
      thesisCount,
      ebookCount,
      articleCount
    }
  },
  ['stats-platform'],
  { revalidate: 60, tags: ['stats-platform'] }
)
