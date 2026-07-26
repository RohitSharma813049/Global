const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "publications" ADD COLUMN "is_hero" BOOLEAN DEFAULT false;`);
    console.log('Successfully added is_hero column');
  } catch (error) {
    console.error('Error adding is_hero column:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
