const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeSeededData() {
  console.log("Starting cleanup of dummy seeded data...");
  try {
    // We identify dummy scholars by their email domain @global.com (from our seed script)
    // First, find all users with @global.com
    const dummyUsers = await prisma.users.findMany({
      where: {
        email: { endsWith: '@global.com' }
      }
    });

    const userIds = dummyUsers.map(u => u.id);
    console.log(`Found ${userIds.length} dummy users.`);

    if (userIds.length > 0) {
      // Find all scholars for these users
      const dummyScholars = await prisma.scholars.findMany({
        where: { user_id: { in: userIds } }
      });
      const scholarIds = dummyScholars.map(s => s.id);
      
      if (scholarIds.length > 0) {
        console.log(`Found ${scholarIds.length} dummy scholars. Deleting their publications...`);
        // Delete all publications for these scholars
        const pubDelete = await prisma.publications.deleteMany({
          where: { scholar_id: { in: scholarIds } }
        });
        console.log(`Deleted ${pubDelete.count} dummy publications.`);

        // Delete scholars
        const scholarDelete = await prisma.scholars.deleteMany({
          where: { id: { in: scholarIds } }
        });
        console.log(`Deleted ${scholarDelete.count} dummy scholars.`);
      }

      // Delete users
      const userDelete = await prisma.users.deleteMany({
        where: { id: { in: userIds } }
      });
      console.log(`Deleted ${userDelete.count} dummy users.`);
    }

    // Also remove seeded publications that might not be attached to scholars
    // We can identify them by a specific institution or email if we set one, 
    // or just delete publications that don't have a scholar_id
    console.log("Checking for orphaned dummy publications...");
    const orphanedPubs = await prisma.publications.deleteMany({
      where: { scholar_id: null }
    });
    console.log(`Deleted ${orphanedPubs.count} orphaned publications.`);

    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

removeSeededData();
