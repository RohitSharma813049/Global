import React from 'react'
import { getSavedPublications } from '@/app/actions/library'
import LibraryClient from '../../LibraryClient'

export const metadata = {
  title: 'My Library | Global Scholar Publications',
}

export default async function UserLibraryPage() {
  const { data, error } = await getSavedPublications()

  return (
    <div className="p-3 md:p-6 max-w-5xl mx-auto">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Saved Library</h1>
        <p className="text-gray-600 text-lg">Your personal collection of saved research papers, articles, and thesis.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">Error loading library: {error}</div>
      ) : (
        <LibraryClient initialSaved={data || []} />
      )}
    </div>
  )
}
