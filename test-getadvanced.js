const { prisma } = require('./lib/db');
const { getAdvancedSearchData } = require('./app/queries/search');

async function test() {
  const res = await getAdvancedSearchData({ authors: ['Dhruv Sharma'] });
  console.log("Total Count:", res.totalCount);
  console.log("Returned Publications Authors:");
  res.publications.forEach(p => {
    console.log(`- ${p.title} | author_name: ${p.author_name} | scholar_meta_name: ${p.scholars?.users?.raw_user_meta_data?.full_name}`);
  });
}
test().catch(console.error);
