import { prisma } from '@/lib/db'

export async function getPlatformStats() {
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
}
