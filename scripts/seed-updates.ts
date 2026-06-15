import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

const dummyBlogs = [
  {
    title: 'The Future of Quantum Computing',
    slug: 'the-future-of-quantum-computing',
    content: '<p>Quantum computing is rapidly advancing, moving from theoretical physics to practical engineering. In this blog post, we explore the recent breakthroughs in qubit stability and error correction.</p><p>Researchers worldwide are collaborating to build scalable quantum processors that could revolutionize cryptography and materials science.</p>',
    cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    status: 'published'
  },
  {
    title: 'Navigating Open Access Publishing',
    slug: 'navigating-open-access-publishing',
    content: '<p>Open access is changing how scientific knowledge is disseminated. This guide breaks down the differences between Gold, Green, and Hybrid open access models.</p><p>By understanding these options, early-career researchers can maximize the visibility and impact of their work while complying with funder mandates.</p>',
    cover_image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
    status: 'published'
  }
]

const dummyNews = [
  {
    title: 'Global Scholar Platform Reaches 500 Active Researchers',
    slug: 'platform-reaches-500-active-researchers',
    content: '<p>We are thrilled to announce that the Global Scholar community has officially surpassed 500 active, verified scholars! This milestone reflects our shared commitment to accessible research and global collaboration.</p>',
    cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    status: 'published',
    published_at: new Date()
  },
  {
    title: 'Annual Research Grant Applications Now Open',
    slug: 'annual-research-grant-applications-open',
    content: '<p>The Global Scholar foundation is accepting applications for the 2026 Innovation Grant. Eligible scholars can apply for up to $50,000 in funding for projects focusing on sustainable technologies and medical advancements.</p>',
    cover_image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    status: 'published',
    published_at: new Date(Date.now() - 86400000) // 1 day ago
  }
]

async function seedUpdates() {
  console.log('Seeding blogs and news...')
  
  for (const b of dummyBlogs) {
    const existing = await prisma.blogs.findUnique({ where: { slug: b.slug } })
    if (!existing) {
      await prisma.blogs.create({ data: b })
      console.log(`Created blog: ${b.title}`)
    }
  }

  for (const n of dummyNews) {
    const existing = await prisma.news.findUnique({ where: { slug: n.slug } })
    if (!existing) {
      await prisma.news.create({ data: n })
      console.log(`Created news: ${n.title}`)
    }
  }
  
  console.log('Successfully seeded blogs and news.')
}

seedUpdates()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
