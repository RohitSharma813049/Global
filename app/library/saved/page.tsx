'use client'

import { useState, useEffect } from "react"
import Footer from "@/components/layout/footer"
import { BookMarked, Search, BookOpen } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import SaveButton from "@/components/save-button"

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

export default function SavedPapersPage() {
  const [savedPapers, setSavedPapers] = useState<SavedPublication[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('saved_publications')
    if (saved) {
      try {
        setSavedPapers(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    }
    setIsLoaded(true)

    // Listen for storage changes in case they are updated in another tab
    const handleStorage = () => {
      const updated = localStorage.getItem('saved_publications')
      if (updated) {
        try {
          setSavedPapers(JSON.parse(updated))
        } catch(e) {}
      } else {
        setSavedPapers([])
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackButton />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BookMarked className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Saved Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal collection of saved research papers, articles, and thesis.
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : savedPapers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 md:p-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No saved papers yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              When you find an interesting paper while exploring, click the "Save to Library" button to bookmark it here for later reading.
            </p>
            <Link href="/explore" className="inline-flex items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5">
              <Search className="w-5 h-5 mr-2" /> Explore Research
            </Link>
          </div>
        ) : (
          <div id="pubGrid" className="grid list-mode">
            {savedPapers.map((paper) => (
              <Link href={paper.url} key={paper.id} className="pub-card reveal in-view !opacity-100 !translate-y-0 relative">
                <div className="pc-img">
                  <span className="pc-type-badge pbadge-type">{paper.type || 'PUBLICATION'}</span>
                  <SaveButton publication={paper} variant="card" />
                  <img 
                    src={paper.cover_image || "/placeholder.svg"} 
                    alt={paper.title} 
                  />
                </div>
                <div className="pc-body">
                  <div className="pc-meta">
                    <span className="pc-subject">{paper.subject || 'GENERAL'}</span>
                  </div>
                  <h3 className="pc-title">{paper.title}</h3>
                  <div className="pc-author">
                    <div className="pc-avatar">
                      <img 
                        src={paper.author_avatar || "/placeholder-user.jpg"} 
                        alt={paper.author || "Author"} 
                      />
                    </div>
                    <span className="pc-author-name">
                      {paper.author || "Unknown Author"}
                    </span>
                  </div>
                  <div className="pc-desc">
                    <p>{paper.abstract || "No description available."}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
