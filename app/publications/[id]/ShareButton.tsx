'use client'

import React, { useState, useEffect } from 'react'

export default function ShareButton({ title, text, publicationId }: { title: string, text: string, publicationId: string }) {
  const [showToast, setShowToast] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.origin}/publications/${publicationId}`)
  }, [publicationId])

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (err) {
      console.log('Error sharing:', err)
    }
  }

  return (
    <div className="relative share-wrap">
      <button className="abtn" onClick={handleShare}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 3.8L4.5 6.2M9.5 10.2L4.5 7.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        <span>Share</span>
      </button>

      {showToast && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-50">
          Link copied to clipboard!
        </div>
      )}
    </div>
  )
}
