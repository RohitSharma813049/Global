'use client'

import { useEffect, useState } from 'react'

interface Stat {
  label: string
  value: number
  suffix: string
}

interface Stat {
  label: string
  value: number
  suffix: string
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = target / 60
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count.toLocaleString()}{suffix}</span>
}

interface StatisticsProps {
  title?: string;
  subtitle?: string;
  statsData?: {
    scholarsCount: number;
    thesisCount: number;
    ebookCount: number;
    articleCount: number;
  }
}

export default function Statistics({ title, subtitle, statsData }: StatisticsProps) {
  const stats: Stat[] = [
    { label: 'Verified Scholars', value: statsData?.scholarsCount || 500, suffix: '+' },
    { label: 'Thesis Published', value: statsData?.thesisCount || 300, suffix: '+' },
    { label: 'eBooks Available', value: statsData?.ebookCount || 100, suffix: '+' },
    { label: 'Research Articles', value: statsData?.articleCount || 600, suffix: '+' },
  ]

  return (
    <section className="relative overflow-hidden bg-gray-50 px-6 py-20 sm:py-28">
      {/* Subtle background patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gray-200"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-14 text-center transform transition-all hover:scale-105 duration-500">
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            {subtitle || 'Platform Metrics'}
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {title || 'Trusted by Scholars Worldwide'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              className="group relative flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 overflow-hidden"
            >
              {/* Hover gradient effect inside card */}
              <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <p className="relative z-10 text-4xl font-black text-indigo-600 sm:text-5xl lg:text-6xl tracking-tight">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="relative z-10 mt-3 text-sm font-semibold text-gray-500 sm:text-base uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
