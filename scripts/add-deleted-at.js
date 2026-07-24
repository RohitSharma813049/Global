const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Adding deleted_at to news...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."news" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);`);
    
    console.log("Adding deleted_at to publications...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."publications" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);`);
    
    console.log("Adding deleted_at to blogs...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."blogs" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);`);
    
    console.log("Adding deleted_at to scholars...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "public"."scholars" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ(6);`);

    console.log("Successfully updated database schema.");
  } catch (e) {
    console.error("Error executing query:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
