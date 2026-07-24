const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."categories" ADD COLUMN "image_url" text;`)
    console.log('Column image_url added successfully')
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log('Column already exists, ignoring.')
    } else {
      console.error(e)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
