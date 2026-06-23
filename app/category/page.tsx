"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/superbaseconfig"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, User, Grid, List as ListIcon } from "lucide-react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import CategoryClient from "@/components/explore/category-client"
import { getPublishedPublications, getAllCategories } from "@/app/actions/publications"
import { getContentTypes } from "@/app/actions/taxonomy"
import FilterSidebar from '@/components/explore/filter-sidebar'
import ContentCard from '@/components/explore/content-card'
import { motion } from 'framer-motion'

interface Publication {
  id: string
  title: string
  abstract: string
  content_type: string
  doi: string | null
  views: number
  downloads: number
  created_at: string
  scholars: {
    id: string
    users: {
      raw_user_meta_data: { full_name?: string, name?: string }
    } | null
  } | null
  categories: {
    name: string
  } | null
  subcategory_ids: string[]
  cover_image?: string | null
  banner_image?: string | null
}

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
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
  
  const [publications, setPublications] = useState<Publication[]>([])
  const [allCategories, setAllCategories] = useState<{id: string, name: string}[]>([])
  const [contentTypes, setContentTypes] = useState<{name: string, slug: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  // Fetch taxonomy and publications on mount
  useEffect(() => {
    // Read query parameter 'q' on mount
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const q = urlParams.get('q')
      if (q) {
        setSearchQuery(q)
      }
    }

    async function fetchData() {
      setIsLoading(true)

      try {
        const [pubResult, cats, types] = await Promise.all([
          getPublishedPublications(),
          getAllCategories(),
          getContentTypes()
        ])
        if (pubResult && pubResult.publications) {
          setPublications(pubResult.publications as any as Publication[])
        }
        if (cats) setAllCategories(cats)
        if (types) setContentTypes(types)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const availableSubjects = useMemo(() => {
    const sorted = allCategories.map(c => c.name).sort()
    const otherIndex = sorted.findIndex(name => name.toLowerCase() === 'other' || name.toLowerCase() === 'others')
    if (otherIndex !== -1) {
      const otherItem = sorted.splice(otherIndex, 1)[0]
      sorted.push(otherItem)
    }
    return sorted
  }, [allCategories])
  
  const availableSubcategories = useMemo(() => {
    const subCats = publications.flatMap(p => p.subcategory_ids || []).map(id => allCategories.find(c => c.id === id)?.name)
    return Array.from(new Set(subCats)).filter(Boolean).sort() as string[]
  }, [publications, allCategories])
  
  const availableAuthors = useMemo(() => Array.from(new Set(publications.map(p => p.scholars?.users?.raw_user_meta_data?.full_name || p.scholars?.users?.raw_user_meta_data?.name))).filter(Boolean).sort() as string[], [publications])

  const availableTypes = useMemo(() => {
    return contentTypes.map(ct => ({ value: ct.slug, label: ct.name }))
  }, [contentTypes])

  // Client-side filtering
  const filteredPublications = useMemo(() => {
    return publications.filter(p => {
      const pubYear = new Date(p.created_at).getFullYear()
      const authorName = p.scholars?.users?.raw_user_meta_data?.full_name || p.scholars?.users?.raw_user_meta_data?.name || "Unknown Author"
      const categoryName = p.categories?.name || "General"

      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.abstract?.toLowerCase().includes(searchQuery.toLowerCase())

      const pubSubCats = (p.subcategory_ids || []).map(id => allCategories.find(c => c.id === id)?.name).filter(Boolean) as string[]
      
      const matchesSubject = filters.subjects.length === 0 || filters.subjects.includes(categoryName)
      
      const matchesSubcategory = filters.subcategories.length === 0 || 
                                 pubSubCats.some(sub => filters.subcategories.includes(sub))
                                 
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(authorName)
      const matchesType = filters.types.length === 0 || filters.types.includes(p.content_type)
      const matchesYear = pubYear >= filters.yearRange[0] && pubYear <= filters.yearRange[1]

      return matchesSearch && matchesSubject && matchesSubcategory && matchesAuthor && matchesType && matchesYear
    }).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    })
  }, [publications, searchQuery, filters, allCategories, sortOrder])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── TOP SEARCH BANNER ── */}
      <div className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-6 text-center">Global Publication Engine</h1>
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <Input
              type="text"
              className="w-full h-16 pl-12 pr-4 text-lg rounded-2xl border-gray-300 shadow-sm focus-visible:ring-indigo-600 focus-visible:border-indigo-600 transition-all bg-gray-50 hover:bg-white"
              placeholder="Search by title, author, DOI, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Quick Category Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setFilters({ ...filters, subjects: [] })}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
                filters.subjects.length === 0 
                  ? 'bg-indigo-600 text-white border border-indigo-600' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              All Categories
            </button>
            {availableSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setFilters({ ...filters, subjects: [subject] })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
                  filters.subjects.includes(subject) && filters.subjects.length === 1
                    ? 'bg-indigo-600 text-white border border-indigo-600'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-8">
        
        {/* ── SIDEBAR FILTERS (DESKTOP) ── */}
        <aside className="hidden md:block w-full md:w-64 shrink-0 space-y-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            availableSubjects={availableSubjects}
            availableSubcategories={availableSubcategories}
            availableAuthors={availableAuthors}
            availableTypes={availableTypes}
          />
        </aside>

        {/* ── RESULTS FEED ── */}
        <div className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {isLoading ? "Searching..." : `${filteredPublications.length} Results Found`}
            </h2>
            
            {/* Grid/List View Toggles & Sort */}
            <div className="flex items-center space-x-4">
              <select
                className="text-sm border-none bg-transparent text-muted-foreground focus:ring-0 cursor-pointer"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              >
                <option value="newest">Newest to Oldest</option>
                <option value="oldest">Oldest to Newest</option>
              </select>
              
              <div className="flex items-center space-x-2 bg-background p-1 rounded-md border border-border">
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mobile Filter Button */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto pt-12">
                  <SheetTitle className="mb-6 font-bold text-xl">Filters</SheetTitle>
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    availableSubjects={availableSubjects}
                    availableSubcategories={availableSubcategories}
                    availableAuthors={availableAuthors}
                    availableTypes={availableTypes}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-100 p-6 h-40 animate-pulse flex flex-col justify-between">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPublications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No publications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="outline" 
                className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() => {
                  setSearchQuery("")
                  setFilters({
                    subjects: [],
                    subcategories: [],
                    authors: [],
                    types: [],
                    yearRange: [2000, new Date().getFullYear()],
                  })
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
              {filteredPublications.map((pub, index) => {
                const authorName = pub.scholars?.users?.raw_user_meta_data?.full_name || pub.scholars?.users?.raw_user_meta_data?.name || "Unknown Author"
                
                const contentItem = {
                  id: pub.id,
                  title: pub.title,
                  author: authorName,
                  type: pub.content_type,
                  category: pub.categories?.name || "General",
                  description: pub.abstract?.replace(/<[^>]+>/g, '') || "No abstract available for this publication.",
                  views: pub.views || 0,
                  downloads: pub.downloads || 0,
                  publishedYear: new Date(pub.created_at).getFullYear(),
                  subject: pub.categories?.name || "General",
                  imageUrl: pub.cover_image || undefined
                }

                return (
                  <motion.div
                    key={pub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ContentCard 
                      item={contentItem}
                      viewMode={viewMode}
                      isBookmarked={false} // Bookmarks can be integrated later via a context or state
                      onBookmarkToggle={() => {}} 
                    />
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
