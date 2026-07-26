import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getRecentPublishedPublications = unstable_cache(
  async (limit: number = 8) => {
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
  ['cms-recent-publications'],
  { revalidate: 60, tags: ['cms-recent-publications'] }
)

export const getFeaturedPublications = unstable_cache(
  async (limit: number = 8) => {
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
  ['cms-featured-publications'],
  { revalidate: 60, tags: ['cms-featured-publications', 'cms-recent-publications'] }
)

export const getHeroPublications = unstable_cache(
  async (limit: number = 8) => {
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
  ['cms-hero-publications'],
  { revalidate: 60, tags: ['cms-hero-publications', 'cms-recent-publications'] }
)
