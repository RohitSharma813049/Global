'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface ScholarData {
  id?: string | number
  username?: string
  name: string
  image: string
  country?: string
  countryFlag?: string
  publications: number
  credential?: string
  institution?: string
  field?: string
}

interface ScholarCardProps {
  scholar: ScholarData
  variant?: 'gsp' | 'compact'
  className?: string
  style?: React.CSSProperties
}

const ScholarCard = memo(function ScholarCard({
  scholar,
  variant = 'gsp',
  className = '',
  style,
}: ScholarCardProps) {
  const profileUrl = `/scholars/${scholar.username || scholar.id || '#'}`

  if (variant === 'compact') {
    return (
      <Link
        href={profileUrl}
        className={`block group h-full relative rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 overflow-hidden cursor-pointer ${className}`}
        style={style}
      >
        <div className="absolute inset-0 bg-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative mb-6 flex justify-center">
          <div className="relative h-28 w-28 rounded-full p-1 bg-indigo-500">
            <div className="h-full w-full rounded-full border-4 border-white bg-white overflow-hidden">
              <Image
                src={scholar.image}
                alt={scholar.name}
                width={120}
                height={120}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
        <h3 className="relative z-10 text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
          {scholar.name}
        </h3>
        <p className="relative z-10 mt-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
          {scholar.field || scholar.credential || 'Scholar'}
        </p>

        <div className="relative z-10 mt-6 inline-flex items-center rounded-full bg-gray-50 px-4 py-1.5 border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700">
            {scholar.publications} <span className="font-medium text-gray-500">Publications</span>
          </span>
        </div>
      </Link>
    )
  }

  // Default GSP variant
  return (
    <Link
      href={profileUrl}
      className={`scholar-card ${className}`}
      data-name={scholar.name}
      style={style}
    >
      <div className="sc-photo-wrap">
        <Image
          src={scholar.image}
          alt={scholar.name}
          width={480}
          height={560}
          className="object-cover w-full h-full"
        />
        <div className="sc-photo-gradient" />
        <div className="sc-pub-badge">
          <span className="sc-pub-n">{scholar.publications}</span>
          <span className="sc-pub-l">Papers</span>
        </div>
        <div className="sc-photo-info">
          <p className="sc-name-onphoto">{scholar.name}</p>
        </div>
      </div>
      <div className="sc-body">
        {scholar.credential && (
          <p className="sc-cred">
            <span className="sc-dot" />
            {scholar.credential}
          </p>
        )}
        {scholar.institution && (
          <p className="sc-institution">{scholar.institution}</p>
        )}
        <div className="sc-footer mt-auto pt-4">
          {scholar.field && <span className="sc-field-tag">{scholar.field}</span>}
          <span className="sc-view ml-auto">
            View Profile
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M2 5.5h7M6 2.5l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
})

export default ScholarCard
