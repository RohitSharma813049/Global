'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Product: [
    { name: 'Explore', href: '#' },
    { name: 'For Scholars', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'Features', href: '#' },
  ],
  Company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  Resources: [
    { name: 'Help Center', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'API', href: '#' },
    { name: 'Community', href: '#' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Accessibility', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-5">
            <div>
              <Link href="/" className="flex items-center gap-0">
                <Image
                  src="/logo1.png"
                  alt="Global Scholar Publications"
                  width={140}
                  height={50}
                  className="h-auto w-auto"
                />
              </Link>
              <p className="mt-4 text-sm text-foreground/60">
                Empowering global research and knowledge sharing.
              </p>
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-foreground">{category}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground/60 transition hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-border" />

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-foreground/60">
              © 2024 Global Scholar Publications. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-foreground/60 hover:text-primary">
                Twitter
              </Link>
              <Link href="#" className="text-sm text-foreground/60 hover:text-primary">
                LinkedIn
              </Link>
              <Link href="#" className="text-sm text-foreground/60 hover:text-primary">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
