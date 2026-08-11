import type { Metadata } from 'next'
import { Cormorant_Garamond, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import '../styles/globals.css'
import Header from "@/components/layout/header"
import { Toaster } from 'react-hot-toast'
import { CopyProtection } from '@/components/copy-protection'

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://global-wine.vercel.app'),
  title: {
    default: 'Global Scholar Publications - Empowering Global Research & Knowledge Sharing',
    template: '%s | Global Scholar Publications'
  },
  description: 'A leading platform for scholars, researchers, and academics to share and discover peer-reviewed research papers, doctoral theses, eBooks, and academic journals worldwide.',
  keywords: ['Global Scholar', 'Research Papers', 'Open Access', 'Peer-Reviewed Journals', 'Doctoral Thesis', 'Academic Publications', 'Scholarly Articles', 'eBooks'],
  authors: [{ name: 'Global Scholar Publications' }],
  creator: 'Global Scholar Publications',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://global-wine.vercel.app',
    siteName: 'Global Scholar Publications',
    title: 'Global Scholar Publications - Empowering Global Research',
    description: 'Explore peer-reviewed research papers, doctoral theses, eBooks, and academic journals worldwide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Scholar Publications - Empowering Global Research',
    description: 'Explore peer-reviewed research papers, doctoral theses, eBooks, and academic journals worldwide.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} ${cormorantGaramond.variable} font-sans antialiased text-foreground min-h-dvh`}>
        <div className="flex flex-col min-h-dvh w-full overflow-x-hidden relative">
          <Providers>
            <CopyProtection />
            <Header/>
            <main className="pb-16 md:pb-0 flex-1 flex flex-col">
              {children}
            </main>
            {process.env.NODE_ENV === 'production' && <Analytics />}
            <Toaster position="bottom-right" />
          </Providers>
        </div>
      </body>
    </html>
  )
}
