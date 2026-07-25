const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function fixImages() { 
  const settings = await prisma.homepage_settings.findFirst(); 
  if (settings && settings.settings) { 
    let jsonStr = JSON.stringify(settings.settings); 
    jsonStr = jsonStr.replace(/https:\/\/images\.unsplash\.com[^"'\s]+/g, '/placeholder-user.jpg'); 
    await prisma.homepage_settings.update({ 
      where: { id: settings.id }, 
      data: { settings: JSON.parse(jsonStr) } 
    }); 
    console.log('Updated homepage_settings in DB'); 
  } 

  const cats = await prisma.categories.findMany();
  for (const cat of cats) {
    if (cat.image_url && cat.image_url.includes('unsplash.com')) {
      await prisma.categories.update({
        where: { id: cat.id },
        data: { image_url: '/placeholder-user.jpg' }
      });
      console.log('Updated category: ' + cat.name);
    }
  }

  const pubs = await prisma.publications.findMany();
  for (const p of pubs) {
    if (p.cover_image && p.cover_image.includes('unsplash.com')) {
      await prisma.publications.update({
        where: { id: p.id },
        data: { cover_image: '/placeholder-user.jpg' }
      });
      console.log('Updated pub: ' + p.title);
    }
    if (p.banner_image && p.banner_image.includes('unsplash.com')) {
      await prisma.publications.update({
        where: { id: p.id },
        data: { banner_image: '/placeholder-user.jpg' }
      });
    }
  }
} 

fixImages().catch(console.error).finally(() => prisma.$disconnect());
