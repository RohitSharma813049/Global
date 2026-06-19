import { prisma } from './lib/db';

async function main() {
  try {
    await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload schema'`);
    console.log("Supabase Schema Cache Reloaded!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
