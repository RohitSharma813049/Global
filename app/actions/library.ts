'use server'

import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { revalidatePath } from 'next/cache'

export async function toggleSavedPublication(publicationId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { error: 'You must be logged in to save publications.' }
    }

    const userId = session.user.id

    const existing = await prisma.saved_publications.findUnique({
      where: {
        user_id_publication_id: {
          user_id: userId,
          publication_id: publicationId,
        }
      }
    })

    if (existing) {
      // Remove it
      await prisma.saved_publications.delete({
        where: { id: existing.id }
      })
      revalidatePath('/explore')
      revalidatePath(`/dashboard/${session.user.role}/library`)
      return { success: true, saved: false }
    } else {
      // Add it
      await prisma.saved_publications.create({
        data: {
          user_id: userId,
          publication_id: publicationId,
        }
      })
      revalidatePath('/explore')
      revalidatePath(`/dashboard/${session.user.role}/library`)
      return { success: true, saved: true }
    }
  } catch (error: any) {
    console.error('Error toggling saved publication:', error)
    return { error: 'Failed to update library' }
  }
}

export async function isPublicationSaved(publicationId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) return false

    const existing = await prisma.saved_publications.findUnique({
      where: {
        user_id_publication_id: {
          user_id: session.user.id,
          publication_id: publicationId,
        }
      }
    })

    return !!existing
  } catch (error) {
    return false
  }
}

export async function getSavedPublications() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) return { error: 'Unauthorized', data: [] }

    const saved = await prisma.saved_publications.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: 'desc' },
      include: {
        publications: {
          include: {
            categories: true,
            scholars: {
              include: {
                users: { select: { raw_user_meta_data: true } }
              }
            }
          }
        }
      }
    })

    return { data: saved }
  } catch (error: any) {
    console.error('Error fetching saved publications:', error)
    return { error: 'Failed to load library', data: [] }
  }
}
