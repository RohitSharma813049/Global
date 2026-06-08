'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContentItem {
  id: number
  type: 'thesis' | 'article' | 'ebook' | 'blog'
  title: string
  author: string
  description: string
  image: string
}

const featuredContent: ContentItem[] = [
  {
    id: 1,
    type: 'thesis',
    title: 'Advanced Neural Networks in Healthcare',
    author: 'Dr. Sarah Johnson',
    description: 'Exploring deep learning applications in medical diagnosis and treatment planning.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    type: 'article',
    title: 'Climate Change and Sustainable Development',
    author: 'Prof. Michael Chen',
    description: 'An comprehensive analysis of climate patterns and sustainable solutions for 2024.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    type: 'ebook',
    title: 'The Future of Quantum Computing',
    author: 'Dr. Emily Roberts',
    description: 'A detailed exploration of quantum mechanics and its computational implications.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    type: 'blog',
    title: 'Breaking Barriers in Education Technology',
    author: 'James Wilson',
    description: 'How AI is transforming the landscape of modern education and learning.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  },
]

export default function FeaturedContent() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1))
  }

  const next = () => {
    setCurrentIndex((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1))
  }

  const current = featuredContent[currentIndex]

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Featured Content
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Discover Trending Research
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg bg-white">
            <Image
              src={current.image}
              alt={current.title}
              width={500}
              height={400}
              className="h-80 w-full object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground capitalize">
                {current.type}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold text-foreground">{current.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">By {current.author}</p>
              <p className="mt-6 text-lg leading-relaxed text-foreground/70">
                {current.description}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Button
                onClick={previous}
                variant="outline"
                size="icon"
                className="border-primary/30 hover:bg-primary/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {featuredContent.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 w-2 rounded-full transition ${
                      idx === currentIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
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
        </div>
      </div>
    </section>
  )
}
