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
    <html lang="en" className="bg-background overflow-x-hidden max-w-[100vw]">
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} ${cormorantGaramond.variable} font-sans antialiased text-foreground overflow-x-hidden min-h-screen`}>
        <Providers>
          <CopyProtection />
          <Header/>
          <main className="pb-16 md:pb-0 flex-1 flex flex-col">
            {children}
          </main>
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
