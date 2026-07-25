'use client'

import React, { useState, useEffect } from 'react'
import { getAllScholarsForAdmin, toggleScholarFeaturedStatus } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import { MoreVertical, Star, StarOff } from 'lucide-react'

export default function FeaturedScholarsManager() {
  const [scholars, setScholars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        <p className="text-(--color-gsp-text-secondary) text-sm mt-1">Select which scholars to display in the Top Contributors section.</p>
      </div>

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow overflow-hidden border border-(--color-gsp-border-muted)">
        {loading ? (
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">Loading...</div>
        ) : scholars.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-(--color-gsp-surface-raised)">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Scholar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Publications</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Featured</th>
              </tr>
            </thead>
            <tbody className="bg-(--color-gsp-surface-muted) divide-y divide-gray-200">
              {scholars.map(scholar => {
                 
                const name = (scholar.users?.raw_user_meta_data as any)?.name || scholar.users?.email || 'Unknown User'
                return (
                  <tr key={String(scholar.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-(--color-gsp-text-primary)">{name}</div>
                      <div className="text-xs text-(--color-gsp-text-secondary)">{scholar.institution}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">{scholar.specialization || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">{scholar._count?.publications || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === scholar.id ? null : scholar.id);
                          }}
                          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>

                        {openMenuId === scholar.id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => { setOpenMenuId(null); handleToggle(scholar.id, !!scholar.is_featured); }}
                              className="w-full text-left px-4 py-2 text-sm text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary) hover:bg-violet-soft flex items-center gap-2"
                            >
                              {scholar.is_featured ? (
                                <><StarOff className="w-4 h-4 text-amber-500" /> Un-feature Scholar</>
                              ) : (
                                <><Star className="w-4 h-4 text-amber-500" /> Feature Scholar</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">No scholars found.</div>
        )}
      </div>
    </div>
  )
}
