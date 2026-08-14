import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getAllCategories = unstable_cache(
  async () => {
    try {
      return await prisma.categories.findMany({ orderBy: { name: 'asc' } })
    } catch (e) {
      console.warn('[getAllCategories] Database query failed, using empty fallback:', e);
      return [];
    }
  },
  ['cms-categories'],
  { revalidate: 60, tags: ['cms-categories'] }
)
