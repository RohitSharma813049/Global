const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();

const subjectCategories = [
  "Computer Science & AI",
  "Engineering & Technology",
  "Medical & Health Sciences",
  "Business & Management",
  "Social Sciences",
  "Education",
  "Humanities",
  "Law",
  "Agriculture",
  "Environmental Studies",
  "Other"
];

function slugify(text) {
  return text.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("Seeding new subject categories...");
  let count = 0;
  for (const name of subjectCategories) {
    const slug = slugify(name);
    // Upsert so we don't duplicate
    const existing = await prisma.categories.findFirst({
      where: { slug }
    });
    
    if (!existing) {
      await prisma.categories.create({
        data: { name, slug }
      });
      console.log(`Created category: ${name}`);
      count++;
    } else {
      console.log(`Category already exists: ${name}`);
    }
  }
  console.log(`Done! Added ${count} new categories.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
