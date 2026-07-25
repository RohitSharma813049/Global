import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const pub = await prisma.publications.findMany({
    where: { title: 'Test 3' },
    include: {
      scholars: true
    }
  })
  console.log(JSON.stringify(pub, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
