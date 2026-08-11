'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutGrid, List, ArrowRight, BookOpen, Award, Building } from 'lucide-react'
import ScholarSearchForm from './ScholarSearchForm'
import GspFeaturedScholars from '@/components/scholars/gsp-featured-scholars'

interface ScholarItem {
  id: string
  username: string | null
  qualification: string | null
  institution: string | null
  specialization: string | null
  bio: string | null
  profile_photo_url: string | null
  is_featured: boolean | null
  users: {
    email: string
    raw_user_meta_data: any
  } | null
  pubCount: number
}

interface ScholarsClientProps {
  initialScholars: ScholarItem[]
  query: string
  featuredScholars: any[]
}

export default function ScholarsClient({ initialScholars, query, featuredScholars }: ScholarsClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredScholars = initialScholars.filter(scholar => {
    if (!query) return true
    const meta = scholar.users?.raw_user_meta_data as any
    const name = meta?.name || meta?.full_name || ''
    const email = scholar.users?.email || ''
    const username = scholar.username || ''
    const inst = scholar.institution || ''
    const spec = scholar.specialization || ''
    const qual = scholar.qualification || ''
    const qLower = query.toLowerCase()

    return (
      name.toLowerCase().includes(qLower) ||
      username.toLowerCase().includes(qLower) ||
      email.toLowerCase().includes(qLower) ||
      inst.toLowerCase().includes(qLower) ||
      spec.toLowerCase().includes(qLower) ||
      qual.toLowerCase().includes(qLower)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] font-bold text-ink mb-3">
          Our Distinguished Scholars
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Discover the brilliant minds behind our global research community.
        </p>

        {/* Search Bar */}
        <ScholarSearchForm initialQuery={query} />
      </div>

      {/* Toolbar: Results Count & Grid/List View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-rule">
        <div className="text-sm font-medium text-gray-600">
          Showing <span className="font-bold text-violet">{filteredScholars.length}</span> {filteredScholars.length === 1 ? 'scholar' : 'scholars'}
          {query && <span> for &quot;<span className="text-ink font-semibold">{query}</span>&quot;</span>}
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-rule self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-violet shadow-sm border border-rule'
                : 'text-gray-500 hover:text-ink'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-violet shadow-sm border border-rule'
                : 'text-gray-500 hover:text-ink'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredScholars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-rule max-w-xl mx-auto my-8 p-8">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-ink mb-1">No Scholars Found</h3>
          <p className="text-sm text-gray-500 mb-6">
            We couldn&apos;t find any scholar matching &quot;{query}&quot;. Try checking for spelling or search another keyword.
          </p>
          <Link href="/scholars" className="inline-flex items-center px-4 py-2 bg-violet text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Clear Search
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredScholars.map((scholar) => {
            const meta = scholar.users?.raw_user_meta_data as any
            const name = meta?.name || meta?.full_name || scholar.users?.email?.split('@')[0] || 'Unknown Scholar'
            const avatar = scholar.profile_photo_url || meta?.avatar_url || meta?.picture || meta?.image || ''
            const initials = name.substring(0, 2).toUpperCase()

            return (
              <div
                key={scholar.id}
                className="bg-white rounded-2xl border border-rule p-6 shadow-sm hover:shadow-xl hover:border-violet/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-50 border-2 border-indigo-100 shrink-0 flex items-center justify-center text-violet font-bold text-xl relative shadow-sm">
                      {avatar ? (
                        <Image src={avatar} alt={name} fill sizes="64px" className="object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-violet border border-indigo-100">
                      <BookOpen className="w-3.5 h-3.5" />
                      {scholar.pubCount} {scholar.pubCount === 1 ? 'Pub' : 'Pubs'}
                    </span>
                  </div>

                  <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-ink group-hover:text-violet transition-colors line-clamp-1 mb-1">
                    {name}
                  </h3>

                  {scholar.username && (
                    <p className="text-xs font-semibold text-violet mb-3">@{scholar.username}</p>
                  )}

                  <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                    {(scholar.institution || scholar.qualification) && (
                      <div className="flex items-center gap-2 font-medium">
                        <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{scholar.institution || scholar.qualification}</span>
                      </div>
                    )}
                    {scholar.specialization && (
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{scholar.specialization}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-6">
                    {scholar.bio || "Registered scholar on Global Scholar Publications."}
                  </p>
                </div>

                <Link
                  href={`/scholars/${scholar.username || scholar.id}`}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-rule text-xs font-bold text-violet uppercase tracking-wider group-hover:text-indigo-800 transition-colors"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW LAYOUT */
        <div className="space-y-4 mb-20">
          {filteredScholars.map((scholar) => {
            const meta = scholar.users?.raw_user_meta_data as any
            const name = meta?.name || meta?.full_name || scholar.users?.email?.split('@')[0] || 'Unknown Scholar'
            const avatar = scholar.profile_photo_url || meta?.avatar_url || meta?.picture || meta?.image || ''
            const initials = name.substring(0, 2).toUpperCase()

            return (
              <div
                key={scholar.id}
                className="bg-white rounded-xl border border-rule p-5 shadow-sm hover:shadow-md hover:border-violet/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 shrink-0 flex items-center justify-center text-violet font-bold text-lg relative">
                    {avatar ? (
                      <Image src={avatar} alt={name} fill sizes="56px" className="object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-ink group-hover:text-violet transition-colors">
                      {name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 flex-wrap">
                      {scholar.username && <span className="font-semibold text-violet">@{scholar.username}</span>}
                      {scholar.institution && <span>• {scholar.institution}</span>}
                      {scholar.specialization && <span className="text-emerald-700 font-medium">• {scholar.specialization}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-rule">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-violet border border-indigo-100">
                    <BookOpen className="w-3.5 h-3.5" />
                    {scholar.pubCount} {scholar.pubCount === 1 ? 'Publication' : 'Publications'}
                  </span>
                  <Link
                    href={`/scholars/${scholar.username || scholar.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-violet hover:text-white border border-rule text-xs font-bold text-violet transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Featured Scholars Section */}
      {featuredScholars.length > 0 && (
        <div className="border-t border-rule pt-16 bg-white rounded-2xl p-6 shadow-sm mb-12">
          <GspFeaturedScholars
            title="Featured Scholars"
            subtitle="Meet our top contributors"
            scholars={featuredScholars}
            autoplay={true}
          />
        </div>
      )}
    </div>
  )
}
