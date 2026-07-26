'use client'

import React, { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory, getContentTypes } from '@/app/actions/taxonomy'
import { MdEdit, MdDelete, MdGridView, MdViewList, MdSearch } from 'react-icons/md'
import { MoreVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/image-upload'
import Pagination from '@/components/shared/pagination'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  content_types?: string[]
  image_url?: string | null
}

interface ContentType {
  id: string
  name: string
  slug: string
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // New States
  const [categoryType, setCategoryType] = useState<'parent' | 'sub'>('parent')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({ name: '', slug: '', parent_id: '', content_types: [] as string[], image_url: '' })
  const [isCustomSlug, setIsCustomSlug] = useState(false)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    if (!isCustomSlug) {
      const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      setFormData({ ...formData, name: newName, slug: newSlug })
    } else {
      setFormData({ ...formData, name: newName })
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const [data, ctData] = await Promise.all([getCategories(), getContentTypes()])
      setCategories(data || [])
      setContentTypes(ctData || [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()

    function handleClickOutside() {
      setOpenMenuId(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // If it's a parent category, we force parent_id to be empty
    const finalParentId = categoryType === 'parent' ? undefined : (formData.parent_id || undefined)

    if (categoryType === 'sub' && !finalParentId) {
      toast.error('Please select a parent category for the sub-category.')
      return
    }

    try {
      if (isEditing) {
        await updateCategory(isEditing, formData.name, formData.slug, finalParentId, formData.content_types, formData.image_url)
        toast.success("Category updated!")
      } else {
        await createCategory(formData.name, formData.slug, finalParentId, formData.content_types, formData.image_url)
        toast.success("Category created!")
      }
      setFormData({ name: '', slug: '', parent_id: '', content_types: [], image_url: '' })
      setIsEditing(null)
      setIsCustomSlug(false)
      fetchCategories()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      await deleteCategory(id)
      toast.success("Category deleted!")
      fetchCategories()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleEdit = (cat: Category) => {
    setIsEditing(cat.id)
    setCategoryType(cat.parent_id ? 'sub' : 'parent')
    setFormData({ name: cat.name, slug: cat.slug, parent_id: cat.parent_id || '', content_types: cat.content_types || [], image_url: cat.image_url || '' })
    setIsCustomSlug(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const parentCategories = categories.filter(c => !c.parent_id)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-(--color-gsp-text-primary)">Manage Categories</h1>
          <p className="text-(--color-gsp-text-secondary)">Create, edit, and organize domains and sub-domains.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-gsp-text-secondary)" size={20} />
            <input aria-label="Input field" 
              type="text" 
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-(--color-gsp-border-default) rounded-(--radius-lg) focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-(--radius-lg) border border-(--color-gsp-border-muted)">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-(--color-gsp-surface-muted) shadow text-(--color-gsp-text-inverse)' : 'text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary)'}`}
            >
              <MdViewList size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-(--color-gsp-surface-muted) shadow text-(--color-gsp-text-inverse)' : 'text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary)'}`}
            >
              <MdGridView size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-(--color-gsp-surface-muted) p-6 rounded-(--radius-xl) shadow border border-(--color-gsp-border-muted) h-fit">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Category' : 'Create Category'}</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-(--radius-lg) mb-6">
            <button 
              onClick={() => setCategoryType('parent')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${categoryType === 'parent' ? 'bg-(--color-gsp-surface-muted) shadow text-(--color-gsp-text-primary)' : 'text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary)'}`}
            >
              Parent Category
            </button>
            <button 
              onClick={() => setCategoryType('sub')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${categoryType === 'sub' ? 'bg-(--color-gsp-surface-muted) shadow text-(--color-gsp-text-primary)' : 'text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary)'}`}
            >
              Sub Category
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Name</label>
              <input aria-label="Input field" 
                type="text" 
                value={formData.name} 
                onChange={handleNameChange}
                required 
                className="w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-(--color-gsp-text-primary)">Slug</label>
                <button 
                  type="button" 
                  onClick={() => setIsCustomSlug(!isCustomSlug)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${isCustomSlug ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-(--color-gsp-text-secondary) hover:bg-gray-200'}`}
                >
                  {isCustomSlug ? 'Custom' : 'Auto'}
                </button>
              </div>
              <input aria-label="Input field" 
                type="text" 
                value={formData.slug} 
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                readOnly={!isCustomSlug}
                required 
                className={`w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none ${!isCustomSlug ? 'bg-(--color-gsp-surface-raised) text-(--color-gsp-text-secondary)' : ''}`}
              />
            </div>
            
            {categoryType === 'sub' && (
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Parent Category</label>
                <select aria-label="Select field" 
                  value={formData.parent_id} 
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-(--color-gsp-surface-muted)"
                  required
                >
                  <option value="" disabled>Select a Parent Category</option>
                  {parentCategories.filter(c => c.id !== isEditing).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Allowed Content Types (Optional)</label>
              <select aria-label="Select field" 
                multiple
                value={formData.content_types} 
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, content_types: options });
                }}
                className="w-full p-2 border border-(--color-gsp-border-default) rounded focus:ring-2 focus:ring-indigo-500 outline-none h-32"
              >
                {contentTypes.map(ct => (
                  <option key={ct.id} value={ct.slug}>{ct.name}</option>
                ))}
              </select>
              <p className="text-xs text-(--color-gsp-text-secondary) mt-1">Hold Ctrl/Cmd to select multiple. These types will be available when scholars upload to this category.</p>
            </div>
            
            <div className="mt-2">
              <ImageUpload 
                label="Background Image (Optional)"
                value={formData.image_url} 
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-(--color-gsp-text-inverse) text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors">
                {isEditing ? 'Save Changes' : (categoryType === 'parent' ? 'Create Parent Category' : 'Create Sub Category')}
              </button>
              {isEditing && (
                <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', slug: '', parent_id: '', content_types: [], image_url: '' }); setIsCustomSlug(false); }} className="flex-1 bg-gray-200 text-(--color-gsp-text-primary) py-2 rounded font-medium hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List/Grid View */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow border border-(--color-gsp-border-muted) p-8 text-center text-(--color-gsp-text-secondary)">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow border border-(--color-gsp-border-muted) p-8 text-center text-(--color-gsp-text-secondary)">
              {searchQuery ? 'No categories found matching your search.' : 'No categories found. Create one to get started!'}
            </div>
          ) : viewMode === 'list' ? (
            // LIST VIEW
            <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow border border-(--color-gsp-border-muted) overflow-hidden divide-y divide-gray-100">
              {paginatedCategories.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-(--color-gsp-surface-raised) transition-colors">
                  <div>
                    <div className="font-semibold text-(--color-gsp-text-primary) text-lg flex items-center gap-2">
                      {cat.name}
                      {!cat.parent_id ? (
                        <span className="text-2.5 uppercase tracking-wider font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Parent</span>
                      ) : (
                        <span className="text-2.5 uppercase tracking-wider font-bold bg-gray-100 text-(--color-gsp-text-secondary) px-2 py-0.5 rounded-full">Sub-category</span>
                      )}
                    </div>
                    
                    {cat.parent_id && (
                      <div className="text-sm text-(--color-gsp-text-inverse) font-medium mt-1">
                        ↳ Inside: {categories.find(c => c.id === cat.parent_id)?.name || 'Unknown'}
                      </div>
                    )}

                    <div className="text-sm text-(--color-gsp-text-secondary) mt-2 flex flex-wrap items-center gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-(--color-gsp-text-secondary) font-mono text-xs">/{cat.slug}</span>
                      {cat.content_types && cat.content_types.length > 0 && (
                        <span className="text-(--color-gsp-text-secondary)">|</span>
                      )}
                      {cat.content_types?.map(ct => (
                        <span key={ct} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-soft text-blue-700 border border-blue-100">
                          {contentTypes.find(t => t.slug === ct)?.name || ct}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cat.id ? null : cat.id);
                      }}
                      className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {openMenuId === cat.id && (
                      <div 
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { setOpenMenuId(null); handleEdit(cat); }}
                          className="w-full text-left px-4 py-2 text-sm text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-inverse) hover:bg-violet-soft flex items-center gap-2"
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => { setOpenMenuId(null); handleDelete(cat.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <MdDelete size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // GRID VIEW
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedCategories.map(cat => (
                <div key={cat.id} className="bg-(--color-gsp-surface-muted) p-5 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) hover:border-indigo-300 hover:shadow-(--shadow-2) transition-all group relative">
                  <div className="absolute top-4 right-4 relative inline-block text-left">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === cat.id ? null : cat.id);
                      }}
                      className={`p-1.5 rounded transition-colors ${openMenuId === cat.id ? 'opacity-100 bg-gray-100 text-gray-700' : 'opacity-0 group-hover:opacity-100 text-(--color-gsp-text-secondary) hover:bg-gray-100'}`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuId === cat.id && (
                      <div 
                        className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { setOpenMenuId(null); handleEdit(cat); }}
                          className="w-full text-left px-4 py-2 text-sm text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-inverse) hover:bg-violet-soft flex items-center gap-2"
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => { setOpenMenuId(null); handleDelete(cat.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <MdDelete size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {!cat.parent_id ? (
                    <span className="text-2.5 uppercase tracking-wider font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full inline-block mb-2">Parent Category</span>
                  ) : (
                    <span className="text-2.5 uppercase tracking-wider font-bold bg-gray-100 text-(--color-gsp-text-secondary) px-2 py-0.5 rounded-full inline-block mb-2">Sub Category</span>
                  )}
                  
                  <h3 className="text-xl font-bold text-(--color-gsp-text-primary) mb-1 pr-12 truncate">{cat.name}</h3>
                  <div className="text-xs text-(--color-gsp-text-secondary) font-mono bg-(--color-gsp-surface-raised) px-2 py-1 rounded inline-block mb-3 truncate max-w-full">
                    /{cat.slug}
                  </div>

                  {cat.parent_id && (
                    <div className="text-sm text-(--color-gsp-text-inverse) font-medium mb-3 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                      {categories.find(c => c.id === cat.parent_id)?.name || 'Unknown'}
                    </div>
                  )}

                  {cat.content_types && cat.content_types.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-(--color-gsp-border-muted)">
                      <p className="text-xs font-semibold text-(--color-gsp-text-secondary) mb-2 uppercase">Allowed Types</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.content_types.map(ct => (
                          <span key={ct} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-soft text-blue-700 border border-blue-100">
                            {contentTypes.find(t => t.slug === ct)?.name || ct}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {filteredCategories.length > 0 && (
            <div className="mt-6 bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCategories.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
