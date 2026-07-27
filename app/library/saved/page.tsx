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

import { useSession } from "next-auth/react"

export default function SavedPapersPage() {
  const [savedPapers, setSavedPapers] = useState<SavedPublication[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const { data: session } = useSession()

  const filteredPapers = savedPapers.filter(paper => {
    const matchesSearch = paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          paper.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || (paper.type || 'PUBLICATION').toUpperCase().includes(typeFilter);
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    const storageKey = session?.user?.id ? `saved_publications_${session.user.id}` : 'saved_publications'
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setSavedPapers(JSON.parse(saved))
      } catch (e) {
        // ignore
      }
    } else {
      setSavedPapers([])
    }
    setIsLoaded(true)

    // Listen for storage changes in case they are updated in another tab
    const handleStorage = () => {
      const updated = localStorage.getItem(storageKey)
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
  }, [session?.user?.id])

  return (
    <div className="min-h-screen bg-(--color-gsp-surface-raised) flex flex-col">
      <BackButton />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-violet-soft rounded-full flex items-center justify-center mx-auto mb-6 shadow-(--shadow-1)">
            <BookMarked className="w-10 h-10 text-(--color-gsp-text-inverse)" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-gsp-text-primary) mb-4">Saved Library</h1>
          <p className="text-lg text-(--color-gsp-text-secondary) max-w-2xl mx-auto">
            Your personal collection of saved research papers, articles, and thesis.
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : savedPapers.length === 0 ? (
          <div className="bg-(--color-gsp-surface-muted) rounded-3xl shadow-(--shadow-1) border border-(--color-gsp-border-muted) p-12 md:p-20 text-center">
            <h3 className="text-2xl font-bold text-(--color-gsp-text-primary) mb-3">No saved papers yet</h3>
            <p className="text-(--color-gsp-text-secondary) mb-8 max-w-md mx-auto">
              When you find an interesting paper while exploring, click the "Save to Library" button to bookmark it here for later reading.
            </p>
            <Link href="/explore" className="inline-flex items-center px-8 py-4 text-base font-bold rounded-(--radius-xl) text-white bg-(--color-gsp-text-inverse) hover:bg-indigo-700 transition-all shadow-(--shadow-2) hover:-translate-y-0.5">
              <Search className="w-5 h-5 mr-2" /> Explore Research
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-gsp-text-secondary) w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search saved papers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-(--color-gsp-surface-raised) border border-(--color-gsp-border-muted) rounded-(--radius-xl) focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {['ALL', 'ARTICLE', 'THESIS', 'EBOOK'].map(type => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-4 py-2 rounded-(--radius-xl) text-sm font-medium whitespace-nowrap transition-all ${typeFilter === type ? 'bg-(--color-gsp-text-inverse) text-white shadow-(--shadow-2)' : 'bg-(--color-gsp-surface-raised) text-(--color-gsp-text-secondary) hover:bg-gray-100'}`}
                  >
                    {type === 'ALL' ? 'All Types' : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {filteredPapers.length === 0 ? (
               <div className="text-center py-12 text-(--color-gsp-text-secondary) bg-(--color-gsp-surface-muted) rounded-3xl border border-(--color-gsp-border-muted)">
                 <p>No saved papers match your search and filters.</p>
               </div>
            ) : (
              <div id="pubGrid" className="grid list-mode">
                {filteredPapers.map((paper) => (
                  <Link href={paper.url} key={paper.id} className="pub-card reveal in-view !opacity-100 !translate-y-0 relative">
                    <div className="pc-img">
                      <span className="pc-type-badge pbadge-type">{paper.type || 'PUBLICATION'}</span>
                      <SaveButton publication={paper} variant="card" />
                      <img 
                        src={paper.cover_image || "/placeholder-user.jpg"} 
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
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
