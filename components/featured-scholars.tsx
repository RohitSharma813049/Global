'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Scholar {
  id: number
  name: string
  domain: string
  publications: number
  image: string
}

const scholars: Scholar[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    domain: 'Neuroscience',
    publications: 156,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    domain: 'Environmental Science',
    publications: 234,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Dr. Emily Roberts',
    domain: 'Quantum Physics',
    publications: 189,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Prof. James Wilson',
    domain: 'Artificial Intelligence',
    publications: 267,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Dr. Lisa Anderson',
    domain: 'Medical Research',
    publications: 198,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Prof. David Kumar',
    domain: 'Computer Science',
    publications: 312,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  },
]

export default function FeaturedScholars() {
  const [startIdx, setStartIdx] = useState(0)

  const itemsPerView = 4
  const visibleScholars = scholars.slice(startIdx, startIdx + itemsPerView)

  const previous = () => {
    setStartIdx((prev) => {
      const newIdx = prev - 1
      return newIdx < 0 ? scholars.length - itemsPerView : newIdx
    })
  }

  const next = () => {
    setStartIdx((prev) => {
      const newIdx = prev + 1
      return newIdx > scholars.length - itemsPerView ? 0 : newIdx
    })
  }

  return (
    <section className="bg-white px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-center sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
              Top Contributors
            </p>
            <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Featured Scholars
            </h2>
          </div>
          <div className="mt-6 flex gap-3 sm:mt-0">
            <Button
              onClick={previous}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleScholars.map((scholar) => (
            <div
              key={scholar.id}
              className="group relative rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative mb-6 flex justify-center">
                <div className="relative h-28 w-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-emerald-400">
                  <div className="h-full w-full rounded-full border-4 border-white bg-white overflow-hidden">
                    <Image
                      src={scholar.image}
                      alt={scholar.name}
                      width={120}
                      height={120}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
              <h3 className="relative z-10 text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{scholar.name}</h3>
              <p className="relative z-10 mt-2 text-xs font-bold uppercase tracking-widest text-indigo-500">{scholar.domain}</p>
              
              <div className="relative z-10 mt-6 inline-flex items-center rounded-full bg-gray-50 px-4 py-1.5 border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700">
                  {scholar.publications} <span className="font-medium text-gray-500">Publications</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
