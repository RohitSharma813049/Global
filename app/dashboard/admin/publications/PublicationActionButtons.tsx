'use client'

import React, { useState } from 'react'
import { updatePublicationStatus, deletePublication } from '@/app/actions/publications'
import toast from 'react-hot-toast'
import { MoreVertical, CheckCircle, FileEdit, XCircle, Trash2, Undo2, PlayCircle, Edit } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

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
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'prompt' | 'confirm';
    statusAction: string;
    title: string;
    placeholder: string;
    required: boolean;
  }>({ isOpen: false, type: 'prompt', statusAction: '', title: '', placeholder: '', required: false })
  const [modalInput, setModalInput] = useState('')

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
    if (status === 'published') {
      setModalConfig({
        isOpen: true,
        type: 'prompt',
        statusAction: status,
        title: 'Publish Publication',
        placeholder: 'Assign a DOI for this publication (Optional, e.g. 10.1234/abc)',
        required: false
      })
      setModalInput('')
      return
    } else if (status === 'rejected') {
      setModalConfig({
        isOpen: true,
        type: 'prompt',
        statusAction: status,
        title: 'Reject Application',
        placeholder: 'Please explain why this application is being rejected...',
        required: true
      })
      setModalInput('')
      return
    } else if (status === 'changes_requested') {
      setModalConfig({
        isOpen: true,
        type: 'prompt',
        statusAction: status,
        title: 'Request Changes',
        placeholder: 'Please explain what changes are required...',
        required: true
      })
      setModalInput('')
      return
    }

    setLoading(true)
    await updatePublicationStatus(publicationId, status, '', '')
    setLoading(false)
  }

  const handleDelete = async () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      statusAction: 'delete',
      title: 'Are you sure you want to delete this publication?',
      placeholder: '',
      required: false
    })
  }

  const executeModalAction = async () => {
    if (modalConfig.type === 'prompt') {
      if (modalConfig.required && !modalInput.trim()) {
        toast.error('Input is required')
        return
      }
      setModalConfig(prev => ({ ...prev, isOpen: false }))
      setLoading(true)
      
      let doi = ''
      let reason = ''
      if (modalConfig.statusAction === 'published') doi = modalInput
      if (modalConfig.statusAction === 'rejected' || modalConfig.statusAction === 'changes_requested') reason = modalInput

      await updatePublicationStatus(publicationId, modalConfig.statusAction, doi, reason)
      setLoading(false)
    } else if (modalConfig.type === 'confirm' && modalConfig.statusAction === 'delete') {
      setModalConfig(prev => ({ ...prev, isOpen: false }))
      setLoading(true)
      const res = await deletePublication(publicationId)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Publication deleted')
      }
      setLoading(false)
    }
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
          <Link
            href={`/dashboard/admin/publications/${publicationId}/edit`}
            className="w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Publication
          </Link>

          {(currentStatus === 'pending' || currentStatus === 'submitted') && (
            <button
              onClick={() => { setShowMenu(false); handleUpdate('under_review'); }}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4" /> Start Review
            </button>
          )}

          {(currentStatus === 'pending' || currentStatus === 'submitted' || currentStatus === 'under_review' || currentStatus === 'changes_requested') && (
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
              onClick={() => { setShowMenu(false); handleUpdate('pending'); }}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" /> Move to Pending
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

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all flex flex-col">
            <div className="p-6 pb-2 relative">
              <button 
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6">{modalConfig.title}</h3>
              
              {modalConfig.type === 'prompt' && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {modalConfig.statusAction === 'published' ? 'Assign a DOI (Optional)' : 'Reason for Rejection (Required)'}
                  </label>
                  {modalConfig.statusAction === 'published' ? (
                    <input
                      type="text"
                      value={modalInput}
                      onChange={(e) => setModalInput(e.target.value)}
                      placeholder={modalConfig.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <textarea
                      value={modalInput}
                      onChange={(e) => setModalInput(e.target.value)}
                      placeholder={modalConfig.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-red-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      autoFocus
                    />
                  )}
                </div>
              )}
            </div>
            
            <div className="px-6 py-6 flex justify-center gap-4 mt-2">
              <button
                type="button"
                className="px-6 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none shadow-sm"
                onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl focus:outline-none shadow-sm ${
                  modalConfig.type === 'confirm' || modalConfig.statusAction === 'rejected' 
                    ? 'bg-red-400 hover:bg-red-500' 
                    : modalConfig.statusAction === 'changes_requested'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                onClick={executeModalAction}
              >
                {modalConfig.type === 'confirm' ? 'Confirm Delete' : modalConfig.statusAction === 'rejected' ? 'Confirm Rejection' : modalConfig.statusAction === 'changes_requested' ? 'Request Changes' : 'Confirm Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
