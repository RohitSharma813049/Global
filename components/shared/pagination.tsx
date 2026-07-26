import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)">
      <div className="text-sm text-(--color-gsp-text-secondary)">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex gap-2 items-center">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-md border border-(--color-gsp-border-default) disabled:opacity-50 text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-muted) transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-sm font-medium text-(--color-gsp-text-primary) px-2">
          Page {currentPage} of {totalPages}
        </div>

        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-md border border-(--color-gsp-border-default) disabled:opacity-50 text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-muted) transition-colors"
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
