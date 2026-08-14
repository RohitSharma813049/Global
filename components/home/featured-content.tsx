'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Eye, ArrowRight } from 'lucide-react'

interface ContentItem {
  id?: number | string
  type?: 'thesis' | 'article' | 'ebook' | 'magazine' | 'blog' | string
  title?: string
  author?: string
  authorImg?: string
  subject?: string
  description?: string
  desc?: string
  image?: string
  img?: string
  views?: string | number
  link?: string
}

const defaultFeaturedContent: ContentItem[] = [
  {
    id: 1,
    type: 'Thesis',
    subject: 'Computer Science · Ethics',
    title: 'Artificial Intelligence Ethics in Cross-Cultural Research Environments',
    author: 'Prof. Li Wei, Ph.D.',
    authorImg: '/placeholder-user.png',
    description: 'A cross-cultural framework examining ethical accountability in AI systems deployed across divergent regulatory and academic research contexts.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=500&fit=crop&auto=format&q=80',
    views: '2.3k reads',
    link: '/publications'
  },
  {
    id: 2,
    type: 'Article',
    subject: 'Social Sciences · Education',
    title: 'Decolonising Knowledge Systems: Toward an African Academic Paradigm',
    author: 'Dr. Ngozi Adeyemi, FAAN',
    authorImg: '/placeholder-user.png',
    description: 'An incisive look at restructuring curricula and research methodology to center indigenous African epistemologies in higher education.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop&auto=format&q=80',
    views: '4.1k reads',
    link: '/publications'
  },
  {
    id: 3,
    type: 'eBook',
    subject: 'Economics · Public Policy',
    title: 'GCC Economic Diversification: Vision 2030 and Beyond',
    author: 'Prof. Khalid Al-Mansouri',
    authorImg: '/placeholder-user.png',
    description: "A comprehensive eBook tracing the GCC's structural shift away from hydrocarbon dependency through Vision 2030's policy levers.",
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop&auto=format&q=80',
    views: '3.7k reads',
    link: '/publications'
  }
]

interface FeaturedContentProps {
  title?: string
  subtitle?: string
  autoplay?: boolean
  publications?: any[]
}

export default function FeaturedContent({
  title,
  subtitle,
  autoplay = true,
  publications = defaultFeaturedContent
}: FeaturedContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const touchDeltaXRef = useRef(0)
  const isDraggingRef = useRef(false)

  const displayItems = publications && publications.length > 0 ? publications : defaultFeaturedContent

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1))
  }

  const next = () => {
    setCurrentIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1))
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    isDraggingRef.current = true
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return
    const dX = e.touches[0].clientX - touchStartXRef.current
    const dY = e.touches[0].clientY - touchStartYRef.current
    if (Math.abs(dX) > Math.abs(dY)) {
      touchDeltaXRef.current = dX
    }
  }

  const onTouchEnd = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    if (touchDeltaXRef.current > 40) {
      previous()
    } else if (touchDeltaXRef.current < -40) {
      next()
    }
    touchDeltaXRef.current = 0
  }

  useEffect(() => {
    if (!autoplay || displayItems.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1))
    }, 5500)

    return () => clearInterval(interval)
  }, [autoplay, displayItems.length])

  const current = displayItems[currentIndex] || displayItems[0]
  if (!current) return null

  const currentImg = current.image || current.img || '/placeholder-user.png'
  const currentTitle = current.title || 'Untitled Publication'
  const currentAuthor = current.author || 'Anonymous Scholar'
  const currentAuthorImg = current.authorImg || '/placeholder-user.png'
  const currentDesc = current.description || current.desc || ''
  const currentType = (current.type || 'Publication').toUpperCase()
  const currentSubject = current.subject || 'Academic Research'
  const currentLink = current.link || `/publications/${current.id || ''}`
  const currentViews = current.views || '1.2k reads'

  return (
    <section className="gsp-section gsp-section-container" id="featured-spotlight">
      <div className="gsp-section-inner">
        {/* Section Header */}
        <div className="gsp-section-head flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="gsp-eyebrow">
              {subtitle || 'Featured Content'}
            </p>
            <h2 
              className="gsp-section-h2 text-2xl sm:text-3xl lg:text-4xl text-[#1E3A8A]" 
              dangerouslySetInnerHTML={{ __html: title || 'Trending <em>Research Spotlight</em>' }} 
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={previous}
              className="w-10 h-10 rounded-full border border-[#E2DFF0] bg-white text-[#2F115D] hover:bg-[#2F115D] hover:text-white hover:border-[#2F115D] flex items-center justify-center transition-all shadow-sm"
              aria-label="Previous spotlight"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="gsp-carousel-dots my-0">
              {displayItems.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`gsp-cdot ${idx === currentIndex ? 'on' : ''}`}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-[#E2DFF0] bg-white text-[#2F115D] hover:bg-[#2F115D] hover:text-white hover:border-[#2F115D] flex items-center justify-center transition-all shadow-sm"
              aria-label="Next spotlight"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Spotlight Card */}
        <div
          className="bg-white border border-[#E2DFF0] rounded-[20px] shadow-[0_12px_36px_rgba(47,17,93,0.06)] overflow-hidden transition-all duration-500 touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Image Section */}
            <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] overflow-hidden bg-[#0A0618]">
              <Image
                src={currentImg}
                alt={currentTitle}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0618]/90 via-[#0A0618]/30 to-transparent"></div>
              
              {/* Type Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#0A0618]/80 backdrop-blur-md border border-white/30 text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-md shadow-md">
                  {currentType}
                </span>
              </div>

              {/* Subject Tag on Mobile */}
              <div className="absolute bottom-4 left-4 right-4 z-10 lg:hidden">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  {currentSubject}
                </p>
              </div>
            </div>

            {/* Right Details Section */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
              <div>
                {/* Eyebrow & Subject */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2F115D]">
                    {currentSubject}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A0A0A] leading-tight mb-4 tracking-tight">
                  <Link href={currentLink} className="hover:text-[#2F115D] transition-colors">
                    {currentTitle}
                  </Link>
                </h3>

                {/* Author Info Row */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#ECEAF4]">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-[#ECEAF4] shrink-0 border border-[#2F115D]/20">
                    <img src={currentAuthorImg} alt={currentAuthor} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Author</p>
                    <p className="text-sm font-semibold text-[#0A0A0A]">{currentAuthor}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Eye className="w-3.5 h-3.5 text-[#2F115D]" />
                    <span>{currentViews}</span>
                  </div>
                </div>

                {/* Description */}
                <div 
                  className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 mb-6 font-normal [&_p]:mb-1"
                  dangerouslySetInnerHTML={{ __html: currentDesc }}
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={currentLink}
                  className="inline-flex items-center gap-2.5 bg-[#2F115D] text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-[#1E0B3E] hover:gap-3.5 transition-all shadow-md"
                >
                  <span>Read Full Publication</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
