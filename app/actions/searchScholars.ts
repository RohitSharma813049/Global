'use server'

import { prisma } from "@/lib/db"

export async function searchScholarsQuery(query: string) {
  if (!query || query.length < 2) return []

  try {
    const scholars = await prisma.scholars.findMany({
      include: {
        users: true
      },
      take: 100
    })

    const filteredScholars = scholars.filter(scholar => {
      const meta = scholar.users?.raw_user_meta_data as any
      const name = meta?.name || meta?.full_name || ''
      const email = scholar.users?.email || ''
      const username = scholar.username || ''
      const inst = scholar.institution || ''
      const spec = scholar.specialization || ''
      const qLower = query.toLowerCase()

      return (
        name.toLowerCase().includes(qLower) ||
        username.toLowerCase().includes(qLower) ||
        email.toLowerCase().includes(qLower) ||
        inst.toLowerCase().includes(qLower) ||
        spec.toLowerCase().includes(qLower)
      )
    }).slice(0, 8)

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
