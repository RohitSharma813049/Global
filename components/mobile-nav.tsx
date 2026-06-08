'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, BookOpen, Info, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/category', label: 'Explore', icon: Compass },
    { href: '/blog', label: 'Scholars', icon: BookOpen },
    { href: '/about', label: 'About', icon: Info },
    { href: '/signin', label: 'Sign In', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
