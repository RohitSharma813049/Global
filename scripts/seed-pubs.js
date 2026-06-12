const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Get a user
  const user = await prisma.users.findFirst({
    where: { email: { contains: 'john' } }
  })

  if (!user) {
    console.log('No user found! Run the main seed script first.')
    return
  }

  // Create Scholar
  let scholar = await prisma.scholars.findFirst({
    where: { user_id: user.id }
  })

  if (!scholar) {
    scholar = await prisma.scholars.create({
      data: {
        user_id: user.id,
        bio: 'Dummy Scholar',
        institution: 'Global University',
        qualification: 'PhD',
        specialization: 'Computer Science'
      }
    })
    console.log('Created scholar')
  }

  // Create Content Types
  const ct1 = await prisma.content_types.upsert({
    where: { slug: 'thesis' },
    update: {},
    create: {
      name: 'Thesis',
      slug: 'thesis',
      icon_name: 'book'
    }
  })

  const ct2 = await prisma.content_types.upsert({
    where: { slug: 'article' },
    update: {},
    create: {
      name: 'Article',
      slug: 'article',
      icon_name: 'file'
    }
  })

  // Get a category
  const category = await prisma.categories.findFirst()

  if (!category) {
    console.log('No category found!')
    return
  }

  // Create publications
  await prisma.publications.create({
    data: {
      scholar_id: scholar.id,
      category_id: category.id,
      title: 'A Comprehensive Study on Artificial Intelligence',
      abstract: 'This is a test abstract for the AI thesis.',
      content_type: ct1.slug,
      file_url: '/dummy.pdf',
      status: 'published',
      views: 150,
      downloads: 20
    }
  })

  await prisma.publications.create({
    data: {
      scholar_id: scholar.id,
      category_id: category.id,
      title: 'Machine Learning in Medical Diagnostics',
      abstract: 'This is a test abstract for the medical ML article.',
      content_type: ct2.slug,
      file_url: '/dummy2.pdf',
      status: 'published',
      views: 340,
      downloads: 80
    }
  })

  console.log('Seed completed successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
