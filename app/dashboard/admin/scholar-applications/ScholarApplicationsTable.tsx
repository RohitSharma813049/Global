'use client'

import React, { useState } from 'react'
import ApplicationActionButtons from "./ApplicationActionButtons"
import { Search, Filter } from 'lucide-react'

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

  return (
    <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-lg)] shadow overflow-hidden w-full flex flex-col">
      {/* Filters and Search Bar */}
      <div className="p-4 border-b border-[var(--color-gsp-border-muted)] bg-[var(--color-gsp-surface-raised)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--color-gsp-text-secondary)]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[var(--color-gsp-border-default)] rounded-md leading-5 bg-[var(--color-gsp-surface-muted)] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search applicants, institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[var(--color-gsp-text-secondary)]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-[var(--color-gsp-border-default)] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="max-h-[600px] overflow-x-auto overflow-y-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="bg-[var(--color-gsp-surface-raised)] sticky top-0 z-10 shadow-[var(--shadow-1)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Specialization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider bg-[var(--color-gsp-surface-raised)] whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-gsp-surface-muted)] divide-y divide-gray-200">
            {filteredApplications?.map((app) => (
              <tr key={app.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--color-gsp-text-primary)]">{app.full_name}</div>
                  <div className="text-sm text-[var(--color-gsp-text-secondary)]">{app.qualification}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">
                  {app.institution}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">
                  {app.specialization}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">
                  <div className="flex flex-col gap-1">
                    {app.documents?.document_link ? (
                      <a href={app.documents.document_link} target="_blank" rel="noreferrer" className="text-[var(--color-gsp-text-inverse)] hover:text-indigo-900 font-medium">CV/Doc Link</a>
                    ) : (
                      <span className="text-[var(--color-gsp-text-secondary)] italic">No Document</span>
                    )}
                    {app.documents?.additional_link && (
                      <a href={app.documents.additional_link} target="_blank" rel="noreferrer" className="text-[var(--color-gsp-text-inverse)] hover:text-indigo-900 text-xs">Additional Link</a>
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
                  <ApplicationActionButtons applicationId={app.id} currentStatus={app.status} />
                </td>
              </tr>
            ))}
            {(!filteredApplications || filteredApplications.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-[var(--color-gsp-text-secondary)]">
                  No applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
