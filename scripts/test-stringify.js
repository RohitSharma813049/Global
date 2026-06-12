import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const publications = await prisma.publications.findMany({
      where: { status: 'published' },
      include: {
        categories: true,
        scholars: { include: { users: true } }
      }
    })
    
    const formattedData = publications.map(p => ({
      ...p,
      created_at: p.created_at?.toISOString() || new Date().toISOString(),
      categories: p.categories ? { name: p.categories.name, slug: p.categories.slug } : null,
      scholars: p.scholars ? {
        id: p.scholars.id,
        user_id: p.scholars.user_id,
        users: p.scholars.users ? {
          raw_user_meta_data: p.scholars.users.raw_user_meta_data || { 
            name: (p.scholars.users.raw_user_meta_data as any)?.name || "Unknown Author",
            full_name: (p.scholars.users.raw_user_meta_data as any)?.full_name || "Unknown Author" 
          }
        } : null
      } : null
    }));

    const result = JSON.stringify(formattedData)
    console.log("Successfully stringified!")
  } catch(e) {
    console.error("Stringify failed", e)
  }
}
main()
