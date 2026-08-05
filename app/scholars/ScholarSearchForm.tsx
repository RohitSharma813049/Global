'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ScholarSearchForm({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get('q') || ''
      if (query !== currentQuery) {
        if (query) {
          router.push(`?q=${encodeURIComponent(query)}`, { scroll: false })
        } else {
          router.push(`?`, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`?q=${encodeURIComponent(query)}`, { scroll: false })
    } else {
      router.push(`?`, { scroll: false })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
      <input 
        type="text" 
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by username or name..." 
        className="w-full pl-12 pr-12 py-3 rounded-full border border-rule shadow-sm focus:outline-none focus:ring-2 focus:ring-violet"
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
  )
}
