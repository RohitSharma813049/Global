'use client'

import React, { useState, useEffect } from 'react'
import { getNews, createNews, updateNews, deleteNews } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'
import { MoreVertical, Trash2, Edit2 } from 'lucide-react'

export default function NewsManager() {
  const [newsList, setNewsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', cover_image: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

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
    if(!confirm('Delete this news item?')) return
    try {
      await deleteNews(id)
      toast.success('Deleted')
      loadNews()
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
              {newsList.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-(--color-gsp-text-primary) whitespace-normal min-w-62.5">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-(--color-gsp-text-secondary) truncate max-w-50">{item.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                    {new Date(item.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === item.id ? null : item.id);
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>

                      {openMenuId === item.id && (
                        <div 
                          className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => { 
                              setOpenMenuId(null); 
                              setFormData({ title: item.title, slug: item.slug, content: item.content, cover_image: item.cover_image || '' });
                              setEditingId(item.id);
                              setShowModal(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => { setOpenMenuId(null); handleDelete(item.id); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-xl max-w-2xl w-full p-6">
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea aria-label="Input field" rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border rounded-(--radius-lg) p-2" required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
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
