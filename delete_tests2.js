const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const testPubs = await prisma.publications.findMany({
    where: {
      title: { contains: 'test', mode: 'insensitive' }
    }
  });

  console.log(`Found ${testPubs.length} test publications:`, testPubs.map(p => p.title));

  for (const pub of testPubs) {
    await prisma.publications.delete({
      where: { id: pub.id }
    });
    console.log(`Deleted ${pub.title}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
