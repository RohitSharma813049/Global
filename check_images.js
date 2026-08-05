const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pubs = await prisma.publications.findMany({
    select: { title: true, cover_image: true }
  });

  pubs.forEach(p => console.log(p.title, '=>', p.cover_image));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
