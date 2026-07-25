'use client'

import React from 'react'
import { trackPublicationDownload } from '@/app/actions/history'

export default function DownloadButton({ publicationId, fileUrl, isVideo }: { publicationId: string, fileUrl: string, isVideo: boolean }) {
  const handleDownload = () => {
    // Fire and forget server action to track download
    trackPublicationDownload(publicationId).catch(console.error)
  }

  return (
    <a 
      href={fileUrl} 
      target="_blank" 
      download 
      onClick={handleDownload}
      className="abtn abtn-primary text-white flex items-center justify-center gap-2"
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v8M4 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span>Download {isVideo ? 'Video' : 'PDF'}</span>
    </a>
  )
}
