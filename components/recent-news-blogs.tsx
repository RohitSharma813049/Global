'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

interface ContentItem {
  id: string
  title: string
  slug: string
  cover_image: string | null
  created_at: Date | null
  type: 'blog' | 'news'
}

export default function RecentNewsBlogs({ items, autoplay = true }: { items: ContentItem[], autoplay?: boolean }) {
  if (!items || items.length === 0) return null

  return (
    <section className="px-6 py-8 sm:py-12 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={
            autoplay
              ? [
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                  }),
                ]
              : []
          }
          className="w-full"
        >
          <div className="mb-10 flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
                Latest Updates
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold text-gray-900 sm:text-4xl">
                Blogs & News
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex gap-2 relative">
                <CarouselPrevious className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-600 transition-colors h-10 w-10" />
                <CarouselNext className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-600 transition-colors h-10 w-10" />
              </div>
              <Link href="/updates" className="text-indigo-600 font-semibold hover:underline">
                View All Updates &rarr;
              </Link>
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem key={`${item.type}-${item.id}`} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Link 
                  href={`/${item.type}/${item.slug}`} 
                  className="group relative flex h-full rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden flex-col"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden shrink-0">
                    {item.cover_image ? (
                      <Image src={item.cover_image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-500 font-bold text-4xl">{item.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase text-gray-700 shadow-sm">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-between items-center sm:hidden">
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 h-10 w-10" />
              <CarouselNext className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 h-10 w-10" />
            </div>
            <Link href="/updates" className="text-indigo-600 font-semibold hover:underline text-sm">
              View All &rarr;
            </Link>
          </div>
        </Carousel>
      </div>
    </section>
  )
}
