'use client'

import { memo } from 'react'
import { Bookmark, Eye, Download, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export interface ContentItem {
  id: number | string
  title: string
  author: string
  type: 'thesis' | 'article' | 'ebook' | 'magazine' | 'blog' | string
  category: string
  description: string
  views: number
  downloads: number
  publishedYear: number
  subject: string
  imageUrl?: string // Added support for an image
}

interface ContentCardProps {
  item: ContentItem
  viewMode: 'grid' | 'list'
  isBookmarked: boolean
  onBookmarkToggle: () => void
}

const typeConfig: Record<string, { label: string }> = {
  thesis: { label: 'THESIS' },
  article: { label: 'ARTICLE' },
  ebook: { label: 'EBOOK' },
  magazine: { label: 'MAGAZINE' },
  blog: { label: 'BLOG' },
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
}

const ContentCard = memo(function ContentCard({
  item,
  viewMode,
  isBookmarked,
  onBookmarkToggle,
}: ContentCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const typeInfo = typeConfig[item.type] || { label: item.type.toUpperCase() }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if clicking the whole card
    if (!session) {
      router.push(`/signin?callbackUrl=/explore`)
      return
    }
    onBookmarkToggle()
  }

  // Generate a very subtle placeholder gradient based on ID if no image is present
  const placeholderGradient = `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`

  if (viewMode === 'list') {
    return (
      <Link href={`/publications/${item.id}`} className="group flex flex-col sm:flex-row gap-6 bg-white border border-gray-100 rounded-[2rem] p-4 transition-all duration-300 hover:shadow-xl hover:border-gray-200">
        {/* List View Image */}
        <div className="relative h-48 sm:h-auto sm:w-64 rounded-[1.5rem] overflow-hidden shrink-0">
           {item.imageUrl ? (
             <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           ) : (
             <div className="w-full h-full transition-transform duration-700 group-hover:scale-105" style={{ background: placeholderGradient }} />
           )}
           <div className="absolute top-4 left-4">
             <span className="bg-black text-white text-2.5 font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
               <Star className="w-3 h-3 fill-white" /> {typeInfo.label}
             </span>
           </div>
        </div>

        {/* List View Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-4 sm:pr-8 py-2">
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 leading-tight mb-3 line-clamp-2 tracking-tight group-hover:text-indigo-800 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm font-semibold text-slate-500 leading-relaxed line-clamp-2 mb-4 text-justify">
            {item.author} — {stripHtml(item.description)}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 tracking-wider uppercase">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {formatNumber(item.views)}</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> {formatNumber(item.downloads)}</span>
            </div>
            <Button
              onClick={handleBookmarkClick}
              variant="ghost"
              size="icon"
              className={`rounded-full h-10 w-10 transition-colors ${isBookmarked ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'}`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  // Grid view (Matches the jls.limo screenshot perfectly)
  return (
    <Link href={`/publications/${item.id}`} className="group flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-gray-200 h-full">
      {/* Top Image Section */}
      <div className="relative h-56 w-full bg-gray-50 overflow-hidden shrink-0">
        {item.imageUrl ? (
           <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
           <div className="w-full h-full transition-transform duration-700 group-hover:scale-105" style={{ background: placeholderGradient }} />
        )}
        
        {/* Featured Pill */}
        <div className="absolute top-4 left-4">
          <span className="bg-black text-white text-2.5 font-extrabold tracking-widest uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <Star className="w-3 h-3 fill-white" /> {typeInfo.label}
          </span>
        </div>

        {/* Bookmark Button Floating */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={handleBookmarkClick}
            variant="ghost"
            size="icon"
            className={`rounded-full h-9 w-9 backdrop-blur-md transition-all shadow-sm ${isBookmarked ? 'bg-black text-white hover:bg-gray-800' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-black'}`}
            title={session ? "Save to Library" : "Login to Save"}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="p-6 sm:p-8 flex flex-col flex-1">
        <h3 className="font-black text-indigo-600 text-2xl leading-tight mb-3 line-clamp-2 tracking-tight group-hover:text-indigo-800 transition-colors">
          {item.title}
        </h3>
        <p className="text-3.75 font-semibold text-slate-500 leading-relaxed line-clamp-2 text-justify">
          {item.author} — {stripHtml(item.description)}
        </p>
        
        {/* Subtle bottom stats */}
        <div className="mt-auto pt-6 flex items-center gap-4 text-xs font-bold text-slate-400 tracking-wider uppercase">
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {formatNumber(item.views)}</span>
          <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> {formatNumber(item.downloads)}</span>
        </div>
      </div>
    </Link>
  )
})

export default ContentCard
