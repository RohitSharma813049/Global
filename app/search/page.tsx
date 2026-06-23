import Footer from "@/components/footer"
import Header from "@/components/header"
import { Search, Filter, BookOpen, Download, Eye } from "lucide-react"
import GlobalSearch from "@/components/global-search"
import InfiniteSearchResults from "@/components/infinite-search-results"
import Link from "next/link"
import { SearchParams } from "@/app/actions/search"

export const metadata = {
  title: "Advanced Search - Global Scholar Publications",
  description: "Search across thesis, research papers, articles, and eBooks.",
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<any> | any }) {
  // Await searchParams in Next.js 15+ if needed, but typically it is synchronously available in 14 or we can just access it.
  // Next 15 recommends awaiting it.
  const params = await searchParams;
  
  const query = params?.q || '';
  const type = params?.type || 'All';
  const category = params?.category || '';
  const year = params?.year || 'Any Year';
  const sortBy = params?.sort || 'Relevance';

  const currentParams: SearchParams = {
    query,
    type,
    category,
    year,
    sortBy,
    limit: 10
  }

  // Helper for generating filter URLs
  const createQueryString = (name: string, value: string) => {
    const paramsObj = new URLSearchParams(params);
    if (value && value !== 'All' && value !== 'Any Year') {
      paramsObj.set(name, value);
    } else {
      paramsObj.delete(name);
    }
    return `?${paramsObj.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Search Hero (Explore-like UI) */}
      <div className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-6 text-center">Advanced Academic Search</h1>
          <p className="text-lg text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            Discover millions of peer-reviewed papers, thesis, articles, and eBooks.
          </p>
          <div className="relative max-w-3xl mx-auto group">
            <GlobalSearch className="w-full" />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Content Type</h3>
                <div className="space-y-2">
                  {['All', 'Thesis', 'Research Papers', 'Articles', 'eBooks'].map(t => (
                    <Link href={`/search${createQueryString('type', t)}`} key={t} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${type === t ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-500'}`}>
                        {type === t && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">{t}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-2">
                  {['All', 'Engineering', 'Medical', 'Management', 'Humanities', 'Law'].map(cat => (
                    <Link href={`/search${createQueryString('category', cat === 'All' ? '' : cat)}`} key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${(category === cat || (category === '' && cat === 'All')) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-500'}`}>
                        {((category === cat) || (category === '' && cat === 'All')) && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-gray-700 text-sm group-hover:text-indigo-600 transition-colors">{cat}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Year</h3>
                <Link href={`/search${createQueryString('year', '2026')}`} className="block text-sm text-gray-700 hover:text-indigo-600 mb-2">2026</Link>
                <Link href={`/search${createQueryString('year', '2025')}`} className="block text-sm text-gray-700 hover:text-indigo-600 mb-2">2025</Link>
                <Link href={`/search${createQueryString('year', '2024')}`} className="block text-sm text-gray-700 hover:text-indigo-600 mb-2">2024</Link>
                <Link href={`/search${createQueryString('year', '2023 & Older')}`} className="block text-sm text-gray-700 hover:text-indigo-600 mb-2">2023 & Older</Link>
                <Link href={`/search${createQueryString('year', 'Any Year')}`} className="block text-sm text-indigo-600 hover:underline">Clear Year Filter</Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Search Results */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 font-medium">Search Results {query ? `for "${query}"` : ''}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="flex gap-2 text-sm">
                <Link href={`/search${createQueryString('sort', 'Relevance')}`} className={`hover:text-indigo-600 ${sortBy === 'Relevance' ? 'font-bold text-indigo-600' : 'text-gray-600'}`}>Relevance</Link>
                <Link href={`/search${createQueryString('sort', 'Newest First')}`} className={`hover:text-indigo-600 ${sortBy === 'Newest First' ? 'font-bold text-indigo-600' : 'text-gray-600'}`}>Newest</Link>
                <Link href={`/search${createQueryString('sort', 'Most Viewed')}`} className={`hover:text-indigo-600 ${sortBy === 'Most Viewed' ? 'font-bold text-indigo-600' : 'text-gray-600'}`}>Most Viewed</Link>
              </div>
            </div>
          </div>

          <InfiniteSearchResults initialParams={currentParams} />
        </div>

      </main>

      <Footer />
    </div>
  )
}
