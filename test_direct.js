const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:global%408860876087@db.smqlnrkhyhnrklqblmyz.supabase.co:5432/postgres"
    }
  }
});

async function main() {
  const c = await prisma.categories.count();
  console.log("Direct connection works! Categories count:", c);
}

main().catch(console.error).finally(() => prisma.$disconnect());
