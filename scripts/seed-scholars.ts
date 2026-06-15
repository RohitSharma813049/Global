import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'
import crypto from 'crypto'

dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

const dummyScholars = [
  {
    email: 'sarah.j@example.com',
    name: 'Dr. Sarah Johnson',
    domain: 'Neuroscience',
    publications: 156,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    is_featured: true
  },
  {
    email: 'michael.c@example.com',
    name: 'Prof. Michael Chen',
    domain: 'Environmental Science',
    publications: 234,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    is_featured: true
  },
  {
    email: 'emily.r@example.com',
    name: 'Dr. Emily Roberts',
    domain: 'Quantum Physics',
    publications: 189,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    is_featured: true
  },
  {
    email: 'james.w@example.com',
    name: 'Prof. James Wilson',
    domain: 'Artificial Intelligence',
    publications: 267,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    is_featured: true
  }
]

async function seedScholars() {
  console.log('Seeding scholars...')
  for (const s of dummyScholars) {
    // 1. Create User
    const userId = crypto.randomUUID()
    const user = await prisma.users.create({
      data: {
        id: userId,
        email: s.email,
        raw_user_meta_data: {
          name: s.name,
          avatar_url: s.avatar,
          role: 'scholar'
        }
      }
    })

    // 2. Create Scholar profile
    const scholar = await prisma.scholars.create({
      data: {
        user_id: user.id,
        institution: 'Global University',
        bio: 'A distinguished researcher.',
        specialization: s.domain,
        verified: true,
        is_featured: s.is_featured,
        total_views: s.publications * 10,
        total_downloads: s.publications * 2
      }
    })

    console.log(`Created scholar: ${s.name}`)
  }
  console.log('Successfully seeded scholars.')
}

seedScholars()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
