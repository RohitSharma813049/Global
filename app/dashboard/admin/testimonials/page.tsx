'use client'

import React, { useState, useEffect } from 'react'
import { getTestimonials, createTestimonial, deleteTestimonial } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'

export default function TestimonialsManager() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newItem, setNewItem] = useState({ quote: '', author: '', role: '', rating: 5, image: '' })
  const [saving, setSaving] = useState(false)

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await getTestimonials()
      setItems(data)
    } catch (e: any) {
      toast.error('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createTestimonial(newItem)
      toast.success('Testimonial added!')
      setShowModal(false)
      setNewItem({ quote: '', author: '', role: '', rating: 5, image: '' })
      loadItems()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this testimonial?')) return
    try {
      await deleteTestimonial(id)
      toast.success('Deleted')
      loadItems()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Testimonials / Success Stories</h1>
          <p className="text-gray-600 text-sm mt-1">Manage scholar testimonials for the homepage.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : items.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && (
                        <img src={item.image} alt="" className="h-10 w-10 rounded-full mr-3 object-cover" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{item.author}</div>
                        <div className="text-sm text-gray-500">{item.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{item.quote}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.rating}/5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-500">No testimonials found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author Name</label>
                  <input aria-label="Input field" type="text" value={newItem.author} onChange={e => setNewItem({...newItem, author: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role / Designation</label>
                  <input aria-label="Input field" type="text" value={newItem.role} onChange={e => setNewItem({...newItem, role: e.target.value})} className="w-full border rounded-lg p-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quote</label>
                <textarea aria-label="Input field" rows={3} value={newItem.quote} onChange={e => setNewItem({...newItem, quote: e.target.value})} className="w-full border rounded-lg p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <input aria-label="Input field" type="number" min="1" max="5" value={newItem.rating} onChange={e => setNewItem({...newItem, rating: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" required />
              </div>
              <div>
                <ImageUpload 
                  label="Author Photo (Upload or URL)"
                  value={newItem.image} 
                  onChange={url => setNewItem({...newItem, image: url})} 
                />
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
