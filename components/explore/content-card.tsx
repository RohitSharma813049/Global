'use client'

import { Bookmark, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContentItem {
  id: number
  title: string
  author: string
  type: 'thesis' | 'article' | 'ebook' | 'magazine' | 'blog'
  category: string
  description: string
  views: number
  downloads: number
  publishedYear: number
  subject: string
}

interface ContentCardProps {
  item: ContentItem
  viewMode: 'grid' | 'list'
  isBookmarked: boolean
  onBookmarkToggle: () => void
}

const typeConfig = {
  thesis: { label: 'Thesis', color: 'bg-blue-100 text-blue-800' },
  article: { label: 'Article', color: 'bg-green-100 text-green-800' },
  ebook: { label: 'eBook', color: 'bg-purple-100 text-purple-800' },
  magazine: { label: 'Magazine', color: 'bg-orange-100 text-orange-800' },
  blog: { label: 'Blog', color: 'bg-pink-100 text-pink-800' },
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default function ContentCard({
  item,
  viewMode,
  isBookmarked,
  onBookmarkToggle,
}: ContentCardProps) {
  const typeInfo = typeConfig[item.type]

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-4 sm:p-6 transition hover:border-primary hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className="text-xs text-foreground/60">{item.publishedYear}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 break-words">{item.title}</h3>
            <p className="mt-1 text-sm text-foreground/70">{item.author}</p>
            <p className="mt-3 text-sm text-foreground/60 line-clamp-2">{item.description}</p>
          </div>

          <Button
            onClick={onBookmarkToggle}
            variant="ghost"
            size="icon"
            className={`flex-shrink-0 ${isBookmarked ? 'text-primary' : 'text-foreground/40'}`}
          >
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50 text-xs sm:text-sm text-foreground/60">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {formatNumber(item.views)} views
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {formatNumber(item.downloads)} downloads
          </div>
          <Button className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm py-1 sm:py-2 px-3 sm:px-4">
            Read/Download
          </Button>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="flex flex-col rounded-lg border border-border bg-white overflow-hidden transition hover:border-primary hover:shadow-md h-full">
      {/* Header with badge and year */}
      <div className="p-4 sm:p-5 border-b border-border/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold flex-shrink-0 ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <Button
            onClick={onBookmarkToggle}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 flex-shrink-0 ${isBookmarked ? 'text-primary' : 'text-foreground/40'}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3">
        <div>
          <h3 className="font-bold text-foreground text-sm line-clamp-3 break-words">{item.title}</h3>
          <p className="mt-1 text-xs text-foreground/70 truncate">{item.author}</p>
        </div>

        <p className="text-xs text-foreground/60 line-clamp-2 flex-1">{item.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-foreground/60 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(item.views)}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {formatNumber(item.downloads)}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="p-4 sm:p-5 border-t border-border/50">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm py-2">
          Read/Download
        </Button>
      </div>
    </div>
  )
}
