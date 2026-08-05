'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchScholarsQuery } from '@/app/actions/searchScholars'
import Image from 'next/image'

export default function ScholarSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(async () => {
      const currentQuery = searchParams.get('q') || ''
      if (query !== currentQuery) {
        if (query) {
          router.push(`?q=${encodeURIComponent(query)}`, { scroll: false })
        } else {
          router.push(`?`, { scroll: false })
        }
      }

      if (query && query.length >= 2) {
        setIsSearching(true)
        const results = await searchScholarsQuery(query)
        setSuggestions(results)
        setShowSuggestions(true)
        setIsSearching(false)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (query) {
      router.push(`?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.push(`?`, { scroll: false })
    }
  }

  const handleSuggestionClick = (username: string) => {
    setShowSuggestions(false)
    router.push(`/scholars/${username}`)
  }

  return (
    <div ref={wrapperRef} className="max-w-md mx-auto relative z-50">
      <form onSubmit={handleSubmit} className="relative">
        <input 
          type="text" 
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query && query.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder="Search by username or name..." 
          className="w-full pl-12 pr-12 py-3 rounded-full border border-rule shadow-sm focus:outline-none focus:ring-2 focus:ring-violet"
          autoComplete="off"
        />
        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <button type="submit" className="absolute right-2 top-2 p-1.5 bg-violet text-white rounded-full hover:bg-indigo-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-rule overflow-hidden">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {suggestions.map((scholar) => (
                <li key={scholar.id}>
                  <button
                    type="button"
                    onClick={() => handleSuggestionClick(scholar.username)}
                    className="w-full text-left px-4 py-3 hover:bg-surface flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                      {scholar.avatar ? (
                        <Image src={scholar.avatar} alt={scholar.name} width={32} height={32} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-primary text-xs font-bold">{scholar.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink">{scholar.name}</span>
                      {scholar.username !== scholar.id && (
                        <span className="text-xs text-gray-500">@{scholar.username}</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No scholars found</div>
          )}
        </div>
      )}
    </div>
  )
}
