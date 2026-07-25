const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateLinks() {
  const records = await prisma.homepage_settings.findMany();
  for (const record of records) {
    if (record.settings && record.settings.explore_categories) {
      const s = record.settings;
      s.explore_categories = s.explore_categories.map(cat => {
        if (cat.link) {
          cat.link = cat.link.replace('/publications?category=thesis', '/explore?type=Thesis');
          cat.link = cat.link.replace('/publications?category=article', '/explore?type=Article');
          cat.link = cat.link.replace('/publications?category=e-book', '/explore?type=Ebook');
          cat.link = cat.link.replace('/publications?category=magazine', '/explore?type=Magazine');
          // Catch any generic replacements
          cat.link = cat.link.replace('/publications', '/explore');
        }
        return cat;
      });
      await prisma.homepage_settings.update({
        where: { id: record.id },
        data: { settings: s }
      });
      console.log('Updated links in homepage_settings ID:', record.id);
    }
  }
}
updateLinks().catch(console.error).finally(() => prisma.$disconnect());
