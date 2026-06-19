import { prisma } from './lib/db';

async function test() {
  try {
    const q = 'a'; // broad search to catch anything
    const res = await prisma.publications.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { abstract: { contains: q, mode: 'insensitive' } }
        ]
      }
    });
    console.log('Publications found:', res.length);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
