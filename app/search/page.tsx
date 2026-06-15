import Footer from "@/components/footer"
import Header from "@/components/header"
import { Search, Filter, BookOpen, Download, Eye } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Advanced Search - Global Scholar Publications",
  description: "Search across thesis, research papers, articles, and eBooks.",
}

// This would typically fetch from Prisma, mocking it here for UI initially
const MOCK_RESULTS = [
  {
    id: "1",
    title: "The Impact of Quantum Computing on Cryptography",
    author: "Dr. Sarah Chen",
    type: "Thesis",
    category: "Computer Science",
    year: "2025",
    abstract: "This thesis explores the theoretical and practical implications of quantum algorithms on modern cryptographic protocols, focusing on post-quantum solutions.",
    views: 1240,
    downloads: 342,
  },
  {
    id: "2",
    title: "Machine Learning Models for Early Cancer Detection",
    author: "James Miller",
    type: "Research Paper",
    category: "Medical",
    year: "2024",
    abstract: "An analysis of deep learning networks applied to radiology scans to detect anomalies earlier than traditional methods.",
    views: 890,
    downloads: 215,
  },
  {
    id: "3",
    title: "Sustainable Urban Planning in the 21st Century",
    author: "Elena Rodriguez",
    type: "Article",
    category: "Humanities",
    year: "2026",
    abstract: "A comprehensive review of sustainable urban design principles being adopted in major metropolitan areas.",
    views: 450,
    downloads: 112,
  }
]

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Search Hero */}
      <section className="bg-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Advanced Academic Search</h1>
            <p className="text-lg text-indigo-200">
              Discover millions of peer-reviewed papers, thesis, articles, and eBooks.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by title, author, keyword, or DOI..." 
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                />
              </div>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-colors text-lg whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Content Type</h3>
                <div className="space-y-2">
                  {['All', 'Thesis', 'Research Papers', 'Articles', 'eBooks'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" defaultChecked={type === 'All'} />
                      <span className="text-gray-700 text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Category</h3>
                <div className="space-y-2">
                  {['Engineering', 'Medical', 'Management', 'Humanities', 'Law'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                      <span className="text-gray-700 text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Year</h3>
                <select className="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Any Year</option>
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023 & Older</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Search Results */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 font-medium">Showing 1-3 of 124 results</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 py-1">
                <option>Relevance</option>
                <option>Newest First</option>
                <option>Most Viewed</option>
              </select>
            </div>
          </div>

          {MOCK_RESULTS.map((result) => (
            <div key={result.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {result.type}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {result.category}
                    </span>
                  </div>
                  <Link href={`/publications/${result.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors mb-1">
                      {result.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">
                    By <span className="font-semibold text-gray-900">{result.author}</span> • {result.year}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-indigo-600">
                  <BookMarkedIcon className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {result.abstract}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {result.views}</span>
                  <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> {result.downloads}</span>
                </div>
                <Link 
                  href={`/publications/${result.id}`}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" /> Read Online
                </Link>
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          <div className="flex justify-center pt-8">
            <nav className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
              <span className="text-gray-500">...</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}

function BookMarkedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
