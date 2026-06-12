import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const allPubs = await prisma.publications.findMany({
    select: { id: true, title: true, status: true, created_at: true }
  })
  
  console.log('ALL PUBLICATIONS:', JSON.stringify(allPubs, null, 2))
}
main()
