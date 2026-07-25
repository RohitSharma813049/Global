'use client'

import React, { useState, useEffect } from 'react'
import { getAllScholarsForAdmin, toggleScholarFeaturedStatus } from '@/app/actions/cms'
import toast from 'react-hot-toast'

export default function FeaturedScholarsManager() {
   
  const [scholars, setScholars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadScholars = async () => {
    try {
      setLoading(true)
      const data = await getAllScholarsForAdmin()
      setScholars(data)
    } catch (e) {
      toast.error('Failed to load scholars')
    } finally {
      setLoading(false)
    }
  }

   
  useEffect(() => { void loadScholars() }, [])

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleScholarFeaturedStatus(id, !currentStatus)
      toast.success(currentStatus ? 'Scholar un-featured' : 'Scholar featured!')
      // Optimistic UI update
      setScholars(scholars.map(s => s.id === id ? { ...s, is_featured: !currentStatus } : s))
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('An error occurred')
      }
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Featured Scholars</h1>
        <p className="text-[var(--color-gsp-text-secondary)] text-sm mt-1">Select which scholars to display in the Top Contributors section.</p>
      </div>

      <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-lg)] shadow overflow-hidden border border-[var(--color-gsp-border-muted)]">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">Loading...</div>
        ) : scholars.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[var(--color-gsp-surface-raised)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Scholar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Publications</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Featured</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-gsp-surface-muted)] divide-y divide-gray-200">
              {scholars.map(scholar => {
                 
                const name = (scholar.users?.raw_user_meta_data as any)?.name || scholar.users?.email || 'Unknown User'
                return (
                  <tr key={String(scholar.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[var(--color-gsp-text-primary)]">{name}</div>
                      <div className="text-xs text-[var(--color-gsp-text-secondary)]">{scholar.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">{scholar.specialization || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">{scholar._count?.publications || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleToggle(scholar.id, !!scholar.is_featured)}
                        title={scholar.is_featured ? "Un-feature scholar" : "Feature scholar"}
                        aria-label={scholar.is_featured ? "Un-feature scholar" : "Feature scholar"}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${scholar.is_featured ? 'bg-[var(--color-gsp-text-inverse)]' : 'bg-gray-200'}`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--color-gsp-surface-muted)] shadow ring-0 transition duration-200 ease-in-out ${scholar.is_featured ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">No scholars found.</div>
        )}
      </div>
    </div>
  )
}
