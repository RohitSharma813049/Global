'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPublication, updatePublicationContent } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EditPublicationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content_type: '',
    category_id: ''
  })

  useEffect(() => {
    Promise.all([
      getPublication(params.id),
      getCategories()
    ]).then(([pubRes, catRes]) => {
      if (pubRes.error) {
        toast.error(pubRes.error)
      } else if (pubRes.data) {
        setFormData({
          title: pubRes.data.title || '',
          abstract: pubRes.data.abstract || '',
          content_type: pubRes.data.content_type || 'article',
          category_id: pubRes.data.category_id || ''
        })
      }
      setCategories(catRes || [])
      setLoading(false)
    }).catch(console.error)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const result = await updatePublicationContent(params.id, {
      title: formData.title,
      abstract: formData.abstract,
      content_type: formData.content_type,
      category_id: formData.category_id || null
    })

    if (result.error) {
      toast.error(result.error)
      setSaving(false)
    } else {
      toast.success('Publication content updated!')
      router.push('/dashboard/admin/publications')
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading publication details...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Publication</h1>
          <p className="text-gray-600 mt-1">Full control over publication content.</p>
        </div>
        <Link href="/dashboard/admin/publications" className="text-indigo-600 hover:text-indigo-800">
          Back to List
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <select 
                value={formData.content_type}
                onChange={e => setFormData({...formData, content_type: e.target.value})}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="thesis">Thesis</option>
                <option value="article">Research Article</option>
                <option value="ebook">eBook</option>
                <option value="magazine">Magazine / Journal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full p-2 border border-gray-300 bg-white rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">None</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
            <textarea 
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              rows={8} 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
