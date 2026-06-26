import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')
  // Clean up existing data in order of constraints
  await prisma.reading_history.deleteMany({})
  await prisma.publications.deleteMany({})
  await prisma.scholars.deleteMany({})
  await prisma.categories.deleteMany({})

  console.log('Creating categories...')
  const techCategory = await prisma.categories.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      content_types: ['eBook', 'Research Paper']
    }
  })

  const scienceCategory = await prisma.categories.create({
    data: {
      name: 'Science & Medicine',
      slug: 'science-medicine',
      content_types: ['eBook', 'Thesis']
    }
  })

  console.log('Creating scholars...')
  const scholar1 = await prisma.scholars.create({
    data: {
      bio: 'Leading researcher in Artificial Intelligence and Neural Networks.',
      institution: 'Stanford University',
      qualification: 'Ph.D. in Computer Science',
      specialization: 'Artificial Intelligence',
      verified: true,
      is_featured: true,
      total_views: 15420,
      total_downloads: 3200,
    }
  })

  const scholar2 = await prisma.scholars.create({
    data: {
      bio: 'Expert in quantum computing and theoretical physics.',
      institution: 'MIT',
      qualification: 'Ph.D. in Physics',
      specialization: 'Quantum Computing',
      verified: true,
      is_featured: false,
      total_views: 8900,
      total_downloads: 1200,
    }
  })

  console.log('Creating publications...')
  const pub1 = await prisma.publications.create({
    data: {
      scholar_id: scholar1.id,
      category_id: techCategory.id,
      title: 'The Future of AI: Generative Models in Practice',
      abstract: 'This eBook explores the impact of generative AI models on modern software development. We delve deep into architectures, training methodologies, and practical applications in the industry.',
      content_type: 'eBook',
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
      author_name: 'Dr. Alan Turing',
      institution: 'Stanford University',
      status: 'published',
      views: 1500,
      downloads: 450,
      originality_declaration: true,
      copyright_declaration: true,
      terms_acceptance: true
    }
  })

  const pub2 = await prisma.publications.create({
    data: {
      scholar_id: scholar2.id,
      category_id: scienceCategory.id,
      title: 'Quantum Advantage: Navigating the New Computing Paradigm',
      abstract: 'A comprehensive thesis on achieving quantum advantage. We provide mathematical proofs and empirical data from recent superconducting qubit experiments.',
      content_type: 'Thesis',
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
      banner_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
      author_name: 'Dr. Marie Curie',
      institution: 'MIT',
      status: 'published',
      views: 800,
      downloads: 120,
      originality_declaration: true,
      copyright_declaration: true,
      terms_acceptance: true
    }
  })

  console.log('Seed completed successfully!')
  console.log('Dummy Publication IDs to test:', pub1.id, pub2.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
