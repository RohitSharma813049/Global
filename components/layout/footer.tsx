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
    { name: 'Help', href: '/help' },
  ],
  'Publication Types': [
    { name: 'Books', href: '/publications?category=books' },
    { name: 'Journals', href: '/updates' },
    { name: 'Conferences', href: '/publications?category=conferences' },
    { name: 'Magazines', href: '/updates' },
  ],
  'Subject Categories': [
    { name: 'Agriculture', href: '/publications?category=agriculture' },
    { name: 'Business & Management', href: '/publications?category=business-management' },
    { name: 'Computer Science & AI', href: '/publications?category=computer-science' },
    { name: 'Education', href: '/publications?category=education' },
    { name: 'Engineering & Technology', href: '/publications?category=engineering' },
    { name: 'Environmental Studies', href: '/publications?category=environmental-studies' },
  ],
  'More Subjects': [
    { name: 'Humanities', href: '/publications?category=humanities' },
    { name: 'Law', href: '/publications?category=law' },
    { name: 'Medical & Health Sciences', href: '/publications?category=medical-health' },
    { name: 'Social Sciences', href: '/publications?category=social-sciences' },
    { name: 'Other', href: '/publications?category=other' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-white font-['Space_Grotesk'] text-ink">
      <div className="px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
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
              <button type="submit" className="w-full rounded-lg bg-violet px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet/90">Subscribe</button>
            </form> 
            </div>

            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-ink">{category}</h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        prefetch={false}
                        className="text-sm text-gray-500 transition hover:text-violet"
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

