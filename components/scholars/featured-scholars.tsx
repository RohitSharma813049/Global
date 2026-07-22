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
              const image = scholar.users?.raw_user_meta_data?.avatar_url || '/placeholder-user.jpg'
              
              return (
              <CarouselItem key={scholar.id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
                <Link
                  href={`/scholars/${scholar.id}`}
                  className="block group h-full relative rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative h-28 w-28 rounded-full p-1 bg-indigo-500">
                      <div className="h-full w-full rounded-full border-4 border-white bg-white overflow-hidden">
                        <Image
                          src={image}
                          alt={name}
                          width={120}
                          height={120}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{name}</h3>
                  <p className="relative z-10 mt-2 text-xs font-bold uppercase tracking-widest text-indigo-500">{domain}</p>
                  
                  <div className="relative z-10 mt-6 inline-flex items-center rounded-full bg-gray-50 px-4 py-1.5 border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700">
                      {publicationsCount} <span className="font-medium text-gray-500">Publications</span>
                    </span>
                  </div>
                </Link>
              </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
