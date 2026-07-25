'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPublication, updatePublicationContent } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
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

  const resolvedParams = React.use(params)
  
  useEffect(() => {
    Promise.all([
      getPublication(resolvedParams.id),
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
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const result = await updatePublicationContent(resolvedParams.id, {
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

  if (loading) return <div className="p-8 text-center text-(--color-gsp-text-secondary)">Loading publication details...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-(--color-gsp-text-primary)">Edit Publication</h1>
          <p className="text-(--color-gsp-text-secondary) mt-1">Full control over publication content.</p>
        </div>
        <Link href="/dashboard/admin/publications" className="text-(--color-gsp-text-inverse) hover:text-indigo-800">
          Back to List
        </Link>
      </div>

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow border border-(--color-gsp-border-muted) p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
              className="w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Content Type</label>
              <select 
                value={formData.content_type}
                onChange={e => setFormData({...formData, content_type: e.target.value})}
                required
                className="w-full p-2 border border-(--color-gsp-border-default) bg-(--color-gsp-surface-muted) rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="thesis">Thesis</option>
                <option value="article">Research Article</option>
                <option value="ebook">eBook</option>
                <option value="magazine">Magazine / Journal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Category</label>
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full p-2 border border-(--color-gsp-border-default) bg-(--color-gsp-surface-muted) rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">None</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Abstract</label>
            <textarea 
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              rows={8} 
              required 
              className="w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-(--color-gsp-border-muted)">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-(--color-gsp-text-inverse) text-white rounded font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
