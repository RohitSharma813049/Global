'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { searchPublications, SearchParams } from '@/app/actions/search'
import Link from 'next/link'
import { BookOpen, Download, Eye, Loader2 } from 'lucide-react'

interface ResultItem {
  id: string
  title: string
  author: string
  type: string
  category: string
  year: string
  abstract: string
  views: number
  downloads: number
}

interface Props {
  initialParams: SearchParams
}

function BookMarkedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}

export default function InfiniteSearchResults({ initialParams }: Props) {
  const [results, setResults] = useState<ResultItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isFetchingNext, setIsFetchingNext] = useState(false)
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px', // start fetching before it actually enters the screen
  })

  // Fetch initial data when params change
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setIsInitialLoading(true)
      try {
        const res = await searchPublications({ ...initialParams, limit: 10 })
        if (isMounted) {
          setResults(res.results)
          setNextCursor(res.nextCursor)
        }
      } catch (err) {
        console.error("Failed to fetch initial results", err)
      } finally {
        if (isMounted) setIsInitialLoading(false)
      }
    }
    fetchInitial()
    return () => { isMounted = false }
  }, [initialParams])

  // Fetch next page when scrolling into view
  useEffect(() => {
    if (inView && nextCursor && !isFetchingNext && !isInitialLoading) {
      const fetchNext = async () => {
        setIsFetchingNext(true)
        try {
          const res = await searchPublications({ ...initialParams, cursor: nextCursor, limit: 10 })
          setResults(prev => [...prev, ...res.results])
          setNextCursor(res.nextCursor)
        } catch (err) {
          console.error("Failed to fetch next results", err)
        } finally {
          setIsFetchingNext(false)
        }
      }
      fetchNext()
    }
  }, [inView, nextCursor, isFetchingNext, isInitialLoading, initialParams])

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-500">Try adjusting your search query or filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {result.type}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {result.category}
                </span>
              </div>
              <Link href={`/publications/${result.id}`}>
                <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors mb-1">
                  {result.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">
                By <span className="font-semibold text-gray-900">{result.author}</span> • {result.year}
              </p>
            </div>
            <button className="text-gray-400 hover:text-indigo-600">
              <BookMarkedIcon className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {result.abstract}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {result.views}</span>
              <span className="flex items-center gap-1.5"><Download className="w-4 h-4" /> {result.downloads}</span>
            </div>
            <Link 
              href={`/publications/${result.id}`}
              className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <BookOpen className="w-4 h-4 mr-1.5" /> Read Online
            </Link>
          </div>
        </div>
      ))}
      
      {/* Intersection Observer target for infinite scroll */}
      {nextCursor && (
        <div ref={ref} className="flex justify-center py-6">
          {isFetchingNext && <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />}
        </div>
      )}
      {!nextCursor && results.length > 0 && (
        <div className="text-center py-6 text-sm text-gray-500">
          You have reached the end of the results.
        </div>
      )}
    </div>
  )
}
