import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import '../styles/globals.css'
import Header from '@/components/header'
import { Toaster } from 'react-hot-toast'

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
      <body className="font-sans antialiased text-foreground overflow-x-hidden min-h-screen">
        <Providers>
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
