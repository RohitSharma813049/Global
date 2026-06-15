'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPlatformStats() {
  const [scholarsCount, thesisCount, ebookCount, articleCount] = await Promise.all([
    prisma.scholars.count(),
    prisma.publications.count({ where: { content_type: 'thesis', status: 'published' } }),
    prisma.publications.count({ where: { content_type: 'ebook', status: 'published' } }),
    prisma.publications.count({ where: { content_type: 'article', status: 'published' } })
  ])
  
  return {
    scholarsCount,
    thesisCount,
    ebookCount,
    articleCount
  }
}
