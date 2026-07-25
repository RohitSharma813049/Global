'use client'

import React, { useState, useEffect } from 'react'
import { getAllScholarsForAdmin, toggleScholarFeaturedStatus } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import { MoreVertical, Star, StarOff, Edit } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedScholarsManager() {
  const [scholars, setScholars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(scholars.length / itemsPerPage)
  const paginatedScholars = scholars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
            {paginatedScholars.map(scholar => {
                 
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
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleToggle(scholar.id, !!scholar.is_featured); 
                          }}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${scholar.is_featured ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'}`}
                        >
                          {scholar.is_featured ? (
                            <><StarOff className="w-4 h-4 text-amber-500" /> Un-feature</>
                          ) : (
                            <><Star className="w-4 h-4 text-amber-500" /> Feature</>
                          )}
                        </button>
                        <Link href={`/scholars/${scholar.username || scholar.id}`} className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
                          <Edit className="w-4 h-4" /> Edit Profile
                        </Link>
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
        
        {/* Pagination UI */}
        {totalPages > 1 && !loading && scholars.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)">
            <div className="text-sm text-(--color-gsp-text-secondary)">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, scholars.length)} of {scholars.length} entries
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-(--color-gsp-border-default) disabled:opacity-50 text-sm font-medium hover:bg-(--color-gsp-surface-muted)"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-(--color-gsp-border-default) disabled:opacity-50 text-sm font-medium hover:bg-(--color-gsp-surface-muted)"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
