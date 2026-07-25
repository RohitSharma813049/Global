const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDb() {
  const settings = await prisma.homepage_settings.findFirst({
    orderBy: { created_at: 'desc' }
  });

  if (settings && settings.settings) {
    let s = settings.settings;

    // Update hero search filters
    if (s.hero_search_filters && s.hero_search_filters.includes('Theses')) {
      s.hero_search_filters = ['All', 'Agriculture', 'Computer Science', 'Business', 'Humanities', 'Scholars'];
    }

    // Update explore categories
    if (s.explore_categories && s.explore_categories.some(x => x.title.includes('Thesis'))) {
      s.explore_categories = [
        { title: 'Featured<br/>Agriculture', count: '1,240+ Papers', image: '/placeholder.svg', link: '/explore?category=agriculture' },
        { title: 'Trending<br/>Computer Science', count: '3,860+ Papers', image: '/placeholder.svg', link: '/explore?category=computer-science-ai' },
        { title: 'Latest<br/>Business', count: '980+ Papers', image: '/placeholder.svg', link: '/explore?category=business-management' },
        { title: 'Latest<br/>Humanities', count: '410+ Papers', image: '/placeholder.svg', link: '/explore?category=humanities' }
      ];
    }

    await prisma.homepage_settings.update({
      where: { id: settings.id },
      data: { settings: s }
    });

    console.log("Updated homepage settings in DB to replace Thesis/Articles with actual Categories.");
  }
}

updateDb().catch(console.error).finally(() => prisma.$disconnect());
