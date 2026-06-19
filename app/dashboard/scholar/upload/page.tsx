'use client'

import React, { useState, useEffect } from 'react'
import { uploadPublication } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { useRouter } from 'next/navigation'
import { CategoryMultiSelect } from '@/components/category-multi-select'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function ScholarUploadPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [abstract, setAbstract] = useState('')
  const router = useRouter()

  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const checkSize = (file: File | null, label: string) => {
      if (file && file.size > MAX_SIZE) {
        throw new Error(`${label} exceeds the 5MB limit.`);
      }
    }

    try {
      checkSize(formData.get('file') as File, 'PDF Document');

      const result = await uploadPublication(formData)
      
      if (result.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/dashboard/scholar?upload_success=true')
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author_name" className="block text-sm font-medium text-gray-700">Author Name</label>
                <input aria-label="Author Name" 
                  type="text" 
                  name="author_name" 
                  id="author_name" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                />
              </div>
              <div>
                <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input aria-label="Email Address" 
                  type="email" 
                  name="email_address" 
                  id="email_address" 
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution / University Name</label>
              <input aria-label="Institution" 
                type="text" 
                name="institution" 
                id="institution" 
                required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
              />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-1">Abstract / Summary</label>
              <input type="hidden" name="abstract" value={abstract} />
              <ReactQuill 
                theme="snow" 
                value={abstract} 
                onChange={setAbstract} 
                className="bg-white rounded-md mb-2 h-48 pb-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="doi" className="block text-sm font-medium text-gray-700">DOI (Optional)</label>
                <input aria-label="DOI" 
                  type="text" 
                  name="doi" 
                  id="doi" 
                  placeholder="e.g. 10.1000/xyz123"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                />
              </div>
              <div>
                <label htmlFor="video_file" className="block text-sm font-medium text-gray-700">Main Video (Optional)</label>
                <input aria-label="Main Video Upload" 
                  type="file" 
                  name="video_file" 
                  id="video_file" 
                  accept="video/mp4,video/webm,video/ogg"
                  className="mt-1 block w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Cover / Public Photo</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="cover_image" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Add Public Photo</span>
                      <input aria-label="Input field" id="cover_image" name="cover_image" type="file" accept="image/*" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="banner_image" className="block text-sm font-medium text-gray-700">Banner Image (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="banner_image" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Add Banner Photo</span>
                      <input aria-label="Input field" id="banner_image" name="banner_image" type="file" accept="image/*" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700">Additional Photos (Gallery)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="gallery_images" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Add Photos</span>
                      <input aria-label="Input field" id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="gallery_videos" className="block text-sm font-medium text-gray-700">Additional Videos (Gallery)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="gallery_videos" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                      <span>Add Videos</span>
                      <input aria-label="Input field" id="gallery_videos" name="gallery_videos" type="file" accept="video/mp4,video/webm,video/ogg" multiple className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">MP4, WEBM up to 50MB each</p>
                </div>
              </div>
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
                      <span>Add Document</span>
                      <input aria-label="Input field" id="file" name="file" type="file" accept=".pdf,.docx,.epub" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOCX, EPUB up to 5MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="originality_declaration"
                    name="originality_declaration"
                    type="checkbox"
                    value="true"
                    required
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </div>
                <label htmlFor="originality_declaration" className="ms-2 text-sm font-medium text-gray-900">
                  I declare that this work is original and does not infringe upon any third-party rights.
                </label>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="copyright_declaration"
                    name="copyright_declaration"
                    type="checkbox"
                    value="true"
                    required
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </div>
                <label htmlFor="copyright_declaration" className="ms-2 text-sm font-medium text-gray-900">
                  I agree to the copyright terms of Global Scholar Publications.
                </label>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms_acceptance"
                    name="terms_acceptance"
                    type="checkbox"
                    value="true"
                    required
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </div>
                <label htmlFor="terms_acceptance" className="ms-2 text-sm font-medium text-gray-900">
                  I accept the Terms and Conditions of the platform.
                </label>
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
