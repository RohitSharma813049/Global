'use client'

import React, { memo } from 'react'
import Link from 'next/link'

export interface CategoryData {
  title: string
  count: string
  image: string
  link: string
}

interface CategoryCardProps {
  category: CategoryData
  index?: number
  className?: string
  style?: React.CSSProperties
}

const CategoryCard = memo(function CategoryCard({
  category,
  index = 0,
  className = '',
  style,
}: CategoryCardProps) {
  return (
    <Link
      href={category.link}
      className={`gsp-cat-card gsp-reveal ${className}`}
      style={{ transitionDelay: `${index * 100}ms`, ...style }}
    >
      <div
        className="gsp-cat-card-img"
        style={{ backgroundImage: `url('${category.image}')` }}
      />
      <div className="gsp-cat-card-overlay" />
      <div className="gsp-cat-card-content">
        <p className="gsp-cat-card-count">{category.count}</p>
        <h3
          className="gsp-cat-card-title"
          dangerouslySetInnerHTML={{ __html: category.title }}
        />
        <div className="gsp-cat-card-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 11L11 3M5 3h6v6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
})

export default CategoryCard
