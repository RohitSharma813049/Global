'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPublication, updatePublicationContent } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { MdArrowBack, MdSave, MdCheckCircle, MdOutlineCloudUpload } from 'react-icons/md'

export default function EditPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content_type: 'article',
    category_id: '',
    author_name: '',
    institution: '',
    email_address: '',
    doi: '',
    serial_number: '',
    status: 'published',
    file_url: '',
    cover_image: '',
    banner_image: '',
    video_url: '',
    originality_declaration: false,
    copyright_declaration: false,
    terms_acceptance: false,
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
        const pub = pubRes.data
        setFormData({
          title: pub.title || '',
          abstract: pub.abstract || '',
          content_type: pub.content_type || 'article',
          category_id: pub.category_id || '',
          author_name: pub.author_name || '',
          institution: pub.institution || '',
          email_address: pub.email_address || '',
          doi: pub.doi || '',
          serial_number: pub.serial_number || '',
          status: pub.status || 'draft',
          file_url: pub.file_url || '',
          cover_image: pub.cover_image || '',
          banner_image: pub.banner_image || '',
          video_url: pub.video_url || '',
          originality_declaration: !!pub.originality_declaration,
          copyright_declaration: !!pub.copyright_declaration,
          terms_acceptance: !!pub.terms_acceptance,
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
      category_id: formData.category_id || null,
      author_name: formData.author_name,
      institution: formData.institution,
      email_address: formData.email_address,
      doi: formData.doi || null,
      serial_number: formData.serial_number || null,
      status: formData.status,
      file_url: formData.file_url,
      cover_image: formData.cover_image || null,
      banner_image: formData.banner_image || null,
      video_url: formData.video_url || null,
      originality_declaration: formData.originality_declaration,
      copyright_declaration: formData.copyright_declaration,
      terms_acceptance: formData.terms_acceptance,
    })

    if (result.error) {
      toast.error(result.error)
      setSaving(false)
    } else {
      toast.success('Publication details saved successfully!')
      router.push('/dashboard/admin/publications')
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Loading publication details...</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Edit Publication</h1>
          <p className="text-sm text-gray-500 mt-1">
            Modify all metadata, author credentials, status, and file assets.
          </p>
        </div>
        <Link 
          href="/dashboard/admin/publications" 
          className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors w-fit"
        >
          <MdArrowBack className="mr-1.5 text-lg" /> Back to Pipeline
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Metadata */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Publication Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Enter publication title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Content Type *</label>
              <select 
                value={formData.content_type}
                onChange={e => setFormData({...formData, content_type: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm capitalize"
              >
                <option value="article">Research Article</option>
                <option value="thesis">Thesis</option>
                <option value="ebook">eBook</option>
                <option value="magazine">Magazine / Journal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Category</label>
              <select 
                value={formData.category_id}
                onChange={e => setFormData({...formData, category_id: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              >
                <option value="">-- Select Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Publication Status *</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                required
                className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-semibold text-purple-700"
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="changes_requested">Changes Requested</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Abstract / Summary *</label>
            <textarea 
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              rows={6} 
              required 
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Comprehensive summary or abstract..."
            />
          </div>
        </div>

        {/* Section 2: Author & Identifiers */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">
            Author Details & Indexing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Author Name</label>
              <input 
                type="text" 
                value={formData.author_name}
                onChange={e => setFormData({...formData, author_name: e.target.value})}
                placeholder="Dr. Jane Doe, Ph.D."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Institution</label>
              <input 
                type="text" 
                value={formData.institution}
                onChange={e => setFormData({...formData, institution: e.target.value})}
                placeholder="Oxford University"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Email Address</label>
              <input 
                type="email" 
                value={formData.email_address}
                onChange={e => setFormData({...formData, email_address: e.target.value})}
                placeholder="author@university.edu"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">DOI (Digital Object Identifier)</label>
              <input 
                type="text" 
                value={formData.doi}
                onChange={e => setFormData({...formData, doi: e.target.value})}
                placeholder="10.1000/182"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Serial Number / ISSN</label>
              <input 
                type="text" 
                value={formData.serial_number}
                onChange={e => setFormData({...formData, serial_number: e.target.value})}
                placeholder="GSP-2026-8812"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Document & Media Files */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">
            Files & Media URLs
          </h2>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Main Document / PDF File URL *</label>
            <input 
              type="url" 
              value={formData.file_url}
              onChange={e => setFormData({...formData, file_url: e.target.value})}
              required
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Cover Image URL</label>
              <input 
                type="url" 
                value={formData.cover_image}
                onChange={e => setFormData({...formData, cover_image: e.target.value})}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Banner Image URL</label>
              <input 
                type="url" 
                value={formData.banner_image}
                onChange={e => setFormData({...formData, banner_image: e.target.value})}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Video URL (mp4 / YouTube)</label>
              <input 
                type="url" 
                value={formData.video_url}
                onChange={e => setFormData({...formData, video_url: e.target.value})}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Declarations */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-3 border-gray-100">
            Declarations & Terms
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.originality_declaration}
                onChange={e => setFormData({...formData, originality_declaration: e.target.checked})}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Originality Declaration Confirmed</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.copyright_declaration}
                onChange={e => setFormData({...formData, copyright_declaration: e.target.checked})}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Copyright Transfer / Agreement Confirmed</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={formData.terms_acceptance}
                onChange={e => setFormData({...formData, terms_acceptance: e.target.checked})}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Platform Terms & Conditions Accepted</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/admin/publications"
            className="px-6 py-2.5 rounded-xl border border-gray-200 font-medium text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <MdSave className="mr-2 text-lg" />
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
