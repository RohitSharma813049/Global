'use client'

import { useState, useMemo } from 'react'
import SearchBar from '@/components/explore/search-bar'
import FilterSidebar from '@/components/explore/filter-sidebar'
import SortControls from '@/components/explore/sort-controls'
import ContentCard from '@/components/explore/content-card'

export default function CategoryClient({ initialData }: { initialData: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    subjects: string[]
    subcategories: string[]
    authors: string[]
    types: string[]
    yearRange: [number, number]
  }>({
    subjects: [],
    subcategories: [],
    authors: [],
    types: [],
    yearRange: [2000, new Date().getFullYear()],
  })
  const [sortBy, setSortBy] = useState('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [bookmarks, setBookmarks] = useState<string[]>([])

  const availableSubjects = useMemo(() => Array.from(new Set(initialData.map(item => item.subject))).filter(Boolean).sort() as string[], [initialData])
  const availableAuthors = useMemo(() => Array.from(new Set(initialData.map(item => item.author))).filter(Boolean).sort() as string[], [initialData])
  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(initialData.map(item => item.type))).filter(Boolean) as string[]
    return types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
  }, [initialData])

  // Filter and sort logic
  const filteredContent = useMemo(() => {
    const result = initialData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSubject = filters.subjects.length === 0 || filters.subjects.includes(item.subject)
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(item.author)
      const matchesType = filters.types.length === 0 || filters.types.includes(item.type)
      const matchesYear = item.publishedYear >= filters.yearRange[0] && item.publishedYear <= filters.yearRange[1]

      return matchesSearch && matchesSubject && matchesAuthor && matchesType && matchesYear
    })

    // Sort
    if (sortBy === 'latest') {
      result.sort((a, b) => b.publishedYear - a.publishedYear)
    } else if (sortBy === 'mostViewed') {
      result.sort((a, b) => b.views - a.views)
    } else if (sortBy === 'relevance') {
      // Simple relevance: items matching search query more precisely come first
      result.sort((a, b) => {
        const aMatches = a.title.toLowerCase().includes(searchQuery.toLowerCase())
        const bMatches = b.title.toLowerCase().includes(searchQuery.toLowerCase())
        return aMatches === bMatches ? 0 : aMatches ? -1 : 1
      })
    }

    return result
  }, [searchQuery, filters, sortBy, initialData])

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((bid) => bid !== id) : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex gap-6 lg:gap-8">
        {/* Sidebar Filters - Fixed on left */}
        <aside className="hidden sm:block sm:w-64 lg:w-72 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableSubjects={availableSubjects}
            availableSubcategories={[]}
            availableAuthors={availableAuthors}
            availableTypes={availableTypes}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
            {/* Sort Controls and View Mode */}
            <SortControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              resultCount={filteredContent.length}
            />

            {/* Content Grid/List */}
            <div
              className={`gap-4 sm:gap-6 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }`}
            >
              {filteredContent.length > 0 ? (
                filteredContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item as any}
                    viewMode={viewMode}
                    isBookmarked={bookmarks.includes(item.id)}
                    onBookmarkToggle={() => toggleBookmark(item.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-foreground/60">No results found</p>
                  <p className="text-sm text-foreground/40 mt-2">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </main>
  )
}
