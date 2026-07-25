import { getAdvancedSearchData } from './app/queries/search';

async function test() {
  const res = await getAdvancedSearchData({ types: ['Ebook'] });
  console.log("Total Count:", res.totalCount);
}
test().catch(console.error);
