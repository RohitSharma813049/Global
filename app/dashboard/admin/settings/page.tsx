'use client'

import React, { useState, useEffect } from 'react'
import { updateHomepageSettings, getHomepageSettings } from '@/app/actions/cms'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'

const ImageUpload = dynamic(() => import('@/components/image-upload'), { 
  ssr: false, 
  loading: () => <div className="h-32 w-full bg-gray-100 rounded-lg animate-pulse border-2 border-dashed border-gray-200"></div> 
})

export default function HomepageSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    hero_title: '',
    hero_subtitle: '',
    hero_eyebrow: '',
    hero_image_url: '',
    show_home_hero: true,
    stats_title: '',
    stats_subtitle: '',
    featured_title: '',
    featured_subtitle: '',
    featured_content_gsp_title: '',
    featured_content_gsp_subtitle: '',
    categories_title: '',
    categories_subtitle: '',
    explore_categories_gsp_title: '',
    explore_categories_gsp_subtitle: '',
    subject_categories_gsp_title: '',
    subject_categories_gsp_subtitle: '',
    how_it_works_title: '',
    how_it_works_subtitle: '',
    scholars_title: '',
    scholars_subtitle: '',
    featured_scholars_gsp_title: '',
    featured_scholars_gsp_subtitle: '',
    testimonials_title: '',
    testimonials_subtitle: '',
    cta_title: '',
    cta_subtitle: '',
    show_stats_section: true,
    show_categories_section: true,
    show_featured_content: true,
    show_featured_scholars: true,
    show_testimonials: true,
    show_faq_section: true,
    show_explore_categories_gsp: true,
    show_subject_categories_gsp: true,
    show_featured_content_gsp: true,
    show_how_it_works: true,
    show_featured_scholars_gsp: true,
    show_cta_banner: true,
    enable_carousel_autoplay: true,
    faq_title: '',
    faq_subtitle: '',
    faqs: [] as { question: string; answer: string }[],
    explore_categories: [] as { title: string; count: string; image: string; link: string }[],
    subject_categories: [] as { id: string; name: string; image: string }[],
    hero_slides: [] as any[],
    hero_ticker_items: [] as any[],
    hero_search_filters: [] as string[],
    hero_trust_avatars: [] as string[],
    hero_stats: [] as any[],
    hero_search_placeholder: '',
    hero_top_pill: '',
    hero_cta_primary_text: '',
    hero_cta_secondary_text: '',
    hero_trust_text: '',
    featured_publications: [] as any[],
    how_it_works_steps: [] as { title: string; description: string }[],
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

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...(settings.faqs || [])]
    if (!newFaqs[index]) newFaqs[index] = { question: '', answer: '' }
    newFaqs[index][field] = value
    setSettings(prev => ({ ...prev, faqs: newFaqs }))
  }

  const handleExploreChange = (index: number, field: string, value: string) => {
    const newCats = [...(settings.explore_categories || [])]
    if (!newCats[index]) newCats[index] = { title: '', count: '', image: '', link: '' }
    newCats[index] = { ...newCats[index], [field]: value } as any
    setSettings(prev => ({ ...prev, explore_categories: newCats }))
  }

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const newCats = [...(settings.subject_categories || [])]
    if (!newCats[index]) newCats[index] = { id: '', name: '', image: '' }
    newCats[index] = { ...newCats[index], [field]: value } as any
    setSettings(prev => ({ ...prev, subject_categories: newCats }))
  }

  const handleHeroSlideChange = (index: number, field: string, value: string) => {
    const newSlides = [...(settings.hero_slides || [])]
    if (!newSlides[index]) newSlides[index] = {}
    newSlides[index] = { ...newSlides[index], [field]: value }
    setSettings(prev => ({ ...prev, hero_slides: newSlides }))
  }

  const handleHeroTickerChange = (index: number, field: string, value: string) => {
    const newTicker = [...(settings.hero_ticker_items || [])]
    if (!newTicker[index]) newTicker[index] = {}
    newTicker[index] = { ...newTicker[index], [field]: value }
    setSettings(prev => ({ ...prev, hero_ticker_items: newTicker }))
  }

  const handleHeroStatChange = (index: number, field: string, value: string) => {
    const newStats = [...(settings.hero_stats || [])]
    if (!newStats[index]) newStats[index] = {}
    newStats[index] = { ...newStats[index], [field]: value }
    setSettings(prev => ({ ...prev, hero_stats: newStats }))
  }

  const handleHeroSearchFilterChange = (value: string) => {
    const filtersArray = value.split(',').map(s => s.trim()).filter(Boolean);
    setSettings(prev => ({ ...prev, hero_search_filters: filtersArray }))
  }

  const handleHeroTrustAvatarChange = (index: number, value: string) => {
    const newAvatars = [...(settings.hero_trust_avatars || [])]
    newAvatars[index] = value
    setSettings(prev => ({ ...prev, hero_trust_avatars: newAvatars }))
  }

  const handlePubChange = (index: number, field: string, value: string) => {
    const newPubs = [...(settings.featured_publications || [])]
    if (!newPubs[index]) newPubs[index] = {}
    newPubs[index] = { ...newPubs[index], [field]: value }
    setSettings(prev => ({ ...prev, featured_publications: newPubs }))
  }

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...(settings.how_it_works_steps || [])]
    if (!newSteps[index]) newSteps[index] = { title: '', description: '' }
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSettings(prev => ({ ...prev, how_it_works_steps: newSteps }))
  }

  
  const addHeroSlide = () => setSettings(prev => ({ ...prev, hero_slides: [...(prev.hero_slides || []), {}] }))
  const removeHeroSlide = (index: number) => setSettings(prev => ({ ...prev, hero_slides: (prev.hero_slides || []).filter((_, i) => i !== index) }))

  const addHeroTicker = () => setSettings(prev => ({ ...prev, hero_ticker_items: [...(prev.hero_ticker_items || []), {}] }))
  const removeHeroTicker = (index: number) => setSettings(prev => ({ ...prev, hero_ticker_items: (prev.hero_ticker_items || []).filter((_, i) => i !== index) }))

  const addHeroTrustAvatar = () => setSettings(prev => ({ ...prev, hero_trust_avatars: [...(prev.hero_trust_avatars || []), ''] }))
  const removeHeroTrustAvatar = (index: number) => setSettings(prev => ({ ...prev, hero_trust_avatars: (prev.hero_trust_avatars || []).filter((_, i) => i !== index) }))

  const addHeroStat = () => setSettings(prev => ({ ...prev, hero_stats: [...(prev.hero_stats || []), {}] }))
  const removeHeroStat = (index: number) => setSettings(prev => ({ ...prev, hero_stats: (prev.hero_stats || []).filter((_, i) => i !== index) }))

  const addExploreCategory = () => setSettings(prev => ({ ...prev, explore_categories: [...(prev.explore_categories || []), { title: '', count: '', image: '', link: '' }] }))
  const removeExploreCategory = (index: number) => setSettings(prev => ({ ...prev, explore_categories: (prev.explore_categories || []).filter((_, i) => i !== index) }))

  const addSubjectCategory = () => setSettings(prev => ({ ...prev, subject_categories: [...(prev.subject_categories || []), { id: '', name: '', image: '' }] }))
  const removeSubjectCategory = (index: number) => setSettings(prev => ({ ...prev, subject_categories: (prev.subject_categories || []).filter((_, i) => i !== index) }))

  const addFeaturedPub = () => setSettings(prev => ({ ...prev, featured_publications: [...(prev.featured_publications || []), {}] }))
  const removeFeaturedPub = (index: number) => setSettings(prev => ({ ...prev, featured_publications: (prev.featured_publications || []).filter((_, i) => i !== index) }))

  const addStep = () => setSettings(prev => ({ ...prev, how_it_works_steps: [...(prev.how_it_works_steps || []), { title: '', description: '' }] }))
  const removeStep = (index: number) => setSettings(prev => ({ ...prev, how_it_works_steps: (prev.how_it_works_steps || []).filter((_, i) => i !== index) }))

  const addFaq = () => {
    setSettings(prev => ({ ...prev, faqs: [...(prev.faqs || []), { question: '', answer: '' }] }))
  }

  const removeFaq = (index: number) => {
    setSettings(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }))
  }

  if (loading) return (
    <div className="p-4 md:p-6 w-full max-w-4xl mx-auto animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-10 bg-gray-100 rounded"></div>
              <div className="h-10 bg-gray-100 rounded"></div>
              <div className="md:col-span-2 h-24 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
              <input aria-label="Input field" type="text" name="hero_title" value={settings.hero_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Eyebrow (Small text above title)</label>
              <input aria-label="Input field" type="text" name="hero_eyebrow" value={settings.hero_eyebrow || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle || ''} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Hero Text & Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Search Placeholder</label>
                  <input type="text" name="hero_search_placeholder" value={settings.hero_search_placeholder || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Search Filters (Comma separated)</label>
                  <input type="text" value={(settings.hero_search_filters || []).join(', ')} onChange={(e) => handleHeroSearchFilterChange(e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" placeholder="All, Articles, eBooks, Theses, Magazines, Scholars" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Top Pill Label (Over the images)</label>
                  <input type="text" name="hero_top_pill" value={settings.hero_top_pill || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Primary CTA Button</label>
                  <input type="text" name="hero_cta_primary_text" value={settings.hero_cta_primary_text || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Secondary CTA Button</label>
                  <input type="text" name="hero_cta_secondary_text" value={settings.hero_cta_secondary_text || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Trust Text (HTML allowed)</label>
                  <input type="text" name="hero_trust_text" value={settings.hero_trust_text || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Ticker & Stats */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Hero Extra Elements (Ticker, Stats, Trust Avatars)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-8">
              
              {/* Ticker */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Top Ticker Items ({settings.hero_ticker_items?.length || 0} Items)</h3>
                <div className="space-y-4">
                  {(settings.hero_ticker_items || []).map((item, index) => (
                    <div key={index} className="grid grid-cols-[100px_1fr] gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Prefix</label>
                        <input type="text" value={item.prefix || ''} onChange={(e) => handleHeroTickerChange(index, 'prefix', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Text</label>
                        <input type="text" value={item.text || ''} onChange={(e) => handleHeroTickerChange(index, 'text', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Avatars */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Trust Avatars ({settings.hero_trust_avatars?.length || 0} Images)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(settings.hero_trust_avatars || []).map((avatar, index) => (
                    <div key={index}>
                      <ImageUpload label={`Avatar ${index + 1}`} value={avatar || ''} onChange={(url) => handleHeroTrustAvatarChange(index, url)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Bottom Stats Bar ({settings.hero_stats?.length || 0} Stats)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(settings.hero_stats || []).map((stat, index) => (
                    <div key={index} className="space-y-3 relative border p-3 rounded-lg">
                      <button type="button" onClick={() => removeHeroStat(index)} className="absolute -top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Number</label>
                        <input type="text" value={stat.number || ''} onChange={(e) => handleHeroStatChange(index, 'number', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                        <input type="text" value={stat.label || ''} onChange={(e) => handleHeroStatChange(index, 'label', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </details>
        </div>

        {/* Explore Categories */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Explore Categories ({settings.explore_categories?.length || 0} Formats)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input type="text" name="explore_categories_gsp_title" value={settings.explore_categories_gsp_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input type="text" name="explore_categories_gsp_subtitle" value={settings.explore_categories_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              {(settings.explore_categories || []).map((cat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <button type="button" onClick={() => removeExploreCategory(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Format {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title (HTML allowed)</label>
                      <input aria-label="Input field" type="text" value={cat.title} onChange={(e) => handleExploreChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Count Text</label>
                      <input aria-label="Input field" type="text" value={cat.count} onChange={(e) => handleExploreChange(index, 'count', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
                      <input aria-label="Input field" type="text" value={cat.link} onChange={(e) => handleExploreChange(index, 'link', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload 
                        label="Background Image"
                        value={cat.image} 
                        onChange={(url) => handleExploreChange(index, 'image', url)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Subject Categories */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Subject Categories ({settings.subject_categories?.length || 0} Disciplines)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input type="text" name="subject_categories_gsp_title" value={settings.subject_categories_gsp_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input type="text" name="subject_categories_gsp_subtitle" value={settings.subject_categories_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              {(settings.subject_categories || []).map((cat, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <button type="button" onClick={() => removeSubjectCategory(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Category {index + 1}: {cat.id}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name (HTML allowed)</label>
                      <input aria-label="Input field" type="text" value={cat.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload 
                        label="Background Image"
                        value={cat.image} 
                        onChange={(url) => handleSubjectChange(index, 'image', url)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Hero Slides */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Hero Carousel Slides ({settings.hero_slides?.length || 0} Slides)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              {(settings.hero_slides || []).map((slide, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <button type="button" onClick={() => removeHeroSlide(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Slide {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label (e.g. Featured Article)</label>
                      <input type="text" value={slide.label || ''} onChange={(e) => handleHeroSlideChange(index, 'label', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Badge (e.g. eBook)</label>
                      <input type="text" value={slide.badge || ''} onChange={(e) => handleHeroSlideChange(index, 'badge', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input type="text" value={slide.title || ''} onChange={(e) => handleHeroSlideChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Author Name</label>
                      <input type="text" value={slide.author || ''} onChange={(e) => handleHeroSlideChange(index, 'author', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Credentials (e.g. Ph.D.)</label>
                      <input type="text" value={slide.cred || ''} onChange={(e) => handleHeroSlideChange(index, 'cred', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload label="Author Avatar Image" value={slide.avatar || ''} onChange={(url) => handleHeroSlideChange(index, 'avatar', url)} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload label="Slide Background Image" value={slide.image || ''} onChange={(url) => handleHeroSlideChange(index, 'image', url)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Featured Publications */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Featured Publications ({settings.featured_publications?.length || 0} Cards)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input type="text" name="featured_content_gsp_title" value={settings.featured_content_gsp_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input type="text" name="featured_content_gsp_subtitle" value={settings.featured_content_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              {(settings.featured_publications || []).map((pub, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <button type="button" onClick={() => removeFeaturedPub(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Publication {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type (e.g. Thesis)</label>
                      <input type="text" value={pub.type || ''} onChange={(e) => handlePubChange(index, 'type', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                      <input type="text" value={pub.subject || ''} onChange={(e) => handlePubChange(index, 'subject', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input type="text" value={pub.title || ''} onChange={(e) => handlePubChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea value={pub.desc || ''} onChange={(e) => handlePubChange(index, 'desc', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" rows={2} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Author</label>
                      <input type="text" value={pub.author || ''} onChange={(e) => handlePubChange(index, 'author', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Views Text</label>
                      <input type="text" value={pub.views || ''} onChange={(e) => handlePubChange(index, 'views', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload label="Author Avatar" value={pub.authorImg || ''} onChange={(url) => handlePubChange(index, 'authorImg', url)} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <ImageUpload label="Publication Cover Image" value={pub.img || ''} onChange={(url) => handlePubChange(index, 'img', url)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* How It Works Steps */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              How It Works Steps ({settings.how_it_works_steps?.length || 0} Steps)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input type="text" name="how_it_works_title" value={settings.how_it_works_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input type="text" name="how_it_works_subtitle" value={settings.how_it_works_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              {(settings.how_it_works_steps || []).map((step, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                  <button type="button" onClick={() => removeStep(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2">Step {index + 1}</h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input type="text" value={step.title || ''} onChange={(e) => handleStepChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <textarea value={step.description || ''} onChange={(e) => handleStepChange(index, 'description', e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" rows={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Frequently Asked Questions (FAQs)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input type="text" name="faq_title" value={settings.faq_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                  <input type="text" name="faq_subtitle" value={settings.faq_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button type="button" onClick={addFaq} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-indigo-100">
                  + Add FAQ
                </button>
              </div>
          
          <div className="space-y-4">
            {(settings.faqs || []).map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium">
                  Remove
                </button>
                <div className="space-y-3 pr-12">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Question</label>
                    <input aria-label="Input field" type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" placeholder="e.g. What is this?" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Answer</label>
                    <textarea aria-label="Input field" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} className="w-full border border-gray-300 rounded-md p-1.5 text-sm min-h-[60px]" placeholder="Answer goes here..." />
                  </div>
                </div>
              </div>
            ))}
            {!(settings.faqs?.length) && (
              <p className="text-sm text-gray-500 italic">No FAQs added yet.</p>
            )}
            </div>
          </div>
          </details>
        </div>

        {/* Other Sections (Titles Only) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-gray-50 font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Other Sections Headings (Testimonials, Scholars, etc.)
              <span className="text-sm text-gray-500 font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-gray-500 font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><h3 className="font-semibold text-gray-800 border-b pb-1">GSP Featured Scholars</h3></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="featured_scholars_gsp_title" value={settings.featured_scholars_gsp_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" name="featured_scholars_gsp_subtitle" value={settings.featured_scholars_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-gray-800 border-b pb-1">Testimonials</h3></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="testimonials_title" value={settings.testimonials_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" name="testimonials_subtitle" value={settings.testimonials_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-gray-800 border-b pb-1">CTA Banner</h3></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="cta_title" value={settings.cta_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" name="cta_subtitle" value={settings.cta_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-gray-800 border-b pb-1">Platform Metrics (Stats Bar)</h3></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" name="stats_title" value={settings.stats_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" name="stats_subtitle" value={settings.stats_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 border-b pb-1">Legacy Sections</h3>
                  <p className="text-sm text-gray-500 mt-1">These settings are for older sections that might not be visible on the new home page.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Featured Content Title</label>
                  <input type="text" name="featured_title" value={settings.featured_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Featured Content Subtitle</label>
                  <input type="text" name="featured_subtitle" value={settings.featured_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Categories Title</label>
                  <input type="text" name="categories_title" value={settings.categories_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Categories Subtitle</label>
                  <input type="text" name="categories_subtitle" value={settings.categories_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Scholars Title</label>
                  <input type="text" name="scholars_title" value={settings.scholars_title || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legacy Scholars Subtitle</label>
                  <input type="text" name="scholars_subtitle" value={settings.scholars_subtitle || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                </div>
              </div>

            </div>
          </details>
        </div>

        {/* Visibility Toggles */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_home_hero" checked={settings.show_home_hero ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Hero Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_explore_categories_gsp" checked={settings.show_explore_categories_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Explore Categories</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_subject_categories_gsp" checked={settings.show_subject_categories_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Subject Categories</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_content_gsp" checked={settings.show_featured_content_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show GSP Featured Content</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_how_it_works" checked={settings.show_how_it_works ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show How It Works</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_scholars_gsp" checked={settings.show_featured_scholars_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show GSP Featured Scholars</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_cta_banner" checked={settings.show_cta_banner ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show CTA Banner</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_stats_section" checked={settings.show_stats_section ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Statistics Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_categories_section" checked={settings.show_categories_section ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Icons/Categories Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_content" checked={settings.show_featured_content ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Featured Content (Carousel)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_featured_scholars" checked={settings.show_featured_scholars ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Featured Scholars (Carousel)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_testimonials" checked={settings.show_testimonials ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show Testimonials</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input aria-label="Input field" type="checkbox" name="show_faq_section" checked={settings.show_faq_section ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium">Show FAQ Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 bg-indigo-50/50 border-indigo-100">
              <input aria-label="Input field" type="checkbox" name="enable_carousel_autoplay" checked={settings.enable_carousel_autoplay ?? true} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="font-medium text-indigo-900">Enable Carousel Autoplay</span>
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
