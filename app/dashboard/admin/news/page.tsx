'use client'

import React, { useState, useEffect } from 'react'
import { getNews, createNews, deleteNews } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'

export default function NewsManager() {
  const [newsList, setNewsList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({ title: '', slug: '', content: '', cover_image: '' })
  const [saving, setSaving] = useState(false)

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
      await createNews(newItem)
      toast.success('News item created!')
      setShowModal(false)
      setNewItem({ title: '', slug: '', content: '', cover_image: '' })
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
          <p className="text-gray-600 text-sm mt-1">Manage platform announcements and news.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add News Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : newsList.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsList.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No news found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create News Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input aria-label="Input field" type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full border rounded-lg p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input aria-label="Input field" type="text" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} className="w-full border rounded-lg p-2" required />
              </div>
              <div>
                <ImageUpload 
                  label="Cover Image (Upload or URL)"
                  value={newItem.cover_image} 
                  onChange={url => setNewItem({...newItem, cover_image: url})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea aria-label="Input field" rows={6} value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} className="w-full border rounded-lg p-2" required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">{saving ? 'Saving...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
