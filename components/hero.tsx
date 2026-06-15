'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export default function Hero({ title, subtitle, imageUrl }: HeroProps) {
  const displayTitle = title || "Empowering Global\nResearch & Knowledge";
  // Split title if it contains newline or just render as is. We'll render as is, but style it a bit.
  const firstPart = displayTitle.split('\n')[0] || displayTitle;
  const secondPart = displayTitle.split('\n')[1] || "";
  
  const displaySubtitle = subtitle || "The ultimate unified platform for academic publishing and scholar identity. Discover thesis, research papers, eBooks, and build your verified Wikipedia-style profile.";

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 sm:py-32">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={imageUrl} 
            alt="Hero Background" 
            fill 
            className="object-cover object-center" 
            priority
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
        </div>
      )}
      {/* Premium Background Gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white/50 to-transparent"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl mix-blend-multiply"></div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Subtle top badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-800 shadow-sm backdrop-blur-sm transition-all hover:bg-indigo-100">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
            Join the Next Generation of Academic Publishing
          </div>
        </div>

        <h1 className="text-balance text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          {firstPart}
          {secondPart && (
            <span className="mt-2 block text-indigo-600 pb-2">
              {secondPart}
            </span>
          )}
        </h1>
        
        <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-800 font-medium sm:text-xl leading-relaxed">
          {displaySubtitle}
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/category">
            <Button size="lg" className="h-14 px-8 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 rounded-xl font-semibold text-lg group">
              Explore Research
              <BookOpen className="ml-2 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </div>

        {/* PubMed-style Advanced Search Bar (Glassmorphism) */}
        <div className="mt-16 w-full mx-auto max-w-3xl transform transition-all hover:-translate-y-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-2 gap-2">
              <div className="flex items-center w-full px-2 sm:px-0">
                <Search className="ml-2 h-6 w-6 text-indigo-500 shrink-0" />
                <Input
                  type="text"
                  placeholder="Search 50,000+ publications..."
                  className="w-full border-0 bg-transparent px-4 py-4 sm:py-6 text-base sm:text-lg placeholder:text-gray-400 focus-visible:ring-0 shadow-none text-gray-900"
                />
              </div>
              <Button className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-colors">
                Search
              </Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-500">
            <span className="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">By Author</span>
            <span className="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">By Subject</span>
            <span className="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">By Year</span>
            <span className="flex items-center hover:text-indigo-600 cursor-pointer transition-colors">By Publication Type</span>
          </div>
        </div>
      </div>
    </section>
  )
}

