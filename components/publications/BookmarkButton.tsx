'use client'

import React, { useState, useTransition } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toggleSavedPublication } from '@/app/actions/library'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  publicationId: string
  initialSaved: boolean
  className?: string
}

export default function BookmarkButton({ publicationId, initialSaved, className = '' }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    // Optimistic update
    setIsSaved(!isSaved)
    
    startTransition(async () => {
      const res = await toggleSavedPublication(publicationId)
      if (res?.error) {
        // Revert on error
        setIsSaved(isSaved)
        toast.error(res.error)
      } else if (res) {
        setIsSaved(!!res.saved)
        toast.success(res.saved ? 'Saved to Library' : 'Removed from Library')
        router.refresh()
      }
    })
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggle()
      }}
      disabled={isPending}
      className={`p-2 rounded-full transition-colors flex items-center justify-center ${
        isSaved 
          ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
          : 'bg-gray-50 text-gray-500 hover:bg-gray-200'
      } ${className}`}
      aria-label={isSaved ? "Remove from Library" : "Save to Library"}
      title={isSaved ? "Remove from Library" : "Save to Library"}
    >
      {isSaved ? (
        <BookmarkCheck className="w-5 h-5 fill-current" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </button>
  )
}
