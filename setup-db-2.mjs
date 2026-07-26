import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Attempting to add is_featured to blogs...")
    await prisma.$executeRaw`ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;`
    console.log("Added is_featured to blogs.")

    console.log("Attempting to add is_featured to news...")
    await prisma.$executeRaw`ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;`
    console.log("Added is_featured to news.")

  } catch (e) {
    console.error("Error:", e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
