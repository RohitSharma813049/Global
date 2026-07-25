'use client'

import React, { useState, useEffect } from 'react'
import { getNews, createNews, updateNews, deleteNews, toggleNewsFeaturedStatus } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'
import { MoreVertical, Trash2, Edit2, Star, StarOff } from 'lucide-react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p>Loading Editor...</p> })

export default function NewsManager() {
  const [newsList, setNewsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', cover_image: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(newsList.length / itemsPerPage)
  const paginatedNews = newsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const data = await getNews()
      setNewsList(data)
    } catch (e: any) {
      toast.error('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNews() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateNews(editingId, formData)
        toast.success('News item updated!')
      } else {
        await createNews(formData)
        toast.success('News item created!')
      }
      setShowModal(false)
      setFormData({ title: '', slug: '', content: '', cover_image: '' })
      setEditingId(null)
      loadNews()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this news?')) return
    try {
      await deleteNews(id)
      toast.success('Deleted')
      loadNews()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      await toggleNewsFeaturedStatus(id, !currentStatus)
      toast.success(currentStatus ? 'News un-pinned' : 'News pinned!')
      setNewsList(newsList.map(n => n.id === id ? { ...n, is_featured: !currentStatus } : n))
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">News Manager</h1>
          <p className="text-(--color-gsp-text-secondary) text-sm mt-1">Manage platform announcements and news.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ title: '', slug: '', content: '', cover_image: '' })
            setEditingId(null)
            setShowModal(true)
          }}
          className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg) hover:bg-indigo-700"
        >
          + Add News Item
        </button>
      </div>

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow overflow-hidden border border-(--color-gsp-border-muted)">
        {loading ? (
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">Loading...</div>
        ) : newsList.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-(--color-gsp-surface-raised)">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-(--color-gsp-text-secondary) uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-(--color-gsp-surface-muted) divide-y divide-gray-200">
            {paginatedNews.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-(--color-gsp-text-primary) whitespace-normal min-w-62.5">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary) truncate max-w-50">{item.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                    {new Date(item.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleToggleFeature(item.id, !!item.is_featured); 
                        }}
                        className={`p-1.5 rounded-md transition-colors ${item.is_featured ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'}`}
                        title={item.is_featured ? "Unpin" : "Pin to Settings"}
                      >
                        {item.is_featured ? <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> : <StarOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          setFormData({ title: item.title, slug: item.slug, content: item.content, cover_image: item.cover_image || '' });
                          setEditingId(item.id);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleDelete(item.id); 
                        }}
                        className="p-1.5 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">No news found.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit News Item' : 'Create News Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input aria-label="Input field" type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-(--radius-lg) p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input aria-label="Input field" type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border rounded-(--radius-lg) p-2" required />
              </div>
              <div>
                <ImageUpload 
                  label="Cover Image (Upload or URL)"
                  value={formData.cover_image} 
                  onChange={url => setFormData({...formData, cover_image: url})} 
                  linksOnly={false}
                  hideLink={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <div className="bg-white rounded-(--radius-lg)">
                  <ReactQuill theme="snow" value={formData.content} onChange={val => setFormData({...formData, content: val})} className="h-64 mb-12" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-(--color-gsp-surface-muted) pb-2 border-t mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-(--color-gsp-text-secondary)">Cancel</button>
                <button type="submit" disabled={saving} className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg)">{saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
