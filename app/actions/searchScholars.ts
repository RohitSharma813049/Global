'use server'

import { prisma } from "@/lib/db"

export async function searchScholarsQuery(query: string) {
  if (!query || query.length < 2) return []

  try {
    const scholars = await prisma.scholars.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { 
            users: { 
              email: { contains: query, mode: 'insensitive' }
            }
          }
        ]
      },
      include: {
        users: true
      },
      take: 5
    })

    const filteredScholars = scholars.filter(scholar => {
      const meta = scholar.users?.raw_user_meta_data as any
      const name = meta?.name || meta?.full_name || ''
      return (
        (scholar.username && scholar.username.toLowerCase().includes(query.toLowerCase())) ||
        (scholar.users?.email && scholar.users.email.toLowerCase().includes(query.toLowerCase())) ||
        (name && name.toLowerCase().includes(query.toLowerCase()))
      )
    })

    return filteredScholars.map(scholar => {
      const meta = scholar.users?.raw_user_meta_data as any
      const name = meta?.name || meta?.full_name || scholar.users?.email?.split('@')[0] || 'Unknown'
      const avatar = scholar.profile_photo_url || meta?.avatar_url || meta?.picture || meta?.image || ''
      
      return {
        id: scholar.id,
        username: scholar.username || scholar.id,
        name,
        avatar
      }
    })
  } catch (error) {
    console.error("Error searching scholars:", error)
    return []
  }
}
