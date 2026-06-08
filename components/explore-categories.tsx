'use client'

import { Beaker, Stethoscope, Briefcase, BookOpen, Gavel } from 'lucide-react'

const categories = [
  {
    name: 'Engineering',
    icon: Beaker,
    count: '12,450',
  },
  {
    name: 'Medical',
    icon: Stethoscope,
    count: '8,920',
  },
  {
    name: 'Management',
    icon: Briefcase,
    count: '6,780',
  },
  {
    name: 'Humanities',
    icon: BookOpen,
    count: '9,340',
  },
  {
    name: 'Law',
    icon: Gavel,
    count: '4,560',
  },
]

export default function ExploreCategories() {
  return (
    <section className="border-y border-border bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Browse Topics
          </p>
          <h2 className="mt-2 text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Explore by Category
          </h2>
        </div>

        <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 lg:gap-6 hide-scrollbar">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                className="group flex-none w-[70vw] sm:w-auto snap-center rounded-lg border border-border bg-background p-6 transition duration-300 hover:border-primary hover:bg-primary/5 text-left"
              >
                <Icon className="mb-4 h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">{category.count} items</p>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
