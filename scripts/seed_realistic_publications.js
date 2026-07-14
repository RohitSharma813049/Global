const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

const contentTypes = ["Article", "Thesis", "Ebook", "Magazine"];

const images = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=340&fit=crop&auto=format&q=80",
  "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500&h=340&fit=crop&auto=format&q=80"
];

const titleTemplates = [
  "Advanced Paradigms in {cat}",
  "The Future of {cat}: A Comprehensive Analysis",
  "Decolonizing Knowledge Systems in {cat}",
  "Understanding {cat} through Machine Learning",
  "Ethical Considerations for {cat}",
  "Global Trends and Policies in {cat}",
  "A Review of Recent Discoveries in {cat}",
  "Methodological Innovations in {cat}"
];

async function main() {
  console.log('Cleaning up old fake publications...');
  await prisma.publications.deleteMany({
    where: {
      title: { startsWith: 'Research paper by' }
    }
  });

  const scholars = await prisma.scholars.findMany({
    include: { users: { select: { raw_user_meta_data: true } } }
  });
  
  const categories = await prisma.categories.findMany();
  if (categories.length === 0) {
    console.error("No categories found!");
    return;
  }

  let count = 0;
  for (const s of scholars) {
    const pubCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 publications per scholar
    for (let i = 0; i < pubCount; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      const img = images[Math.floor(Math.random() * images.length)];
      
      const tTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
      const title = tTemplate.replace('{cat}', cat.name.replace('<br/>', ' ').replace('&amp;', '&'));

      const scholarName = s.users?.raw_user_meta_data?.name || "Unknown Scholar";

      await prisma.publications.create({
        data: {
          scholar_id: s.id,
          category_id: cat.id,
          title: title,
          abstract: `This ${type.toLowerCase()} explores significant topics within ${cat.name.replace('<br/>', ' ').replace('&amp;', '&')}. Authored by ${scholarName}, the study draws upon diverse methodologies to highlight critical gaps and propose innovative frameworks.`,
          content_type: type,
          file_url: "#",
          cover_image: img,
          author_name: scholarName,
          institution: s.institution,
          status: "published",
          views: Math.floor(Math.random() * 5000),
          downloads: Math.floor(Math.random() * 800)
        }
      });
      count++;
    }
  }

  console.log(`Successfully created ${count} diverse, realistic publications.`);
}

main().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
