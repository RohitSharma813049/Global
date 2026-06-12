'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterSidebarProps {
  filters: {
    subjects: string[]
    subcategories: string[]
    authors: string[]
    types: string[]
    yearRange: [number, number]
  }
  setFilters: (filters: any) => void
  availableSubjects: string[]
  availableSubcategories: string[]
  availableAuthors: string[]
  availableTypes: { value: string, label: string }[]
}

export default function FilterSidebar({ filters, setFilters, availableSubjects, availableSubcategories, availableAuthors, availableTypes }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    subject: true,
    subcategory: true,
    author: true,
    type: true,
    year: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  const handleSubjectChange = (subject: string) => {
    setFilters({
      ...filters,
      subjects: filters.subjects.includes(subject)
        ? filters.subjects.filter((s) => s !== subject)
        : [...filters.subjects, subject],
    })
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setFilters({
      ...filters,
      subcategories: filters.subcategories.includes(subcategory)
        ? filters.subcategories.filter((s) => s !== subcategory)
        : [...filters.subcategories, subcategory],
    })
  }

  const handleAuthorChange = (author: string) => {
    setFilters({
      ...filters,
      authors: filters.authors.includes(author)
        ? filters.authors.filter((a) => a !== author)
        : [...filters.authors, author],
    })
  }

  const handleTypeChange = (type: string) => {
    setFilters({
      ...filters,
      types: filters.types.includes(type)
        ? filters.types.filter((t) => t !== type)
        : [...filters.types, type],
    })
  }

  const handleYearChange = (value: string, isStart: boolean) => {
    const numValue = parseInt(value)
    if (isStart) {
      setFilters({
        ...filters,
        yearRange: [numValue, filters.yearRange[1]],
      })
    } else {
      setFilters({
        ...filters,
        yearRange: [filters.yearRange[0], numValue],
      })
    }
  }

  const resetFilters = () => {
    setFilters({
      subjects: [],
      subcategories: [],
      authors: [],
      types: [],
      yearRange: [2000, new Date().getFullYear()],
    })
  }

  return (
    <div className="bg-background p-4 sm:p-6 border-r border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-xs text-primary hover:text-primary/80 underline"
        >
          Reset
        </button>
      </div>

      {/* Subject Filter */}
      <div className="mb-6 border-b border-border pb-6">
        <button
          onClick={() => toggleSection('subject')}
          className="flex w-full items-center justify-between font-semibold text-foreground"
        >
          Category
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.subject ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.subject && (
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
            {availableSubjects.map((subject) => (
              <label key={subject} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.subjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground/70">{subject}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Subcategory Filter */}
      {availableSubcategories.length > 0 && (
        <div className="mb-6 border-b border-border pb-6">
          <button
            onClick={() => toggleSection('subcategory')}
            className="flex w-full items-center justify-between font-semibold text-foreground"
          >
            Subcategory
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expandedSections.subcategory ? 'rotate-180' : ''}`}
            />
          </button>
          {expandedSections.subcategory && (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
              {availableSubcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.subcategories.includes(sub)}
                    onChange={() => handleSubcategoryChange(sub)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground/70">{sub}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Author Filter */}
      <div className="mb-6 border-b border-border pb-6">
        <button
          onClick={() => toggleSection('author')}
          className="flex w-full items-center justify-between font-semibold text-foreground"
        >
          Scholars
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.author ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.author && (
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
            {availableAuthors.map((author) => (
              <label key={author} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.authors.includes(author)}
                  onChange={() => handleAuthorChange(author)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground/70">{author}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Publication Type Filter */}
      <div className="mb-6 border-b border-border pb-6">
        <button
          onClick={() => toggleSection('type')}
          className="flex w-full items-center justify-between font-semibold text-foreground"
        >
          Publication Type
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.type ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.type && (
          <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
            {availableTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type.value)}
                  onChange={() => handleTypeChange(type.value)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground/70">{type.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Year Range Filter */}
      <div>
        <button
          onClick={() => toggleSection('year')}
          className="flex w-full items-center justify-between font-semibold text-foreground"
        >
          Publication Year
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedSections.year ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.year && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/70">From</label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={filters.yearRange[0]}
                onChange={(e) => handleYearChange(e.target.value, true)}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/70">To</label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={filters.yearRange[1]}
                onChange={(e) => handleYearChange(e.target.value, false)}
                className="mt-2 w-full rounded border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
