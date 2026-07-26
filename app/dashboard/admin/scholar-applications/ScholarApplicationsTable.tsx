'use client'

import React, { useState } from 'react'
import ApplicationActionButtons from "./ApplicationActionButtons"
import { Search, Filter, Edit } from 'lucide-react'
import Pagination from '@/components/shared/pagination'
import { updateScholarApplication } from '@/app/actions/scholar-applications'
import toast from 'react-hot-toast'

export default function ScholarApplicationsTable({ initialApplications }: { initialApplications: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredApplications = initialApplications?.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.specialization?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil((filteredApplications?.length || 0) / itemsPerPage)
  const paginatedApplications = filteredApplications?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Edit State
  const [showEdit, setShowEdit] = useState(false)
  const [editingApp, setEditingApp] = useState<any>(null)
  const [savingApp, setSavingApp] = useState(false)

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingApp) return
    setSavingApp(true)
    try {
      await updateScholarApplication(editingApp.id, {
        full_name: editingApp.full_name,
        qualification: editingApp.qualification,
        institution: editingApp.institution,
        specialization: editingApp.specialization
      })
      toast.success('Application updated successfully. Please refresh to see changes.')
      setShowEdit(false)
      setEditingApp(null)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingApp(false)
    }
  }

  return (
    <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow overflow-hidden w-full flex flex-col">
      {/* Filters and Search Bar */}
      <div className="p-4 border-b border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-(--color-gsp-text-secondary)" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-(--color-gsp-border-default) rounded-md leading-5 bg-(--color-gsp-surface-muted) placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search applicants, institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-(--color-gsp-text-secondary)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-(--color-gsp-border-default) focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {showEdit && editingApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Application</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Full Name</label>
                <input aria-label="Input field" 
                  type="text" 
                  value={editingApp.full_name || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, full_name: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Qualification</label>
                <input aria-label="Input field" 
                  type="text" 
                  value={editingApp.qualification || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, qualification: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Institution</label>
                <input aria-label="Input field" 
                  type="text" 
                  value={editingApp.institution || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, institution: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Specialization</label>
                <input aria-label="Input field" 
                  type="text" 
                  value={editingApp.specialization || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, specialization: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary)"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingApp}
                  className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg) hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savingApp ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-(--color-gsp-surface-raised) sticky top-0 z-10 shadow-(--shadow-1)">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider bg-(--color-gsp-surface-raised) whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-(--color-gsp-surface-muted) divide-y divide-gray-200">
            {paginatedApplications?.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-(--color-gsp-text-primary)">{app.full_name}</div>
                  <div className="text-sm text-(--color-gsp-text-secondary)">{app.qualification}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  {app.institution}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  {app.specialization}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                  <div className="flex flex-col gap-1">
                    {app.documents?.document_link ? (
                      <a href={app.documents.document_link} target="_blank" rel="noreferrer" className="text-(--color-gsp-text-inverse) hover:text-indigo-900 font-medium">CV/Doc Link</a>
                    ) : (
                      <span className="text-(--color-gsp-text-secondary) italic">No Document</span>
                    )}
                    {app.documents?.additional_link && (
                      <a href={app.documents.additional_link} target="_blank" rel="noreferrer" className="text-(--color-gsp-text-inverse) hover:text-indigo-900 text-xs">Additional Link</a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditingApp(app); setShowEdit(true); }}
                      className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 transition-colors"
                      title="Edit Application"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <ApplicationActionButtons applicationId={app.id} currentStatus={app.status} />
                  </div>
                </td>
              </tr>
            ))}
            {(!filteredApplications || filteredApplications.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-(--color-gsp-text-secondary)">
                  No applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredApplications && filteredApplications.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredApplications.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
