import React from 'react'
import { getScholarPublications } from '@/app/actions/publications'
import PublicationsClient from './PublicationsClient'

export const metadata = {
  title: 'My Publications | Global Scholar Publications',
}

export default async function ScholarPublicationsPage() {
  const { data: publications, error } = await getScholarPublications()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-gsp-text-primary)]">My Publications</h1>
        <p className="text-[var(--color-gsp-text-secondary)] mt-2">Manage your uploaded publications, drafts, and track their performance.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">Error loading publications: {error}</div>
      ) : (
        <PublicationsClient initialPublications={publications || []} />
      )}
    </div>
  )
}
