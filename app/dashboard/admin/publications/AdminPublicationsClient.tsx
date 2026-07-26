'use client'

import React, { useState, useTransition } from 'react'
import PublicationActionButtons from "./PublicationActionButtons"
import { Star, StarOff } from 'lucide-react'
import { togglePublicationFeaturedStatus } from '@/app/actions/publications'
import toast from 'react-hot-toast'

export default function AdminPublicationsClient({ publications }: { publications: any[] }) {
  const [isPending, startTransition] = useTransition()

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

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const totalPages = Math.max(1, Math.ceil(publications.length / itemsPerPage))
  const paginatedPublications = publications.slice(
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
    <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow border border-(--color-gsp-border-muted) overflow-hidden flex flex-col">
      <div className="w-full overflow-x-auto">
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
            {paginatedPublications.map((pub: any, idx: number) => (
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
                  <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    View PDF
                  </a>
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

      {publications.length > 0 && (
        <div className="px-6 py-4 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised) flex items-center justify-between">
          <span className="text-sm text-(--color-gsp-text-secondary)">
            Showing <span className="font-medium text-(--color-gsp-text-primary)">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-(--color-gsp-text-primary)">{Math.min(currentPage * itemsPerPage, publications.length)}</span> of <span className="font-medium text-(--color-gsp-text-primary)">{publications.length}</span> results
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
  )
}
