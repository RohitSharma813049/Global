'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-primary/5 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Empowering Global
          <span className="block text-primary">Research & Knowledge Sharing</span>
        </h1>
        
        <p className="mt-6 text-lg text-foreground/60 sm:text-xl">
          Discover, publish, and collaborate with scholars worldwide. Access thesis, research papers, eBooks, and more.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            Explore Research
          </Button>
          <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 px-8">
            Become a Scholar
          </Button>
        </div>

        <div className="mt-12 w-full">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search research, thesis, articles..."
              className="border-primary/30 bg-white pl-12 py-6 text-base placeholder:text-foreground/50 focus:border-primary focus:ring-primary"
            />
          </div>
          <p className="mt-3 text-xs text-foreground/50">
            Search across 50,000+ publications and growing
          </p>
        </div>
      </div>
    </section>
  )
}
