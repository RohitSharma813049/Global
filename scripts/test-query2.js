import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const p = await prisma.publications.findMany({
    where: { status: 'published' },
    include: {
      categories: true,
      scholars: { include: { users: true } }
    }
  })
  
  console.log('PUBLICATIONS COUNT:', p.length)
}
main()
