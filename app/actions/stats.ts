import { prisma } from '@/lib/db'
import { cacheOrFetch } from '@/lib/redis-cache'

export async function getPlatformStats() {
  return cacheOrFetch(
    'stats-platform',
    60,
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
    ['stats-platform']
  )
}
