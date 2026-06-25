'use client'

import { useState, useEffect } from 'react'
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

interface FeaturedContentProps {
  title?: string;
  subtitle?: string;
  autoplay?: boolean;
}

export default function FeaturedContent({ title, subtitle, autoplay = true }: FeaturedContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1))
  }

  const next = () => {
    setCurrentIndex((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [autoplay])

  const current = featuredContent[currentIndex]

  return (
    <section className="bg-white px-6 py-10 sm:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Responsive Header: Stack vertically on small screens, row on medium+ */}
        <div className="mb-10 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-0">
          <div>
            <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
              {subtitle || 'Featured Content'}
            </p>
            <h2 className="mt-3 text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {title || 'Explore Trending Research'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 self-start md:self-auto">
            <Button
              onClick={previous}
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="flex gap-1.5 sm:gap-3 px-1 sm:px-2">
              {featuredContent.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 sm:w-8 bg-indigo-600' : 'w-2 sm:w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <Button
              onClick={next}
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:gap-12 lg:grid-cols-2 items-center">
          {/* Image Container */}
          <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 shadow-xl transition-all duration-700 cursor-pointer">
            <Image
              src={current.image}
              alt={current.title}
              width={600}
              height={500}
              className="h-64 sm:h-80 md:h-96 w-full object-cover transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gray-900/40"></div>
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
              <span className="inline-block rounded-full bg-emerald-500/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {current.type}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full py-2 sm:py-4">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-1 w-8 sm:w-10 bg-indigo-600 rounded-full"></div>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-widest">Highlight</p>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight transition-colors cursor-pointer">
                {current.title}
              </h3>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wide">
                By <span className="text-gray-900">{current.author}</span>
              </p>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-gray-600">
                {current.description}
              </p>
              
              <div className="mt-8 sm:mt-10">
                <Button className="h-10 sm:h-12 px-6 sm:px-8 w-full sm:w-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300">
                  Read Full Publication
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
