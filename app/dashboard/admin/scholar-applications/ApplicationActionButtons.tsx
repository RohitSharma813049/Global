'use client'

import React, { useState } from 'react'
import { updateApplicationStatus } from '@/app/actions/scholar-applications'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MoreVertical, CheckCircle, XCircle, Undo2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function ApplicationActionButtons({ applicationId, currentStatus }: { applicationId: string, currentStatus?: string }) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = async () => {
    setLoading(true)
    await updateApplicationStatus(applicationId, 'approved')
    setLoading(false)
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setLoading(true)
    await updateApplicationStatus(applicationId, 'rejected', rejectReason)
    setLoading(false)
    setIsRejectOpen(false)
    setRejectReason('')
  }

  const handleUnapprove = async () => {
    setLoading(true)
    await updateApplicationStatus(applicationId, 'pending')
    setLoading(false)
    setShowMenu(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
          {currentStatus === 'pending' && (
            <>
              <button
                onClick={() => { setShowMenu(false); handleApprove(); }}
                className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => { setShowMenu(false); setIsRejectOpen(true); }}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </>
          )}
          {(currentStatus === 'approved' || currentStatus === 'rejected') && (
            <button
              onClick={handleUnapprove}
              className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" /> Move to Pending
            </button>
          )}
        </div>
      )}

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Rejection (Required)
              </label>
              <textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 border rounded-md min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Please explain why this application is being rejected..."
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={loading || !rejectReason.trim()}>
                {loading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
