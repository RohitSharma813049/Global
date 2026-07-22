'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { BookOpen } from 'lucide-react'

// Dummy data for the slider
const sliderItems = [
  {
    id: '1',
    title: 'GSP Academic Magazine - Spring 2026',
    image: '/placeholder.svg',
    type: 'Magazine',
    link: '/explore'
  },
  {
    id: '2',
    title: 'Research Methodologies E-Book',
    image: '/placeholder.svg',
    type: 'E-Book',
    link: '/explore'
  },
  {
    id: '3',
    title: 'Global Scholar Quarterly',
    image: '/placeholder.svg',
    type: 'Magazine',
    link: '/explore'
  }
]

export default function SidebarSlider() {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(47,17,93,0.06)] border border-[#E2DFF0] p-8 sticky top-24 relative overflow-hidden group/sidebar">
      {/* Decorative gradient orb */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B8924A] rounded-full blur-[80px] opacity-[0.15] pointer-events-none transition-opacity duration-700 group-hover/sidebar:opacity-30" />
      
      <div className="flex flex-col mb-8 relative z-10">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#2F115D] mb-3 flex items-center gap-2">
          <span className="w-6 h-[1.5px] bg-[#2F115D]"></span> Essential
        </p>
        <h3 className="text-3xl font-bold text-[#000] leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Featured <br/><em className="font-light text-[#2F115D] italic">Publications</em>
        </h3>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full relative z-10"
      >
        <CarouselContent>
          {sliderItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="flex flex-col group block">
                <Link href={item.link} className="relative aspect-[3/4] w-full rounded-[18px] overflow-hidden mb-5 shadow-md block">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0618]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#2F115D] shadow-sm transform transition-transform duration-300">
                    {item.type}
                  </div>
                </Link>
                <Link href={item.link} className="inline-block">
                  <h4 className="font-bold text-[#000] text-[15px] leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#2F115D]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.title}
                  </h4>
                </Link>
                <div className="mt-4">
                  <Link href={item.link} className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-[0.02em] text-[#2F115D] group-hover:underline">
                    Read Issue
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E2DFF0]">
          <div className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">Swipe</div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white hover:bg-[#2F115D] hover:text-white hover:border-[#2F115D] text-[#2F115D] border-[#E2DFF0] transition-all duration-300 h-9 w-9 rounded-full shadow-sm" />
            <CarouselNext className="static translate-y-0 translate-x-0 bg-white hover:bg-[#2F115D] hover:text-white hover:border-[#2F115D] text-[#2F115D] border-[#E2DFF0] transition-all duration-300 h-9 w-9 rounded-full shadow-sm" />
          </div>
        </div>
      </Carousel>
    </div>
  )
}
