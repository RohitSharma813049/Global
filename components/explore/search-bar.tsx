'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const suggestions = [
  'Machine Learning',
  'Quantum Computing',
  'Renewable Energy',
  'Blockchain',
  'Artificial Intelligence',
  'Healthcare Management',
  'Supply Chain',
  'Digital Marketing',
  'Climate Change',
  'Data Science',
  'Genetic Disorders',
  'Human Rights Law',
]

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return suggestions
    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <section className="border-b border-border bg-white px-4 sm:px-6 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-foreground">Explore Research</h2>

        <div className="relative" ref={containerRef}>
          <div className="relative flex items-center gap-2">
            <Search className="absolute left-4 h-5 w-5 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search research, authors, topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              className="border-primary/30 bg-background pl-12 py-6 text-base placeholder:text-foreground/50 focus:border-primary focus:ring-primary"
            />
            {searchQuery && (
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setIsOpen(false)
                }}
                variant="ghost"
                size="icon"
                className="absolute right-2"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Real-time Suggestions Dropdown */}
          {isOpen && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-border bg-white shadow-lg">
              {filteredSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(suggestion)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-primary/5 border-b border-border/50 last:border-b-0 transition"
                >
                  <Search className="inline-block h-4 w-4 mr-2 text-foreground/40" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs sm:text-sm text-foreground/50">
          Search across 50,000+ publications including thesis, articles, eBooks, and more
        </p>
      </div>
    </section>
  )
}
