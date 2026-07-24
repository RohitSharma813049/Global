'use client'

import React, { useState, useEffect } from 'react'
import { updatePublicationContent, getPublication } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { use } from 'react'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function ScholarEditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [contentType, setContentType] = useState('thesis')
  const [categoryId, setCategoryId] = useState('')

  const router = useRouter()

  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(console.error)
    
    getPublication(id).then(result => {
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        const pub = result.data
        setTitle(pub.title || '')
        setAbstract(pub.abstract || '')
        setContentType(pub.content_type || 'thesis')
        setCategoryId(pub.category_id || '')
      }
      setFetching(false)
    }).catch(err => {
      setError(err.message)
      setFetching(false)
    })
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await updatePublicationContent(id, {
        title,
        abstract,
        content_type: contentType,
        category_id: categoryId || null
      })
      
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/dashboard/scholar/publications?edit_success=true')
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (fetching) {
    return <div className="p-6 text-center text-gray-500">Loading publication data...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Publication</h1>
        <p className="text-gray-600 mt-2">Update your publication details. Note: Editing a published document will revert it to draft status for re-approval.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Publication Title</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
              />
            </div>

            <div>
              <label htmlFor="content_type" className="block text-sm font-medium text-gray-700">Content Type</label>
              <select 
                name="content_type" 
                id="content_type" 
                required
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="thesis">Thesis</option>
                <option value="article">Research Article</option>
                <option value="ebook">eBook</option>
                <option value="magazine">Magazine / Journal</option>
              </select>
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
              <select 
                name="category_id" 
                id="category_id" 
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-1">Abstract / Summary</label>
              <ReactQuill 
                theme="snow" 
                value={abstract} 
                onChange={setAbstract} 
                className="bg-white rounded-md mb-2 h-48 pb-12"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
