const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  const scholars = await prisma.scholars.findMany({ where: { user_id: null } });
  const scholarIds = scholars.map(s => s.id);
  console.log(`Found ${scholarIds.length} orphaned scholars.`);
  if (scholarIds.length > 0) {
    const pubDel = await prisma.publications.deleteMany({ where: { scholar_id: { in: scholarIds } } });
    console.log(`Deleted ${pubDel.count} orphaned publications.`);
    const schDel = await prisma.scholars.deleteMany({ where: { id: { in: scholarIds } } });
    console.log(`Deleted ${schDel.count} orphaned scholars.`);
  }

  const otherPubs = await prisma.publications.findMany({
    where: { scholar_id: { notIn: scholarIds } },
    select: { id: true, title: true, author_name: true }
  });
  console.log(`Remaining valid publications: ${otherPubs.length}`);

  await prisma.$disconnect();
}
clean();
