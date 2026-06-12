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
    <section className="relative overflow-hidden bg-gray-50 px-6 py-20 sm:py-32 border-y border-gray-100">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-14 text-center">
          <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase">
            Browse Topics
          </p>
          <h2 className="mt-3 text-balance text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Explore by Category
          </h2>
        </div>

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 sm:grid sm:grid-cols-3 lg:grid-cols-5 lg:gap-8 hide-scrollbar px-4 sm:px-0">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.name}
                className="group relative flex-none w-[75vw] sm:w-auto snap-center rounded-3xl bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 text-left border border-gray-100 overflow-hidden"
              >
                {/* Hover gradient fill */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors duration-500 mb-6 shadow-inner">
                    <Icon className="h-8 w-8 text-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">{category.name}</h3>
                  <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">{category.count} items</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
