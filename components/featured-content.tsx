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

interface FeaturedContentProps {
  title?: string;
  subtitle?: string;
}

export default function FeaturedContent({ title, subtitle }: FeaturedContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredContent.length - 1 : prev - 1))
  }

  const next = () => {
    setCurrentIndex((prev) => (prev === featuredContent.length - 1 ? 0 : prev + 1))
  }

  const current = featuredContent[currentIndex]

  return (
    <section className="bg-white px-6 py-10 sm:py-16 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-16">
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            {subtitle || 'Featured Content'}
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {title || 'Discover Trending Research'}
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Image Container with Hover Animation */}
          <div className="group relative overflow-hidden rounded-3xl bg-gray-100 shadow-xl transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-200 cursor-pointer">
            <Image
              src={current.image}
              alt={current.title}
              width={600}
              height={500}
              className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gray-900/40"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <span className="inline-block rounded-full bg-emerald-500/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                {current.type}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full py-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-10 bg-indigo-600 rounded-full"></div>
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Highlight</p>
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight hover:text-indigo-700 transition-colors cursor-pointer">
                {current.title}
              </h3>
              <p className="mt-4 text-base font-medium text-gray-500 uppercase tracking-wide">
                By <span className="text-gray-900">{current.author}</span>
              </p>
              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                {current.description}
              </p>
              
              <div className="mt-10">
                <Button className="h-12 px-8 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-semibold rounded-xl transition-all duration-300">
                  Read Full Publication
                </Button>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-4">
              <Button
                onClick={previous}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-3">
                {featuredContent.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-indigo-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
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
        </div>
      </div>
    </section>
  )
}
