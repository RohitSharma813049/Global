const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const pubs = await prisma.publications.findMany({ where: { content_type: { equals: 'magazine', mode: 'insensitive' } }, select: { title: true, content_type: true, status: true } });
  console.log(pubs);
}
main().finally(() => prisma.$disconnect());
