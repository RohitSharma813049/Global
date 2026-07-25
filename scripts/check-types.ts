import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkContentTypes() {
  const types = await prisma.content_types.findMany()
  console.log(JSON.stringify(types, null, 2))
}

checkContentTypes()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
