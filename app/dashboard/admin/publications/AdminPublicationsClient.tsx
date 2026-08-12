'use client'

import React, { useState, useTransition } from 'react'
import PublicationActionButtons from "./PublicationActionButtons"
import { Star, StarOff } from 'lucide-react'
import { togglePublicationFeaturedStatus } from '@/app/actions/publications'
import toast from 'react-hot-toast'
import PdfViewerModal from '@/components/shared/PdfViewerModal'

export default function AdminPublicationsClient({ publications }: { publications: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: ''
  })

  const handleToggleFeature = async (id: string, currentlyFeatured: boolean) => {
    startTransition(async () => {
      try {
        await togglePublicationFeaturedStatus(id, !currentlyFeatured)
        toast.success(`Publication ${currentlyFeatured ? 'un-featured' : 'featured'}`)
      } catch (e: any) {
        toast.error(e.message)
      }
    })
  }
  const handleToggleHero = async (id: string, currentlyHero: boolean) => {
    startTransition(async () => {
      try {
        const { togglePublicationHeroStatus } = await import('@/app/actions/publications');
        await togglePublicationHeroStatus(id, !currentlyHero);
        toast.success(`Publication ${currentlyHero ? 'un-pinned from' : 'pinned to'} Hero Carousel`);
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredPublications = (publications || []).filter(pub => {
    const matchesSearch = (pub.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (pub.author_name || pub.scholars?.institution || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || (pub.content_type || '').toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === 'ALL' || (pub.status || 'draft').toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesType && matchesStatus
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, typeFilter, statusFilter])
  
  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / itemsPerPage))
  const paginatedPublications = filteredPublications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (!publications || publications.length === 0) {
    return (
      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow border border-(--color-gsp-border-muted) overflow-hidden">
        <div className="p-8 text-center text-(--color-gsp-text-secondary)">
          No publications found.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-lg) shadow border border-(--color-gsp-border-muted)">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search publications or authors..." 
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
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow border border-(--color-gsp-border-muted) overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto min-h-[300px]">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-(--color-gsp-surface-raised)">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Publication</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Scholar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Document</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised)">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-(--color-gsp-surface-muted) divide-y divide-gray-200">
            {paginatedPublications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-(--color-gsp-text-secondary)">
                  No publications match your filters.
                </td>
              </tr>
            ) : paginatedPublications.map((pub: any, idx: number) => (
              <tr key={pub.id} className="hover:bg-(--color-gsp-surface-raised) transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  {(currentPage - 1) * itemsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-(--color-gsp-text-primary)">{pub.title}</div>
                  <div className="text-sm text-(--color-gsp-text-secondary) truncate max-w-xs">{pub.abstract}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {pub.content_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  {pub.categories?.name || 'None'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  {pub.author_name || pub.scholars?.institution || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pub.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 
                    pub.status === 'under_review' ? 'bg-purple-100 text-purple-800' :
                    pub.status === 'published' ? 'bg-green-100 text-green-800' :
                    pub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {pub.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-inverse)">
                  <button 
                    onClick={() => setPdfModal({ isOpen: true, url: pub.file_url, title: pub.title })}
                    className="hover:underline flex items-center text-purple-700 font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    View PDF
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleToggleHero(pub.id, !!pub.is_hero); 
                        }}
                        disabled={isPending}
                        className={`p-1.5 rounded-md text-sm font-medium flex items-center transition-colors disabled:opacity-50 ${pub.is_hero ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                        title={pub.is_hero ? 'Un-pin from Hero Carousel' : 'Pin to Hero Carousel'}
                      >
                        {pub.is_hero ? (
                          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z" opacity=".3"/><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        )}
                      </button>

                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleToggleFeature(pub.id, !!pub.is_featured); 
                        }}
                        disabled={isPending}
                        className={`p-1.5 rounded-md text-sm font-medium flex items-center transition-colors disabled:opacity-50 ${pub.is_featured ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'}`}
                        title={pub.is_featured ? 'Un-feature publication' : 'Feature publication'}
                      >
                        {pub.is_featured ? (
                          <StarOff className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </button>
                    <PublicationActionButtons publicationId={pub.id} currentStatus={pub.status} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPublications.length > 0 && (
        <div className="px-6 py-4 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised) flex items-center justify-between">
          <span className="text-sm text-(--color-gsp-text-secondary)">
            Showing <span className="font-medium text-(--color-gsp-text-primary)">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-(--color-gsp-text-primary)">{Math.min(currentPage * itemsPerPage, filteredPublications.length)}</span> of <span className="font-medium text-(--color-gsp-text-primary)">{filteredPublications.length}</span> results
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
      </div>

      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ ...pdfModal, isOpen: false })}
        url={pdfModal.url}
        title={pdfModal.title}
      />
    </div>
  )
}
