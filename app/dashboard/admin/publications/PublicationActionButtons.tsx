'use client'

import React, { useState } from 'react'
import { updatePublicationStatus, deletePublication } from '@/app/actions/publications'
import toast from 'react-hot-toast'

export default function PublicationActionButtons({ 
  publicationId, 
  currentStatus 
}: { 
  publicationId: string, 
  currentStatus: string 
}) {
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status: string) => {
    setLoading(true)
    
    let doi = ''
    let reason = ''
    if (status === 'published') {
      const input = prompt("Assign a DOI for this publication (Optional):")
      if (input !== null) {
        doi = input
      } else {
        setLoading(false)
        return // User cancelled
      }
    } else if (status === 'rejected') {
      const input = prompt("Provide a reason for rejection (Required):")
      if (input !== null && input.trim() !== '') {
        reason = input
      } else {
        setLoading(false)
        toast?.error?.('Rejection reason is required') || alert('Rejection reason is required')
        return // User cancelled or didn't provide a reason
      }
    }

    await updatePublicationStatus(publicationId, status, doi, reason)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this publication?')) return
    setLoading(true)
    const res = await deletePublication(publicationId)
    if (res?.error) {
      toast?.error?.(res.error) || alert(res.error)
    } else {
      toast?.success?.('Publication deleted') || alert('Publication deleted')
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-end space-x-2">
      {currentStatus === 'submitted' && (
        <button
          onClick={() => handleUpdate('under_review')}
          disabled={loading}
          className="text-white bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700 px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50"
        >
          {loading ? '...' : 'Start Review'}
        </button>
      )}

      {(currentStatus === 'submitted' || currentStatus === 'under_review') && (
        <>
          <button
            onClick={() => handleUpdate('changes_requested')}
            disabled={loading}
            className="text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50"
          >
            Request Changes
          </button>
          <button
            onClick={() => handleUpdate('published')}
            disabled={loading}
            className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50"
          >
            Approve & Publish
          </button>
        </>
      )}

      <button
        onClick={() => handleUpdate('rejected')}
        disabled={loading}
        className="text-[var(--color-gsp-text-primary)] bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-xs font-medium border border-[var(--color-gsp-border-default)] disabled:opacity-50"
      >
        Reject
      </button>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs font-medium disabled:opacity-50 ml-2"
      >
        Delete
      </button>
    </div>
  )
}
