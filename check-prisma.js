const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetId = '0a46090b-afd7-4386-8c47-42e71b5b35ae';
  const scholar = await prisma.scholars.findFirst({
    where: {
      OR: [
        { id: targetId },
        { user_id: targetId }
      ]
    },
    include: {
      users: true
    }
  });
  console.log("Scholar with users:", scholar);
  process.exit(0);
}

main();
