'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import ScholarCard from '@/components/scholars/scholar-card'

interface Scholar {
  id: number
  name: string
  domain: string
  publications: number
  image: string
}

interface FeaturedScholarsProps {
  title?: string;
  subtitle?: string;
  scholars?: any[];
  autoplay?: boolean;
}

export default function FeaturedScholars({ title, subtitle, scholars = [], autoplay = true }: FeaturedScholarsProps) {
  return (
    <section className="bg-white px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
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
          <div className="mb-14 flex flex-col items-center sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
                {subtitle || 'Top Contributors'}
              </p>
              <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
                {title || 'Featured Scholars'}
              </h2>
            </div>
            <div className="mt-6 flex gap-3 sm:mt-0 relative">
              <CarouselPrevious className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all h-12 w-12" />
              <CarouselNext className="static translate-x-0 translate-y-0 bg-transparent text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all h-12 w-12" />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {scholars.map((scholar) => {
              const name = scholar.users?.raw_user_meta_data?.name || scholar.users?.email || 'Unknown'
              const domain = scholar.specialization || 'Scholar'
              const publicationsCount = scholar._count?.publications || 0
              const image = scholar.users?.raw_user_meta_data?.avatar_url || scholar.users?.raw_user_meta_data?.picture || scholar.users?.raw_user_meta_data?.image || '/placeholder-user.png'
              
              const scholarData = {
                id: scholar.id,
                name,
                field: domain,
                publications: publicationsCount,
                image,
              }

              return (
                <CarouselItem key={scholar.id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
                  <ScholarCard scholar={scholarData} variant="compact" />
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
