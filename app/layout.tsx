import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'
import Header from '@/components/header'
import MobileNav from '@/components/mobile-nav'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Global Scholar Publications - Empowering Global Research & Knowledge Sharing',
  description: 'A leading platform for scholars, researchers, and academics to share and discover research, thesis, eBooks, and publications.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased text-foreground pb-16 md:pb-0">
        <Header/>
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
        <MobileNav />
      </body>
    </html>
  )
}
