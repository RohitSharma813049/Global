'use client'

import React, { useState, useEffect, use } from 'react'
import { updatePublicationContent, getPublication } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

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
  const [authorName, setAuthorName] = useState('')
  const [institution, setInstitution] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [doi, setDoi] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

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
        setAuthorName(pub.author_name || '')
        setInstitution(pub.institution || '')
        setEmailAddress(pub.email_address || '')
        setDoi(pub.doi || '')
        setFileUrl(pub.file_url || '')
        setCoverImage(pub.cover_image || '')
        setVideoUrl(pub.video_url || '')
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
        category_id: categoryId || null,
        author_name: authorName,
        institution,
        email_address: emailAddress,
        doi: doi || null,
        file_url: fileUrl,
        cover_image: coverImage || null,
        video_url: videoUrl || null,
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
    return <div className="p-6 text-center text-gray-500 font-medium">Loading publication data...</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Publication</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your publication details. Note: Editing a published document will revert it to draft status for re-approval.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-1">Publication Title *</label>
              <input 
                type="text" 
                name="title" 
                id="title" 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="content_type" className="block text-sm font-semibold text-gray-800 mb-1">Content Type *</label>
                <select 
                  name="content_type" 
                  id="content_type" 
                  required
                  value={contentType}
                  onChange={e => setContentType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 text-sm outline-none capitalize"
                >
                  <option value="article">Research Article</option>
                  <option value="thesis">Thesis</option>
                  <option value="ebook">eBook</option>
                  <option value="magazine">Magazine / Journal</option>
                </select>
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
                <select 
                  name="category_id" 
                  id="category_id" 
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="author_name" className="block text-sm font-semibold text-gray-800 mb-1">Author Name</label>
                <input 
                  type="text" 
                  id="author_name" 
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none" 
                />
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-semibold text-gray-800 mb-1">Institution</label>
                <input 
                  type="text" 
                  id="institution" 
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none" 
                />
              </div>

              <div>
                <label htmlFor="email_address" className="block text-sm font-semibold text-gray-800 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email_address" 
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="doi" className="block text-sm font-semibold text-gray-800 mb-1">DOI (Digital Object Identifier)</label>
              <input 
                type="text" 
                id="doi" 
                value={doi}
                onChange={e => setDoi(e.target.value)}
                placeholder="10.1000/182"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm outline-none" 
              />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-semibold text-gray-800 mb-1">Abstract / Summary *</label>
              <ReactQuill 
                theme="snow" 
                value={abstract} 
                onChange={setAbstract} 
                className="bg-white rounded-xl mb-2 h-48 pb-12"
              />
            </div>

            <div>
              <label htmlFor="file_url" className="block text-sm font-semibold text-gray-800 mb-1">Document File URL *</label>
              <input 
                type="url" 
                id="file_url" 
                required
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-mono outline-none" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cover_image" className="block text-sm font-semibold text-gray-800 mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  id="cover_image" 
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-mono outline-none" 
                />
              </div>

              <div>
                <label htmlFor="video_url" className="block text-sm font-semibold text-gray-800 mb-1">Video URL</label>
                <input 
                  type="url" 
                  id="video_url" 
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-mono outline-none" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
