const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting category cleanup and update...');

  // Step 1: Delete all existing content_types and categories
  console.log('Deleting existing content types and categories...');
  await prisma.content_types.deleteMany();
  await prisma.categories.deleteMany();

  // Step 2: Insert Content Types
  console.log('Inserting requested Content Types...');
  const contentTypes = [
    { name: 'Thesis', slug: 'thesis', icon_name: 'book' },
    { name: 'Article', slug: 'article', icon_name: 'file-text' },
    { name: 'Ebook', slug: 'ebook', icon_name: 'bookmark' },
    { name: 'Magazine', slug: 'magazine', icon_name: 'layout' },
  ];

  for (const ct of contentTypes) {
    await prisma.content_types.create({ data: ct });
  }

  // Step 3: Insert Subject Categories
  console.log('Inserting requested Subject Categories...');
  const subjects = [
    'Computer Science & AI',
    'Engineering & Technology',
    'Medical & Health Sciences',
    'Business & Management',
    'Social Sciences',
    'Education',
    'Humanities',
    'Law',
    'Agriculture',
    'Environmental Studies',
    'Other'
  ];

  for (const subject of subjects) {
    // Generate a slug by lowercasing and replacing spaces/special chars with hyphens
    const slug = subject.toLowerCase().replace(/ & /g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await prisma.categories.create({
      data: {
        name: subject,
        slug: slug,
        content_types: ['thesis', 'article', 'ebook', 'magazine']
      }
    });
  }

  console.log('✅ Successfully updated categories and content types!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
