'use client'

import React, { useState, useEffect } from 'react'
import { getHomepageSettings, updateHomepageSettings } from '@/app/actions/cms'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/image-upload'
import toast from 'react-hot-toast'

export default function HomepageSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    stats_title: '',
    stats_subtitle: '',
    featured_title: '',
    featured_subtitle: '',
    categories_title: '',
    categories_subtitle: '',
    how_it_works_title: '',
    how_it_works_subtitle: '',
    scholars_title: '',
    scholars_subtitle: '',
    testimonials_title: '',
    testimonials_subtitle: '',
    show_stats_section: true,
    show_categories_section: true,
    show_featured_content: true,
    show_featured_scholars: true,
    show_testimonials: true,
  })

  useEffect(() => {
    async function load() {
      try {
        const data = await getHomepageSettings()
        setSettings(data)
      } catch (e: any) {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateHomepageSettings(settings)
      toast.success('Homepage settings updated!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setSettings(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setSettings(prev => ({ ...prev, [name]: value }))
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>

  return (
    <div className="p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Homepage Settings (CMS)</h1>
        <p className="text-gray-600 text-sm mt-1">Dynamically hide/show sections and update text on the public homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
        {/* Hero Section */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input aria-label="Input field" type="text" name="hero_title" value={settings.hero_title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div className="md:col-span-2">
              <ImageUpload 
                label="Hero Image (Upload or URL)"
                value={settings.hero_image_url} 
                onChange={(url) => setSettings({ ...settings, hero_image_url: url })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea aria-label="Input field" name="hero_subtitle" value={settings.hero_subtitle} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
          </div>
        </div>

        {/* Section Headings */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section Headings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">Platform Metrics</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="stats_subtitle" value={settings.stats_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="stats_title" value={settings.stats_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">Featured Content</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="featured_subtitle" value={settings.featured_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="featured_title" value={settings.featured_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">Categories</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="categories_subtitle" value={settings.categories_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="categories_title" value={settings.categories_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">How It Works</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="how_it_works_subtitle" value={settings.how_it_works_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="how_it_works_title" value={settings.how_it_works_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">Featured Scholars</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="scholars_subtitle" value={settings.scholars_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="scholars_title" value={settings.scholars_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-900 border-b pb-1">Testimonials</h3>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle (Small)</label>
                <input aria-label="Input field" type="text" name="testimonials_subtitle" value={settings.testimonials_subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Title</label>
                <input aria-label="Input field" type="text" name="testimonials_title" value={settings.testimonials_title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-semibold" />
              </div>
            </div>

          </div>
        </div>

        {/* Visibility Toggles */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_stats_section" checked={settings.show_stats_section} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Statistics Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_categories_section" checked={settings.show_categories_section} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Icons/Categories Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_content" checked={settings.show_featured_content} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Featured Content</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_scholars" checked={settings.show_featured_scholars} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Featured Scholars</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_testimonials" checked={settings.show_testimonials} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Testimonials</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-bold disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
