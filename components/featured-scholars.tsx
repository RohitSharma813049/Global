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
    <section className="border-y border-border bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">
              Top Contributors
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
              Featured Scholars
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button
              onClick={previous}
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="border-primary/30 hover:bg-primary/5"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleScholars.map((scholar) => (
            <div
              key={scholar.id}
              className="group rounded-lg border border-border bg-background p-6 text-center transition hover:border-primary hover:bg-primary/5"
            >
              <div className="relative mb-4 flex justify-center">
                <Image
                  src={scholar.image}
                  alt={scholar.name}
                  width={120}
                  height={120}
                  className="h-24 w-24 rounded-full object-cover"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-foreground">{scholar.name}</h3>
              <p className="mt-1 text-xs text-primary">{scholar.domain}</p>
              <p className="mt-3 text-sm font-medium text-foreground/60">
                {scholar.publications} publications
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2 sm:hidden">
          <Button
            onClick={previous}
            variant="outline"
            size="icon"
            className="border-primary/30 hover:bg-primary/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={next}
            variant="outline"
            size="icon"
            className="border-primary/30 hover:bg-primary/5"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
