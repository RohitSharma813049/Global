const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const scholars = await prisma.scholars.findMany({
    include: { users: true }
  });
  console.log(JSON.stringify(scholars, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
