'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { updatePublicationContent } from '@/app/actions/publications'
import { toast } from 'react-hot-toast'

export default function PublicationsClient({ initialPublications }: { initialPublications: any[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <PublicationsClientInner initialPublications={initialPublications} />
    </TooltipProvider>
  )
}

function PublicationsClientInner({ initialPublications }: { initialPublications: any[] }) {
  const [publications, setPublications] = useState(initialPublications)
  const [selectedPub, setSelectedPub] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async (id: string) => {
    setIsPublishing(true)
    try {
      const res = await updatePublicationContent(id, { status: 'pending' })
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Publication submitted for review!')
        setPublications(pubs => pubs.map(p => p.id === id ? { ...p, status: 'pending' } : p))
        setSelectedPub(null)
      }
    } catch (err: any) {
      toast.error(err.message)
    }
    setIsPublishing(false)
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = (pub.title || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || (pub.content_type || '').toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === 'ALL' || (pub.status || 'draft').toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, typeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / itemsPerPage))
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search publications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-4">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="article">Article</option>
            <option value="ebook">Ebook</option>
            <option value="magazine">Magazine</option>
            <option value="thesis">Thesis</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-(--color-gsp-surface-muted) border-b border-(--color-gsp-border-muted)">
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Title</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Type</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Status</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Views</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Downloads</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary)">Date</th>
              <th className="px-6 py-4 font-semibold text-sm text-(--color-gsp-text-secondary) text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-gsp-border-subtle)">
            {paginatedPublications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-(--color-gsp-text-muted)">
                  {publications.length === 0 ? "You have not uploaded any publications yet." : "No publications match your filters."}
                </td>
              </tr>
            ) : (
              paginatedPublications.map(pub => (
                <tr key={pub.id} className="hover:bg-(--color-gsp-surface-muted) transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/publications/${pub.id}`} className="font-medium text-(--color-gsp-text-primary) hover:text-violet truncate max-w-62.5 block hover:underline">
                      {pub.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary) capitalize">{pub.content_type}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pub.status === 'published' ? 'bg-green-100 text-green-700' :
                      pub.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {pub.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary)">{pub.views || 0}</td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary)">{pub.downloads || 0}</td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary)">
                    {pub.created_at ? format(new Date(pub.created_at), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/publications/${pub.id}`}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                          >
                            Full View
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open the full publication page</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setSelectedPub(pub)}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Quick View
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View publication details and actions</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        {filteredPublications.length > 0 && (
          <div className="px-6 py-4 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised) flex items-center justify-between">
            <span className="text-sm text-(--color-gsp-text-secondary)">
              Showing <span className="font-medium text-(--color-gsp-text-primary)">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-(--color-gsp-text-primary)">{Math.min(currentPage * itemsPerPage, filteredPublications.length)}</span> of <span className="font-medium text-(--color-gsp-text-primary)">{filteredPublications.length}</span> results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {selectedPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 truncate pr-8">{selectedPub.title}</h2>
              <button 
                onClick={() => setSelectedPub(null)}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                {selectedPub.cover_image && (
                  <img src={selectedPub.cover_image} alt="Cover" className="w-32 h-44 object-cover rounded-lg shadow-md border flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex gap-2 flex-wrap mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {selectedPub.content_type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      selectedPub.status === 'published' ? 'bg-green-100 text-green-700' :
                      selectedPub.status === 'draft' ? 'bg-gray-200 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedPub.status || 'draft'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3">Abstract</h3>
                  <div 
                    className="text-gray-700 bg-gray-50 p-5 rounded-lg border leading-relaxed text-sm max-h-62.5 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: selectedPub.abstract }}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3">Performance</h3>
                  <div className="bg-white border rounded-lg p-4 h-62.5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Views', count: selectedPub.views || 0, fill: '#2F115D' },
                        { name: 'Downloads', count: selectedPub.downloads || 0, fill: '#8e44ad' }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 mt-auto">
              {selectedPub.status === 'draft' && (
                <button
                  onClick={() => handlePublish(selectedPub.id)}
                  disabled={isPublishing}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isPublishing ? 'Submitting...' : 'Submit for Review'}
                </button>
              )}
              {selectedPub.file_url && selectedPub.file_url.trim() !== '' && selectedPub.file_url !== '#' && (
                <a 
                  href={selectedPub.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-violet text-white rounded-md font-medium hover:bg-[#3d167a] shadow-sm transition-colors"
                >
                  View Document
                </a>
              )}
              {selectedPub.video_url && selectedPub.video_url.trim() !== '' && selectedPub.video_url !== '#' && (
                <a 
                  href={selectedPub.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-purple-100 text-purple-700 rounded-md font-medium hover:bg-purple-200 transition-colors"
                >
                  View Video
                </a>
              )}
              <button
                onClick={() => setSelectedPub(null)}
                className="px-5 py-2.5 border rounded-md font-medium text-gray-600 hover:bg-gray-100 bg-white transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
