import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRaw`ALTER TABLE public.scholars ADD COLUMN username text UNIQUE;`;
    console.log('Successfully added username column to scholars table.');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('Column username already exists.');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
