const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const authors = ['Dhruv Sharma'];
  
  const allScholarsForFilter = await prisma.scholars.findMany({
    where: { deleted_at: null },
    select: { id: true, users: { select: { raw_user_meta_data: true } } }
  });
  
  const validScholarIds = allScholarsForFilter.filter(s => {
    const name = s.users?.raw_user_meta_data?.full_name || s.users?.raw_user_meta_data?.name;
    return authors.includes(name);
  }).map(s => s.id);
  
  console.log("Valid Scholar IDs:", validScholarIds);
  
  const whereClause = {
    status: 'published',
    deleted_at: null,
    AND: [
      {
        OR: [
          { author_name: { in: authors, mode: 'insensitive' } },
          { scholar_id: { in: validScholarIds.length > 0 ? validScholarIds : ['00000000-0000-0000-0000-000000000000'] } }
        ]
      }
    ]
  };
  
  const pubs = await prisma.publications.findMany({
    where: whereClause,
    select: { id: true, title: true, author_name: true, scholar_id: true }
  });
  
  console.log("Matched Pubs:", pubs);
}

main().catch(console.error).finally(() => prisma.$disconnect());
