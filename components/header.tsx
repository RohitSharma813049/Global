'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center bg-background">
          <Image
            src="/logo1.png"
            alt="Global Scholar Publications"
            width={170}
            height={0}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/category" className="text-sm text-foreground/70 transition hover:text-foreground">
            Explore
          </Link>
          <Link href="/blog" className="text-sm text-foreground/70 transition hover:text-foreground">
            For Scholars
          </Link>
          <Link href="/about" className="text-sm text-foreground/70 transition hover:text-foreground">
            About
          </Link>
          <div className="flex gap-3">
            <Link href="/signin">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
