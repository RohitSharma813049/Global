'use client'

import React, { useState } from 'react'
import { RecycleBinItem, restoreRecycleBinItem, permanentlyDeleteRecycleBinItem, emptyRecycleBin } from '@/app/actions/recycle-bin'
import toast from 'react-hot-toast'
import { 
  MdDeleteSweep, 
  MdRestore, 
  MdDeleteForever, 
  MdSearch, 
  MdLibraryBooks, 
  MdArticle, 
  MdNewspaper, 
  MdBookmark, 
  MdSchool, 
  MdPeople, 
  MdRefresh,
  MdInfoOutline
} from 'react-icons/md'
import { format, formatDistanceToNow } from 'date-fns'

interface RecycleBinClientProps {
  initialItems: RecycleBinItem[]
  initialCounts: Record<string, number>
}

export default function RecycleBinClient({ initialItems, initialCounts }: RecycleBinClientProps) {
  const [items, setItems] = useState<RecycleBinItem[]>(initialItems)
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts)
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'restore' | 'delete' | null>(null)
  const [isEmptying, setIsEmptying] = useState<boolean>(false)
  const [confirmEmptyModal, setConfirmEmptyModal] = useState<boolean>(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Recalculate counts locally after state updates
  const updateLocalCounts = (updatedItems: RecycleBinItem[]) => {
    const newCounts: Record<string, number> = {
      all: updatedItems.length,
      publication: 0,
      blog: 0,
      news: 0,
      magazine: 0,
      scholar: 0,
      user: 0,
    }
    updatedItems.forEach(item => {
      if (newCounts[item.type] !== undefined) {
        newCounts[item.type]++
      }
    })
    setCounts(newCounts)
  }

  // Filter items by tab and search query
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  // Handle Restore Item
  const handleRestore = async (id: string, type: string) => {
    setLoadingId(id)
    setActionType('restore')
    try {
      const res = await restoreRecycleBinItem(id, type)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Restored successfully!`)
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        updateLocalCounts(newItems)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore item')
    } finally {
      setLoadingId(null)
      setActionType(null)
    }
  }

  // Handle Permanent Delete Item
  const handlePermanentDelete = async (id: string, type: string) => {
    setLoadingId(id)
    setActionType('delete')
    try {
      const res = await permanentlyDeleteRecycleBinItem(id, type)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Permanently deleted!`)
        const newItems = items.filter(i => i.id !== id)
        setItems(newItems)
        updateLocalCounts(newItems)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete item')
    } finally {
      setLoadingId(null)
      setActionType(null)
      setConfirmDeleteId(null)
    }
  }

  // Handle Empty Recycle Bin
  const handleEmptyBin = async () => {
    setIsEmptying(true)
    try {
      const res = await emptyRecycleBin(activeTab === 'all' ? undefined : activeTab)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Recycle bin emptied!`)
        const newItems = activeTab === 'all' 
          ? [] 
          : items.filter(i => i.type !== activeTab)
        setItems(newItems)
        updateLocalCounts(newItems)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to empty bin')
    } finally {
      setIsEmptying(false)
      setConfirmEmptyModal(false)
    }
  }

  // Helper for Type Badges
  const getTypeBadge = (type: RecycleBinItem['type']) => {
    switch (type) {
      case 'publication':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <MdLibraryBooks className="mr-1 text-sm" /> Publication
          </span>
        )
      case 'blog':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MdArticle className="mr-1 text-sm" /> Blog Post
          </span>
        )
      case 'news':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <MdNewspaper className="mr-1 text-sm" /> News
          </span>
        )
      case 'magazine':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <MdBookmark className="mr-1 text-sm" /> Magazine
          </span>
        )
      case 'scholar':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
            <MdSchool className="mr-1 text-sm" /> Scholar
          </span>
        )
      case 'user':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <MdPeople className="mr-1 text-sm" /> User
          </span>
        )
    }
  }

  const tabOptions = [
    { id: 'all', label: 'All Items', count: counts.all || 0 },
    { id: 'publication', label: 'Publications', count: counts.publication || 0 },
    { id: 'blog', label: 'Blogs', count: counts.blog || 0 },
    { id: 'news', label: 'News', count: counts.news || 0 },
    { id: 'magazine', label: 'Magazines', count: counts.magazine || 0 },
    { id: 'scholar', label: 'Scholars', count: counts.scholar || 0 },
    { id: 'user', label: 'Users', count: counts.user || 0 },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-xs">
              <MdDeleteSweep className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                Recycle Bin
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  {counts.all || 0} items
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                View, restore, or permanently purge soft-deleted items across the platform.
              </p>
            </div>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setConfirmEmptyModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium text-sm hover:bg-red-700 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <MdDeleteForever className="text-lg mr-2" />
            Empty Recycle Bin
          </button>
        )}
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
          {tabOptions.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full lg:w-72">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search deleted items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Recycle Bin Content List */}
      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center my-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-4">
              <MdDeleteSweep className="text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {searchQuery ? 'No matching items found' : 'Recycle bin is empty'}
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              {searchQuery
                ? `No soft-deleted items match your search "${searchQuery}".`
                : 'Deleted publications, blogs, news, magazines, scholars, and users will appear here for easy restoration.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Item Details</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Deleted Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredItems.map(item => {
                    const isOperating = loadingId === item.id

                    return (
                      <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50/80 transition-colors">
                        {/* Title & Metadata */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-base line-clamp-1">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="text-xs text-gray-500 mt-0.5">
                                {item.subtitle}
                              </span>
                            )}
                            {item.author && (
                              <span className="text-xs font-medium text-gray-600 mt-1">
                                By {item.author}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getTypeBadge(item.type)}
                        </td>

                        {/* Deleted Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500">
                          <div>
                            {format(new Date(item.deleted_at), 'MMM d, yyyy · h:mm a')}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {formatDistanceToNow(new Date(item.deleted_at), { addSuffix: true })}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Restore Button */}
                            <button
                              onClick={() => handleRestore(item.id, item.type)}
                              disabled={isOperating}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-xs transition-all border border-emerald-200 cursor-pointer disabled:opacity-50"
                              title="Restore item back to active status"
                            >
                              {isOperating && actionType === 'restore' ? (
                                <MdRefresh className="animate-spin text-sm mr-1.5" />
                              ) : (
                                <MdRestore className="text-sm mr-1.5" />
                              )}
                              Restore
                            </button>

                            {/* Permanently Delete Button */}
                            <button
                              onClick={() => setConfirmDeleteId(item.id)}
                              disabled={isOperating}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium text-xs transition-all border border-red-200 cursor-pointer disabled:opacity-50"
                              title="Permanently remove from database"
                            >
                              {isOperating && actionType === 'delete' ? (
                                <MdRefresh className="animate-spin text-sm mr-1.5" />
                              ) : (
                                <MdDeleteForever className="text-sm mr-1.5" />
                              )}
                              Delete Forever
                            </button>
                          </div>

                          {/* Individual Item Confirmation Modal */}
                          {confirmDeleteId === item.id && (
                            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                              <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-left">
                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                  <MdDeleteForever className="text-2xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Permanently Delete?</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                  Are you sure you want to permanently delete <strong className="text-gray-900">{item.title}</strong>? This action cannot be undone.
                                </p>
                                <div className="mt-6 flex items-center justify-end gap-3">
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handlePermanentDelete(item.id, item.type)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs cursor-pointer"
                                  >
                                    Delete Permanently
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Empty Recycle Bin Confirmation Modal */}
      {confirmEmptyModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <MdDeleteSweep className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Empty Recycle Bin?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to permanently delete all {activeTab !== 'all' ? activeTab : ''} items in the recycle bin? All selected items will be erased from the system permanently.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmEmptyModal(false)}
                disabled={isEmptying}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyBin}
                disabled={isEmptying}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs flex items-center cursor-pointer disabled:opacity-50"
              >
                {isEmptying ? (
                  <>
                    <MdRefresh className="animate-spin text-lg mr-2" />
                    Purging...
                  </>
                ) : (
                  'Yes, Empty Bin'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
