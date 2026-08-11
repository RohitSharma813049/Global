import { prisma } from '@/lib/db'
import { cacheOrFetch } from '@/lib/redis-cache'

export async function getRecentPublishedPublications(limit: number = 8) {
  return cacheOrFetch(
    `cms-recent-publications-${limit}`,
    60,
    async () => {
      return await prisma.publications.findMany({
        where: { status: 'published', deleted_at: null },
        include: {
          categories: true,
          scholars: {
            include: {
              users: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        take: limit
      })
    },
    ['cms-recent-publications']
  )
}

export async function getFeaturedPublications(limit: number = 8) {
  return cacheOrFetch(
    `cms-featured-publications-${limit}`,
    60,
    async () => {
      return await prisma.publications.findMany({
        where: { status: 'published', deleted_at: null, is_featured: true },
        include: {
          categories: true,
          scholars: {
            include: {
              users: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        take: limit
      })
    },
    ['cms-featured-publications', 'cms-recent-publications']
  )
}

export async function getHeroPublications(limit: number = 8) {
  return cacheOrFetch(
    `cms-hero-publications-${limit}`,
    60,
    async () => {
      return await prisma.publications.findMany({
        where: { status: 'published', deleted_at: null, is_hero: true },
        include: {
          categories: true,
          scholars: {
            include: {
              users: true
            }
          }
        },
        orderBy: { created_at: 'desc' },
        take: limit
      })
    },
    ['cms-hero-publications', 'cms-recent-publications']
  )
}
