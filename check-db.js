const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetId = '0a46090b-afd7-4386-8c47-42e71b5b35ae';
  const scholar = await prisma.scholars.findUnique({where: {id: targetId}});
  console.log('Scholar user_id:', scholar.user_id);
  const user = await prisma.users.findUnique({where: {id: scholar.user_id}});
  console.log('User exists?', !!user);
  process.exit(0);
}

main();
