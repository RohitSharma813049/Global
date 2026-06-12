'use client'

import { Grid3x3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SortControlsProps {
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  resultCount: number
}

export default function SortControls({
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  resultCount,
}: SortControlsProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-foreground/60">
          Showing <span className="font-semibold text-foreground">{resultCount}</span> results
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-foreground hidden sm:block">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-primary"
          >
            <option value="latest">Latest</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="relevance">Relevance</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 border-l border-border pl-3">
          <Button
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
            title="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
