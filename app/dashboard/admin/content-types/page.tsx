'use client'

import React, { useState, useEffect } from 'react'
import { getContentTypes, createContentType, updateContentType, deleteContentType } from '@/app/actions/taxonomy'
import { MdEdit, MdDelete } from 'react-icons/md'
import * as LucideIcons from 'lucide-react'
import toast from 'react-hot-toast'

interface ContentType {
  id: string
  name: string
  slug: string
  icon_name: string
}

export default function ContentTypesAdminPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', icon_name: 'FileText' })

  const fetchContentTypes = async () => {
    try {
      setLoading(true)
      const data = await getContentTypes()
      setContentTypes(data || [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContentTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await updateContentType(isEditing, formData.name, formData.slug, formData.icon_name)
        toast.success("Content Type updated!")
      } else {
        await createContentType(formData.name, formData.slug, formData.icon_name)
        toast.success("Content Type created!")
      }
      setFormData({ name: '', slug: '', icon_name: 'FileText' })
      setIsEditing(null)
      fetchContentTypes()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content type?')) return
    try {
      await deleteContentType(id)
      toast.success("Content Type deleted!")
      fetchContentTypes()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleEdit = (ct: ContentType) => {
    setIsEditing(ct.id)
    setFormData({ name: ct.name, slug: ct.slug, icon_name: ct.icon_name })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Manage Content Types</h1>
        <p className="text-gray-600">Create and edit the types of content available in the system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Content Type' : 'Add Content Type'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                placeholder="e.g. Journal Article"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required 
                placeholder="e.g. journal-article"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name (Lucide React)</label>
              <input 
                type="text" 
                value={formData.icon_name} 
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                required 
                placeholder="e.g. FileText, BookOpen"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Check lucide.dev/icons for names.</p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700">
                {isEditing ? 'Save Changes' : 'Add Type'}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', slug: '', icon_name: 'FileText' }) }} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading content types...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contentTypes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No content types found.</div>
              ) : (
                contentTypes.map(ct => {
                  const Icon = (LucideIcons as any)[ct.icon_name] || LucideIcons.FileQuestion
                  return (
                    <div key={ct.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{ct.name}</div>
                          <div className="text-sm text-gray-500">slug: {ct.slug} | icon: {ct.icon_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(ct)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <MdEdit />
                        </button>
                        <button onClick={() => handleDelete(ct.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
