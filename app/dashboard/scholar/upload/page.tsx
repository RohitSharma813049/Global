'use client'

import React, { useState, useEffect } from 'react'
import { uploadPublication } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { useRouter } from 'next/navigation'
import { CategoryMultiSelect } from '@/components/category-multi-select'

export default function ScholarUploadPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const router = useRouter()

  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await uploadPublication(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard/scholar?upload_success=true')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Publication</h1>
        <p className="text-gray-600 mt-2">Submit your thesis, article, or eBook to the Global Scholar Publications platform. All submissions are reviewed by an administrator before publication and DOI generation.</p>
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
              <input aria-label="Input field" 
                type="text" 
                name="title" 
                id="title" 
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
              />
            </div>

            <div>
              <label htmlFor="content_type" className="block text-sm font-medium text-gray-700">Content Type</label>
              <select aria-label="Select field" 
                name="content_type" 
                id="content_type" 
                required
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
              <select aria-label="Select field" 
                name="category_id" 
                id="category_id" 
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategories (Select multiple or create new)</label>
              <CategoryMultiSelect 
                categories={categories} 
                onCategoriesUpdated={(newCat) => setCategories(prev => [...prev, newCat])} 
              />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700">Abstract / Summary</label>
              <textarea aria-label="Input field" 
                name="abstract" 
                id="abstract" 
                rows={6} 
                required 
                placeholder="Provide a comprehensive abstract of your publication..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload Document (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Upload a file</span>
                      <input aria-label="Input field" id="file" name="file" type="file" accept=".pdf" required className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 50MB</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Submit Publication'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
