import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

const testimonials = [
  {
    quote: 'Global Scholar transformed how I share my research. The platform is intuitive and reaches scholars worldwide.',
    author: 'Dr. Sarah Johnson',
    role: 'Neuroscience Researcher',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    quote: 'I\'ve discovered breakthrough papers I would have never found otherwise. This platform is invaluable for my work.',
    author: 'Prof. Michael Chen',
    role: 'Environmental Scientist',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    quote: 'The community here is incredible. Collaborating with peers from different countries has expanded my research horizons.',
    author: 'Dr. Emily Roberts',
    role: 'Quantum Physics',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    quote: 'Publishing my thesis was seamless. Global Scholar made it easy to share my work with the academic community.',
    author: 'James Wilson',
    role: 'PhD Candidate',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
]

async function seedTestimonials() {
  console.log('Seeding testimonials...')
  for (const t of testimonials) {
    await prisma.testimonials.create({
      data: t
    })
  }
  console.log('Successfully seeded testimonials.')
}

seedTestimonials()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
