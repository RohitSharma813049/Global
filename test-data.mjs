import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Testing homepage_settings...")
    const hp = await prisma.homepage_settings.findFirst()
    console.log("homepage_settings:", hp ? "exists" : "null")
    
    console.log("Testing blogs...")
    const blogs = await prisma.blogs.findMany({ take: 1 })
    console.log("blogs count:", blogs.length)
    
    console.log("Testing news...")
    const news = await prisma.news.findMany({ take: 1 })
    console.log("news count:", news.length)

    console.log("Testing publications...")
    const pubs = await prisma.publications.findMany({ take: 1 })
    console.log("publications count:", pubs.length)
    
    console.log("Testing users/scholars...")
    const users = await prisma.users.findMany({ take: 1 })
    console.log("users count:", users.length)

  } catch (e) {
    console.error("Error:", e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
