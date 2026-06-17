'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LiveRefresher({ interval = 10000 }: { interval?: number }) {
  const router = useRouter()

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        router.refresh()
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [router, interval])

  return null // This component doesn't render anything
}
