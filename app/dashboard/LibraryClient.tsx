'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Eye, Download, Calendar } from 'lucide-react'
import SaveButton from '@/components/save-button'

interface LibraryClientProps {
  initialSaved: any[]
}

export default function LibraryClient({ initialSaved }: LibraryClientProps) {
  const [saved, setSaved] = React.useState(initialSaved)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeFilter, setActiveFilter] = React.useState('All Types')
  
  const filters = ['All Types', 'Article', 'Thesis', 'Ebook', 'Magazine']

  React.useEffect(() => {
    const handleUpdate = () => {
      // we could re-fetch here if needed
    }
    window.addEventListener('libraryUpdated', handleUpdate)
    return () => window.removeEventListener('libraryUpdated', handleUpdate)
  }, [])

  const filteredSaved = saved.filter((item: any) => {
    const pub = item.publications
    if (!pub) return false
    
    // Search filter
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (pub.abstract && pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // Type filter
    const matchesType = activeFilter === 'All Types' || pub.content_type?.toLowerCase() === activeFilter.toLowerCase()
    
    return matchesSearch && matchesType
  })

  if (!saved || saved.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your library is empty</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          You haven't saved any publications yet. Explore the platform and click the bookmark icon to save items here.
        </p>
        <Link 
          href="/explore" 
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Explore Publications
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search saved papers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#2D1B4E] text-white' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List View */}
      <div className="flex flex-col gap-4">
        {filteredSaved.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No publications match your search or filter.</div>
        ) : (
          filteredSaved.map((item: any) => {
            const pub = item.publications
            if (!pub) return null
            
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row h-auto md:h-56 group">
                {/* Image Section */}
                <div className="relative w-full md:w-64 h-48 md:h-full shrink-0 bg-gray-100">
                  <Link href={`/publications/${pub.id}`} className="block w-full h-full">
                    {pub.cover_image ? (
                      <img src={pub.cover_image} alt={pub.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FileText className="w-12 h-12" />
                      </div>
                    )}
                  </Link>
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="bg-[#2D1B4E] px-3 py-1 text-[10px] font-bold tracking-wider rounded uppercase text-white">
                      {pub.content_type || 'PUBLICATION'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <SaveButton 
                      publication={{ id: pub.id, title: pub.title, url: `/publications/${pub.id}` }} 
                      variant="card" 
                      className="bg-[#2D1B4E] text-white p-1.5 rounded !w-auto !h-auto border-none"
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col justify-center flex-grow">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-[#2D1B4E] uppercase tracking-wider">
                      {pub.categories?.name || 'General'}
                    </span>
                  </div>
                  
                  <Link href={`/publications/${pub.id}`} className="group-hover:text-[#2D1B4E] transition-colors">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3 line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                      {pub.title}
                    </h3>
                  </Link>

                  {/* Author / Scholar */}
                  {pub.scholars && (
                    <div className="flex items-center gap-2 mb-3">
                      {pub.scholars.users?.image ? (
                        <img src={pub.scholars.users.image} alt={pub.scholars.users.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          {pub.scholars.users?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span className="text-sm text-gray-600">{pub.scholars.users?.name || 'Unknown Author'}</span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {pub.abstract}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
