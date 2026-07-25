'use client'

import { useState, useEffect } from 'react'
import { BookMarked, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

interface SavedPublication {
  id: string
  title: string
  type?: string
  author?: string
  url: string
  cover_image?: string
  abstract?: string
  author_avatar?: string
  subject?: string
}

interface Props {
  publication: SavedPublication
  variant?: 'icon' | 'full' | 'card'
  className?: string
}

export default function SaveButton({ publication, variant = 'full', className }: Props) {
  const [isSaved, setIsSaved] = useState(false)
  const { data: session } = useSession()
  const storageKey = session?.user?.id ? `saved_publications_${session.user.id}` : 'saved_publications'

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setIsSaved(parsed.some((p: any) => p.id === publication.id))
      } catch (e) {
        // ignore
      }
    } else {
      setIsSaved(false)
    }
  }, [publication.id, storageKey])

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const saved = localStorage.getItem(storageKey)
    let parsed: SavedPublication[] = []
    if (saved) {
      try {
        parsed = JSON.parse(saved)
      } catch (e) {}
    }

    if (isSaved) {
      parsed = parsed.filter(p => p.id !== publication.id)
      setIsSaved(false)
    } else {
      parsed.push(publication)
      setIsSaved(true)
    }

    localStorage.setItem(storageKey, JSON.stringify(parsed))
    window.dispatchEvent(new Event('storage')) // Trigger re-render in other components if needed
  }

  if (variant === 'icon') {
    return (
      <button 
        onClick={toggleSave}
        className={`transition-colors ${isSaved ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'} ${className}`} 
        title={isSaved ? "Remove from Library" : "Save to Library"}
      >
        {isSaved ? <Check className="w-5 h-5" /> : <BookMarked className="w-5 h-5" />}
      </button>
    )
  }

  if (variant === 'card') {
    return (
      <button 
        onClick={toggleSave}
        className={`pc-bookmark ${isSaved ? 'saved' : ''} ${className || ''}`} 
        aria-label="Save publication"
        title={isSaved ? "Remove from Library" : "Save to Library"}
      >
        {isSaved ? (
          <Check className="w-4 h-4" />
        ) : (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12.6667 14L8 10.6667L3.33333 14V3.33333C3.33333 2.97971 3.47381 2.64057 3.72386 2.39052C3.97391 2.14048 4.31304 2 4.66667 2H11.3333C11.687 2 12.0261 2.14048 12.2761 2.39052C12.5262 2.64057 12.6667 2.97971 12.6667 3.33333V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    )
  }

  return (
    <Button 
      variant="outline" 
      onClick={toggleSave}
      className={className || "w-full rounded-none border-zinc-200 text-zinc-900 hover:bg-zinc-50 h-14 text-sm font-bold tracking-wider uppercase transition-colors"}
    >
      {isSaved ? (
        <><Check className="w-4 h-4 mr-2 text-indigo-600" /> Saved</>
      ) : (
        <><BookMarked className="w-4 h-4 mr-2" /> Save to Library</>
      )}
    </Button>
  )
}
