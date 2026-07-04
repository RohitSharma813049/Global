'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  'Quick Links': [
    { name: 'Explore', href: '/explore' },
    { name: 'For Scholars', href: '/signin' },
    { name: 'Features', href: '/features' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  'Publication Types': [
    { name: 'Books', href: '/explore' },
    { name: 'Journals', href: '/explore' },
    { name: 'Conferences', href: '/explore' },
    { name: 'Magazines', href: '/explore' },
  ],
  'Subject Categories': [
    { name: 'Agriculture', href: '/explore' },
    { name: 'Business & Management', href: '/explore' },
    { name: 'Computer Science & AI', href: '/explore' },
    { name: 'Education', href: '/explore' },
    { name: 'Engineering & Technology', href: '/explore' },
    { name: 'Environmental Studies', href: '/explore' },
  ],
  'More Subjects': [
    { name: 'Humanities', href: '/explore' },
    { name: 'Law', href: '/explore' },
    { name: 'Medical & Health Sciences', href: '/explore' },
    { name: 'Social Sciences', href: '/explore' },
    { name: 'Other', href: '/explore' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/privacy' },
    { name: 'Accessibility', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[#ECEAF4] bg-white font-['Space_Grotesk'] text-[#0A0A0A]">
      <div className="px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="col-span-2 md:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-0">
                <Image
                  src="/logo1.png"
                  alt="Global Scholar Publications"
                  width={140}
                  height={50}
                  className="h-auto w-auto"
                  style={{ width: "auto" }}
                />
              </Link>
              <p className="mt-4 text-sm text-foreground/60">
                Empowering global research and knowledge sharing.
              </p>
            <form className="mt-6 flex w-full flex-col gap-2" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
              <input type="email" placeholder="Enter your email" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary" required />
              <button type="submit" className="w-full rounded-lg bg-[#2F115D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2F115D]/90">Subscribe</button>
            </form> 
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#0A0A0A]">{category}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 transition hover:text-[#2F115D]"
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

