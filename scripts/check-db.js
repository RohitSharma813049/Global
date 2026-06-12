const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const cols = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'categories'`;
  console.log(cols);
}
check();
