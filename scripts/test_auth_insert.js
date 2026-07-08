const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = '11111111-1111-1111-1111-111111111111';
  try {
    const user = await prisma.users.create({
      data: {
        id: userId,
        email: 'test_scholar@global.com',
        raw_user_meta_data: {
          name: 'Test Scholar',
          avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=560&fit=crop&crop=face&auto=format&q=85'
        }
      }
    });
    console.log('User created:', user.id);
    
    // Clean up
    await prisma.users.delete({ where: { id: userId } });
    console.log('User deleted');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
