'use client'

import { useEffect, useState } from 'react'

interface Stat {
  label: string
  value: number
  suffix: string
}

const stats: Stat[] = [
  { label: 'Active Scholars', value: 500, suffix: '+' },
  { label: 'Thesis Published', value: 300, suffix: '+' },
  { label: 'eBooks Available', value: 100, suffix: '+' },
  { label: 'Research Articles', value: 600, suffix: '+' },
]

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

export default function Statistics() {
  return (
    <section className="border-y border-border bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Platform Metrics
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Trusted by Scholars Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-foreground/60 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
