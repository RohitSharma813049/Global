import { prisma } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getAllCategories = unstable_cache(
  async () => {
    return await prisma.categories.findMany({ orderBy: { name: 'asc' } })
  },
  ['cms-categories'],
  { revalidate: 60, tags: ['cms-categories'] }
)
