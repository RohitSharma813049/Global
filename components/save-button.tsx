'use client'

import { useState, useEffect } from 'react'
import { BookMarked, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SavedPublication {
  id: string
  title: string
  type?: string
  author?: string
  url: string
}

interface Props {
  publication: SavedPublication
  variant?: 'icon' | 'full'
  className?: string
}

export default function SaveButton({ publication, variant = 'full', className }: Props) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('saved_publications')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setIsSaved(parsed.some((p: any) => p.id === publication.id))
      } catch (e) {
        // ignore
      }
    }
  }, [publication.id])

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const saved = localStorage.getItem('saved_publications')
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

    localStorage.setItem('saved_publications', JSON.stringify(parsed))
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
