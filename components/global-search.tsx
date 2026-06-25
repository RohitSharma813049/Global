'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export default function GlobalSearch({ className }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 150)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [wrapperRef])

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Failed to fetch search results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false)
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'publication': return 'bg-blue-100 text-blue-800'
      case 'scholar': return 'bg-purple-100 text-purple-800'
      case 'news': return 'bg-emerald-100 text-emerald-800'
      case 'blog': return 'bg-orange-100 text-orange-800'
      case 'category': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div ref={wrapperRef} className={`relative w-full ${className || 'max-w-md mx-4'}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-indigo-500">
          <Search className="h-5 w-5" />
        </div>
        <input aria-label="Search" 
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!isOpen && e.target.value.length >= 2) setIsOpen(true)
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search publications, scholars, news..."
          className="w-full pl-12 pr-12 py-4 text-base font-medium border-2 border-indigo-100 rounded-full bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-500"
        />
        {isLoading && (
          <div className="absolute right-4 text-indigo-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (debouncedQuery.length >= 2) && (
        <div className="absolute top-full mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[40rem] overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Suggestions
              </div>
              {results.map((result, idx) => (
                <Link
                  key={`${result.type}-${result.id}-${idx}`}
                  href={result.link}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col px-5 py-3 hover:bg-indigo-50/50 transition-colors border-b border-gray-50 last:border-0 group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{result.title}</span>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-md capitalize shrink-0 ml-3 ${getTypeColor(result.type)}`}>
                      {result.type}
                    </span>
                  </div>
                  {result.subtitle && (
                    <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{result.subtitle}</span>
                  )}
                </Link>
              ))}
              <div className="p-3 bg-gray-50/80 border-t border-gray-100 mt-2">
                <Link 
                  href={`/explore?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center w-full py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View all results for "{query}"
                </Link>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="px-4 py-12 text-center flex flex-col items-center justify-center">
              <Search className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm font-medium">No results found for "{query}"</p>
              <p className="text-gray-400 text-xs mt-1">Try a different search term.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
