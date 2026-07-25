const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE public.scholars
      ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
      ADD COLUMN IF NOT EXISTS twitter_url TEXT,
      ADD COLUMN IF NOT EXISTS website_url TEXT,
      ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
    `);
    console.log("Successfully added columns to scholars table.");
  } catch (e) {
    console.error("Error adding columns:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
