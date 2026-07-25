import React from 'react'
import { getScholarPublications } from '@/app/actions/publications'
import AnalyticsClient from './AnalyticsClient'

export const metadata = {
  title: 'Analytics | Global Scholar Publications',
}

export default async function ScholarAnalyticsPage() {
  const { data: publications, error } = await getScholarPublications()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-gsp-text-primary)]">Analytics Overview</h1>
        <p className="text-[var(--color-gsp-text-secondary)] mt-2">Track the performance and engagement of your publications.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">Error loading data: {error}</div>
      ) : (
        <AnalyticsClient publications={publications || []} />
      )}
    </div>
  )
}
