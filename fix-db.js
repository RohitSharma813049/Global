const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS serial_number TEXT;`);
    console.log("Column added successfully!");
  } catch (e) {
    console.error("Error adding column:", e);
  }
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE public.publications ADD CONSTRAINT publications_serial_number_key UNIQUE (serial_number);`);
    console.log("Constraint added successfully!");
  } catch (e) {
    console.error("Error adding constraint (might already exist):", e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
