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

export default function ApplicationActionButtons({ applicationId }: { applicationId: string }) {
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

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => setIsRejectOpen(true)}
        disabled={loading}
        className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
      >
        Reject
      </button>

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
