'use client'

import { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
}

export default function Statistics({ title, subtitle, statsData }: StatisticsProps) {
  const stats: Stat[] = [
    { label: 'Verified Scholars', value: statsData?.scholarsCount || 500, suffix: '+' },
    { label: 'Thesis Published', value: statsData?.thesisCount || 300, suffix: '+' },
    { label: 'eBooks Available', value: statsData?.ebookCount || 100, suffix: '+' },
    { label: 'Research Articles', value: statsData?.articleCount || 600, suffix: '+' },
  ]

  return (
    <section className="relative overflow-hidden bg-gray-50 px-6 py-10 sm:py-16">
      {/* Subtle background patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gray-200"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center transform transition-all hover:scale-105 duration-500"
        >
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            {subtitle || 'Platform Metrics'}
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {title || 'Trusted by Scholars Worldwide'}
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:gap-8"
        >
          {stats.map((stat) => (
            <motion.div 
              variants={itemVariants}
              key={stat.label} 
              className="group relative flex flex-col items-center justify-center bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <p className="relative z-10 text-4xl font-black text-indigo-600 sm:text-5xl lg:text-6xl tracking-tight">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="relative z-10 mt-3 text-sm font-semibold text-gray-500 sm:text-base uppercase tracking-wider transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
