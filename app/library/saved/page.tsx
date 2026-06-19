'use client'

import { useState, useEffect } from "react"
import Footer from "@/components/footer"
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
            <Link href="/search" className="inline-flex items-center px-8 py-4 text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5">
              <Search className="w-5 h-5 mr-2" /> Explore Research
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedPapers.map((paper) => (
              <div key={paper.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex justify-between items-start mb-3 gap-4">
                  <div>
                    {paper.type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 mb-3">
                        {paper.type}
                      </span>
                    )}
                    <Link href={paper.url}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                        {paper.title}
                      </h3>
                    </Link>
                  </div>
                  <SaveButton publication={paper} variant="icon" />
                </div>
                
                {paper.author && (
                  <p className="text-sm text-gray-600 font-medium mb-6">
                    By <span className="text-gray-900">{paper.author}</span>
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <Link 
                    href={paper.url}
                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    <BookOpen className="w-4 h-4 mr-1.5" /> Read Online
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
