const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.categories.findMany();
  console.log("Categories:", cats);
  const types = await prisma.content_types.findMany();
  console.log("Content Types:", types);
  
  const pubs = await prisma.publications.findMany();
  console.log("Publications:", pubs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
