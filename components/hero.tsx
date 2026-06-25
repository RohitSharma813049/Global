'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import GlobalSearch from './global-search'
import { motion } from 'framer-motion'

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

  const displaySubtitle = subtitle || "";

  return (
    <section className="relative overflow-hidden bg-white px-6 py-12 sm:py-16 h-half">
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt="Hero Background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-white/10"></div>
        </div>
      )}


      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Subtle top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-800 shadow-sm backdrop-blur-sm transition-all hover:bg-indigo-100">
            <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
            Join the Next Generation of Academic Publishing
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-balance text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {firstPart}
          {secondPart && (
            <span className="mt-2 block text-indigo-600 pb-2">
              {secondPart}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-gray-800 font-medium sm:text-xl leading-relaxed"
        >
          {displaySubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className=" w-full mx-auto max-w-3xl transform transition-all hover:-translate-y-1"
        >
          <div className="relative group">
            <div className="relative flex justify-center items-center">
              <GlobalSearch className="w-full max-w-full" />
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 text-sm font-medium">
            <Link href="/explore" className="flex items-center cursor-pointer transition-all px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-sm">By Author</Link>
            <Link href="/explore" className="flex items-center cursor-pointer transition-all px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-sm">By Subject</Link>
            <Link href="/explore" className="flex items-center cursor-pointer transition-all px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-sm">By Year</Link>
            <Link href="/explore" className="flex items-center cursor-pointer transition-all px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-md border border-white/10 shadow-sm">By Publication Type</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

