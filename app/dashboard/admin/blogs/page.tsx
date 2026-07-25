'use client'

import React, { useState, useEffect } from 'react'
import { getBlogs, createBlog, deleteBlog } from '@/app/actions/cms'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: '', slug: '', content: '', cover_image: '' })
  const [saving, setSaving] = useState(false)

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const data = await getBlogs()
      setBlogs(data)
    } catch (e: any) {
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBlogs() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createBlog(newBlog)
      toast.success('Blog created!')
      setShowModal(false)
      setNewBlog({ title: '', slug: '', content: '', cover_image: '' })
      loadBlogs()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this blog?')) return
    try {
      await deleteBlog(id)
      toast.success('Deleted')
      loadBlogs()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blogs Manager</h1>
          <p className="text-[var(--color-gsp-text-secondary)] text-sm mt-1">Manage platform blog posts.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[var(--color-gsp-text-inverse)] text-white px-4 py-2 rounded-[var(--radius-lg)] hover:bg-indigo-700"
        >
          + New Blog
        </button>
      </div>

      <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-lg)] shadow overflow-hidden border border-[var(--color-gsp-border-muted)]">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">Loading...</div>
        ) : blogs.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[var(--color-gsp-surface-raised)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--color-gsp-surface-muted)] divide-y divide-gray-200">
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-gsp-text-primary)]">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">{blog.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-gsp-text-secondary)]">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">No blogs found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-xl)] shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input aria-label="Input field" type="text" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full border rounded-[var(--radius-lg)] p-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input aria-label="Input field" type="text" value={newBlog.slug} onChange={e => setNewBlog({...newBlog, slug: e.target.value})} className="w-full border rounded-[var(--radius-lg)] p-2" required />
              </div>
              <div>
                <ImageUpload 
                  label="Cover Image (Upload or URL)"
                  value={newBlog.cover_image} 
                  onChange={url => setNewBlog({...newBlog, cover_image: url})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content (Markdown/Text)</label>
                <textarea aria-label="Input field" rows={6} value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full border rounded-[var(--radius-lg)] p-2" required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-[var(--color-gsp-text-secondary)]">Cancel</button>
                <button type="submit" disabled={saving} className="bg-[var(--color-gsp-text-inverse)] text-white px-4 py-2 rounded-[var(--radius-lg)]">{saving ? 'Saving...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
