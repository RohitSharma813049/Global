const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clean up subject categories and explore categories settings
  const settingsRow = await prisma.homepage_settings.findFirst({
    orderBy: { created_at: 'desc' }
  });
  
  if (settingsRow && settingsRow.settings) {
    let changed = false;
    const settings = settingsRow.settings;
    
    if (Array.isArray(settings.subject_categories)) {
      settings.subject_categories = settings.subject_categories.map(cat => {
        if (cat.name && (cat.name.includes('<br/>') || cat.name.includes('&amp;'))) {
          changed = true;
          return { ...cat, name: cat.name.replace(/<br\/>/g, ' ').replace(/&amp;/g, '&') };
        }
        return cat;
      });
    }

    if (Array.isArray(settings.explore_categories)) {
      settings.explore_categories = settings.explore_categories.map(cat => {
        if (cat.title && cat.title.includes('<br/>')) {
          changed = true;
          return { ...cat, title: cat.title.replace(/<br\/>/g, ' ') };
        }
        return cat;
      });
    }

    if (changed) {
      await prisma.homepage_settings.update({
        where: { id: settingsRow.id },
        data: { settings: settings }
      });
      console.log('Cleaned up HTML tags from settings.');
    } else {
      console.log('No HTML tags found in settings.');
    }
  }

  // 2. Add dummy magazines
  const dummyMagazine = await prisma.publications.create({
    data: {
      title: "Global Scholar Technology Review - August 2026",
      abstract: "In this issue, we explore the latest advancements in AI, sustainable tech, and digital publishing. Read about the future of academia.",
      content_type: "magazine",
      file_url: "#",
      cover_image: "/placeholder-user.png",
      author_name: "GSP Editorial",
      institution: "Global Scholar Platform"
    }
  });

  const dummyMagazine2 = await prisma.publications.create({
    data: {
      title: "Future of Academia - Fall Edition",
      abstract: "A deep dive into open access publishing models and how scholars can leverage new tools to reach wider audiences.",
      content_type: "magazine",
      file_url: "#",
      cover_image: "/placeholder-user.png",
      author_name: "GSP Editorial",
      institution: "Global Scholar Platform"
    }
  });

  console.log('Created dummy magazines.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
