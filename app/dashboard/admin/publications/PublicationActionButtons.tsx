'use client'

import React, { useState } from 'react'
import { updatePublicationStatus, deletePublication } from '@/app/actions/publications'
import toast from 'react-hot-toast'
import { MoreVertical, CheckCircle, FileEdit, XCircle, Trash2, Undo2, PlayCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function PublicationActionButtons({ 
  publicationId, 
  currentStatus 
}: { 
  publicationId: string, 
  currentStatus: string 
}) {
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        disabled={loading}
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
          {currentStatus === 'submitted' && (
            <button
              onClick={() => { setShowMenu(false); handleUpdate('under_review'); }}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" /> Start Review
            </button>
          )}

          {(currentStatus === 'submitted' || currentStatus === 'under_review') && (
            <>
              <button
                onClick={() => { setShowMenu(false); handleUpdate('changes_requested'); }}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
              >
                <FileEdit className="w-4 h-4" /> Request Changes
              </button>
              <button
                onClick={() => { setShowMenu(false); handleUpdate('published'); }}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Approve & Publish
              </button>
            </>
          )}

          {(currentStatus === 'published' || currentStatus === 'rejected') && (
            <button
              onClick={() => { setShowMenu(false); handleUpdate('submitted'); }}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" /> Move to Submitted
            </button>
          )}

          {currentStatus !== 'rejected' && (
            <button
              onClick={() => { setShowMenu(false); handleUpdate('rejected'); }}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
          )}

          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={() => { setShowMenu(false); handleDelete(); }}
            disabled={loading}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  )
}
