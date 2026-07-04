'use server'

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

export async function toggleFeaturedScholar(scholarId: string, isFeatured: boolean) {
  try {
    // Check auth (assuming protected route, but double check)
    // const session = await getServerSession(authOptions)
    // if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    //   return { error: 'Unauthorized' }
    // }

    await prisma.scholars.update({
      where: { id: scholarId },
      data: { is_featured: isFeatured }
    })

    revalidatePath('/dashboard/admin/scholars')
    revalidatePath('/')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error toggling featured status:', error)
    return { error: error.message || 'Failed to update' }
  }
}
