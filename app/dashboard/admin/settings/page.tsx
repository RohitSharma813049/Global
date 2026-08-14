'use client'

import React, { useState, useEffect } from 'react'
import { updateHomepageSettings, getHomepageSettings } from '@/app/actions/cms'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import RecordPicker, { RecordItem } from '@/components/shared/record-picker'
import { getPublishedPublications } from '@/app/actions/publications'
import { getBlogs, getNews, getAllScholarsForAdmin } from '@/app/actions/cms'

const ImageUpload = dynamic(() => import('@/components/image-upload'), { 
  ssr: false, 
  loading: () => <div className="h-32 w-full bg-gray-100 rounded-(--radius-lg) animate-pulse border-2 border-dashed border-(--color-gsp-border-muted)"></div> 
})

import 'react-quill-new/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p>Loading Editor...</p> })

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
    featured_content_gsp_desc: '',
    categories_title: '',
    categories_subtitle: '',
    explore_categories_gsp_title: '',
    explore_categories_gsp_subtitle: '',
    subject_categories_gsp_title: '',
    subject_categories_gsp_subtitle: '',
    subject_categories_gsp_desc: '',
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
    show_recent_blogs: true,
    show_cta_banner: true,
    enable_carousel_autoplay: true,
    enable_dynamic_hero_stats: false,
    faq_title: '',
    faq_subtitle: '',
    faqs: [] as { question: string; answer: string }[],
    explore_categories: [] as { title: string; count: string; image: string; link: string }[],
    subject_categories: [] as { id: string; name: string; image: string }[],
    enable_dynamic_subject_categories: false,
    hero_slides: [] as any[],
    hero_ticker_items: [] as any[],
    hero_search_filters: [] as string[],
    hero_trust_avatars: [] as string[],
    hero_stats: [] as any[],
    hero_search_placeholder: '',
    hero_top_pill: '',
    hero_carousel_mode: 'auto',
    hero_cta_primary_text: '',
    hero_cta_secondary_text: '',
    hero_trust_text: '',
    featured_publications: [] as any[],
    how_it_works_steps: [] as { title: string; description: string }[],
    featured_scholars_mode: 'manual' as 'manual' | 'dynamic',
    pinned_scholars: [] as any[],
    featured_blogs_mode: 'recent' as 'recent' | 'manual' | 'random',
    pinned_blogs: [] as any[],
    pinned_news: [] as any[],
    card_image_height_desktop: '280px',
    card_image_height_mobile: '280px',
    sync_mobile_card_size: true,
    pub_card_media_height_desktop: '180px',
    pub_card_media_height_mobile: '180px',
    scholar_card_media_height_desktop: '260px',
    scholar_card_media_height_mobile: '220px',
    sync_mobile_scholar_card_size: false,
  })

  const [recordOptions, setRecordOptions] = useState<RecordItem[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [data, pubs, scholars, blogs, news] = await Promise.all([
          getHomepageSettings(),
          getPublishedPublications(),
          getAllScholarsForAdmin(),
          getBlogs(),
          getNews()
        ])
        setSettings(data)

        const options: RecordItem[] = []
        if (pubs && Array.isArray(pubs)) {
          pubs.forEach((p: any) => options.push({
            id: p.id, title: p.title, subtitle: p.author_name || 'Publication', image: p.cover_image, type: 'Publication', originalData: p
          }))
        }
        if (scholars && Array.isArray(scholars)) {
          scholars.forEach((s: any) => {
            const name = s.users?.raw_user_meta_data?.name || s.users?.email?.split('@')[0] || 'Scholar'
            options.push({
              id: s.id, title: name, subtitle: s.institution || 'Scholar', image: s.users?.raw_user_meta_data?.avatar_url, type: 'Scholar', originalData: s
            })
          })
        }
        if (blogs && Array.isArray(blogs)) {
          blogs.forEach((b: any) => options.push({
            id: b.id, title: b.title, subtitle: 'Blog', image: b.cover_image, type: 'Blog', originalData: b
          }))
        }
        if (news && Array.isArray(news)) {
          news.forEach((n: any) => options.push({
            id: n.id, title: n.title, subtitle: 'News', image: n.cover_image, type: 'News', originalData: n
          }))
        }
        setRecordOptions(options)
      } catch (e: any) {
        console.error("Error loading settings:", e)
        toast.error('Failed to load settings: ' + e.message)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      faqs: (prev.faqs || []).filter((_: any, i: number) => i !== index)
    }))
  }

  const addPinnedScholar = () => setSettings(prev => ({ ...prev, pinned_scholars: [...(prev.pinned_scholars || []), {}] as any }))
  const removePinnedScholar = (index: number) => setSettings(prev => ({ ...prev, pinned_scholars: (prev.pinned_scholars || []).filter((_: any, i: number) => i !== index) }))
  const handlePinnedScholarChange = (index: number, field: string, value: string) => {
    const newScholars = [...(settings.pinned_scholars || [])]
    if (!newScholars[index]) newScholars[index] = {}
    newScholars[index] = { ...newScholars[index], [field]: value }
    setSettings(prev => ({ ...prev, pinned_scholars: newScholars }))
  }

  const addPinnedBlog = () => setSettings(prev => ({ ...prev, pinned_blogs: [...(prev.pinned_blogs || []), {}] as any }))
  const removePinnedBlog = (index: number) => setSettings(prev => ({ ...prev, pinned_blogs: (prev.pinned_blogs || []).filter((_: any, i: number) => i !== index) }))
  const handlePinnedBlogChange = (index: number, field: string, value: string) => {
    const newBlogs = [...(settings.pinned_blogs || [])]
    if (!newBlogs[index]) newBlogs[index] = {}
    newBlogs[index] = { ...newBlogs[index], [field]: value }
    setSettings(prev => ({ ...prev, pinned_blogs: newBlogs }))
  }

  if (loading) return (
    <div className="p-4 md:p-6 w-full max-w-4xl mx-auto animate-pulse">
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) p-6 space-y-8">
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
        <p className="text-(--color-gsp-text-secondary) text-sm mt-1">Dynamically hide/show sections and update text on the public homepage.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) p-6 space-y-8">
        {/* Hero Section */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Hero Title</label>
              <input aria-label="Input field" type="text" name="hero_title" value={settings.hero_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Hero Eyebrow (Small text above title)</label>
              <input aria-label="Input field" type="text" name="hero_eyebrow" value={settings.hero_eyebrow || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Hero Subtitle</label>
              <textarea name="hero_subtitle" value={settings.hero_subtitle || ''} onChange={handleChange} rows={2} className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2" />
            </div>
            
            <div className="md:col-span-2 pt-4 border-t border-(--color-gsp-border-muted)">
              <h3 className="font-medium text-(--color-gsp-text-primary) mb-4">Hero Text & Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Search Placeholder</label>
                  <input type="text" name="hero_search_placeholder" value={settings.hero_search_placeholder || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Search Filters (Comma separated)</label>
                  <input type="text" value={(settings.hero_search_filters || []).join(', ')} onChange={(e) => handleHeroSearchFilterChange(e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="All, Agriculture, Computer Science, Business, Humanities, Scholars" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Top Pill Label (Over the images)</label>
                  <input type="text" name="hero_top_pill" value={settings.hero_top_pill || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Primary CTA Button</label>
                  <input type="text" name="hero_cta_primary_text" value={settings.hero_cta_primary_text || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Secondary CTA Button</label>
                  <input type="text" name="hero_cta_secondary_text" value={settings.hero_cta_secondary_text || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Trust Text (HTML allowed)</label>
                  <input type="text" name="hero_trust_text" value={settings.hero_trust_text || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hero Ticker & Stats */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Hero Extra Elements (Ticker, Stats, Trust Avatars)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-8">
              
              {/* Ticker */}
              <div>
                <h3 className="font-semibold text-(--color-gsp-text-primary) mb-4 border-b pb-2">Top Ticker Items ({settings.hero_ticker_items?.length || 0} Items)</h3>
                <div className="space-y-4">
                  {(settings.hero_ticker_items || []).map((item, index) => (
                    <div key={index} className="grid grid-cols-[100px_1fr] gap-3">
                      <div>
                        <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Prefix</label>
                        <input type="text" value={item.prefix || ''} onChange={(e) => handleHeroTickerChange(index, 'prefix', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Text</label>
                        <input type="text" value={item.text || ''} onChange={(e) => handleHeroTickerChange(index, 'text', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Avatars */}
              <div>
                <h3 className="font-semibold text-(--color-gsp-text-primary) mb-4 border-b pb-2">Trust Avatars ({settings.hero_trust_avatars?.length || 0} Images)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(settings.hero_trust_avatars || []).map((avatar, index) => (
                    <div key={index}>
                      <ImageUpload label={`Avatar ${index + 1}`} value={avatar || ''} onChange={(url) => handleHeroTrustAvatarChange(index, url)} linksOnly={false} hideLink={true} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div>
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h3 className="font-semibold text-(--color-gsp-text-primary)">Bottom Stats Bar</h3>
                </div>
                
                <div className="p-4 bg-violet-soft border border-indigo-100 rounded-(--radius-lg) text-sm text-indigo-700">
                  <p><strong>Auto Live Stats is ON.</strong> The homepage will automatically count and display the number of Articles, Ebooks, Magazines, and Theses in your database.</p>
                </div>
              </div>

            </div>
          </details>
        </div>

        {/* Explore Categories */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Explore Categories
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Title</label>
                    <input type="text" name="explore_categories_gsp_title" value={settings.explore_categories_gsp_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Subtitle</label>
                    <input type="text" name="explore_categories_gsp_subtitle" value={settings.explore_categories_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b">
                <h3 className="font-semibold text-(--color-gsp-text-primary)">Publication Categories</h3>
                <button type="button" onClick={addExploreCategory} className="text-sm bg-(--color-gsp-primary) text-white px-3 py-1.5 rounded-md hover:bg-purple-800 transition-colors">
                  + Add Category
                </button>
              </div>
              <div className="p-4 bg-violet-soft border border-indigo-100 rounded-(--radius-lg) text-sm text-indigo-700 mb-6">
                <p><strong>Featured Publication Formats.</strong> Configure the publication format categories (e.g. Research Articles, eBooks, Magazines) shown on the homepage. You can add, edit, or remove formats below.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(settings.explore_categories || []).map((cat, index) => {
                return (
                  <div key={index} className="bg-(--color-gsp-surface-muted) p-5 rounded-(--radius-xl) border border-(--color-gsp-border-muted) shadow-(--shadow-1) relative group">
                    <button type="button" onClick={() => removeExploreCategory(index)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 p-1.5 rounded-md" title="Remove category">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    <div className="mb-4 space-y-3 mt-4">
                      <div>
                        <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Title</label>
                        <input type="text" value={cat.title || ''} onChange={(e) => handleExploreChange(index, 'title', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" placeholder="e.g. Research Articles" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Link URL</label>
                        <input type="text" value={cat.link || ''} onChange={(e) => handleExploreChange(index, 'link', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" placeholder="/explore" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Count (Optional text)</label>
                        <input type="text" value={cat.count || ''} onChange={(e) => handleExploreChange(index, 'count', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" placeholder="e.g. 100+ Papers" />
                      </div>
                    </div>
                    <ImageUpload 
                      label="Background Image"
                      value={cat.image || ''} 
                      onChange={(url) => handleExploreChange(index, 'image', url)}
                      linksOnly={false}
                      hideLink={true}
                    />
                  </div>
                )
              })}
              </div>
            </div>
          </details>
        </div>

        {/* Card & Image Sizes (Desktop & Mobile) */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Card & Image Sizes (Desktop & Mobile)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-(--radius-lg) text-sm text-indigo-800">
                <p><strong>Card Dimension Settings:</strong> Configure image heights for Category Cards and Publication Cards across all pages. You can keep Desktop & Mobile sizes identical or specify distinct heights for mobile devices.</p>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                <input 
                  type="checkbox" 
                  id="sync_mobile_card_size" 
                  name="sync_mobile_card_size" 
                  checked={settings.sync_mobile_card_size !== false} 
                  onChange={(e) => setSettings(prev => ({ ...prev, sync_mobile_card_size: e.target.checked }))} 
                  className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="sync_mobile_card_size" className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                  Keep image size identical on Desktop and Mobile (Recommended)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Card Size */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white space-y-4">
                  <h4 className="font-semibold text-base border-b pb-2 text-indigo-950">Category Cards Height</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Desktop Card Height (e.g. 280px)</label>
                    <input 
                      type="text" 
                      name="card_image_height_desktop" 
                      value={settings.card_image_height_desktop || '280px'} 
                      onChange={handleChange} 
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" 
                      placeholder="280px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Card Height {settings.sync_mobile_card_size !== false ? '(Synced with Desktop)' : '(Custom Mobile Height)'}
                    </label>
                    <input 
                      type="text" 
                      name="card_image_height_mobile" 
                      value={settings.sync_mobile_card_size !== false ? (settings.card_image_height_desktop || '280px') : (settings.card_image_height_mobile || '280px')} 
                      onChange={handleChange} 
                      disabled={settings.sync_mobile_card_size !== false}
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                      placeholder="240px or 280px"
                    />
                  </div>
                </div>

                {/* Publication Card Media Height */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white space-y-4">
                  <h4 className="font-semibold text-base border-b pb-2 text-indigo-950">Publication Cards Media Height</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Desktop Media Height (e.g. 180px)</label>
                    <input 
                      type="text" 
                      name="pub_card_media_height_desktop" 
                      value={settings.pub_card_media_height_desktop || '180px'} 
                      onChange={handleChange} 
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" 
                      placeholder="180px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Media Height {settings.sync_mobile_card_size !== false ? '(Synced with Desktop)' : '(Custom Mobile Height)'}
                    </label>
                    <input 
                      type="text" 
                      name="pub_card_media_height_mobile" 
                      value={settings.sync_mobile_card_size !== false ? (settings.pub_card_media_height_desktop || '180px') : (settings.pub_card_media_height_mobile || '180px')} 
                      onChange={handleChange} 
                      disabled={settings.sync_mobile_card_size !== false}
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                      placeholder="180px"
                    />
                  </div>
                </div>

                {/* Scholar Card Media Height */}
                <div className="p-4 border border-gray-200 rounded-xl bg-white space-y-4">
                  <h4 className="font-semibold text-base border-b pb-2 text-indigo-950">Scholar Cards Photo Height</h4>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Desktop Photo Height (e.g. 260px)</label>
                    <input 
                      type="text" 
                      name="scholar_card_media_height_desktop" 
                      value={settings.scholar_card_media_height_desktop || '260px'} 
                      onChange={handleChange} 
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" 
                      placeholder="260px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile Photo Height {settings.sync_mobile_card_size !== false ? '(Synced with Desktop)' : '(Custom Mobile Height)'}
                    </label>
                    <input 
                      type="text" 
                      name="scholar_card_media_height_mobile" 
                      value={settings.sync_mobile_card_size !== false ? (settings.scholar_card_media_height_desktop || '260px') : (settings.scholar_card_media_height_mobile || '220px')} 
                      onChange={handleChange} 
                      disabled={settings.sync_mobile_card_size !== false}
                      className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                      placeholder="220px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Subject Categories */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Subject Categories
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-5 w-full mb-6 pb-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Title</label>
                    <input type="text" name="subject_categories_gsp_title" value={settings.subject_categories_gsp_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Subtitle (Eyebrow)</label>
                    <input type="text" name="subject_categories_gsp_subtitle" value={settings.subject_categories_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Description</label>
                  <textarea name="subject_categories_gsp_desc" value={settings.subject_categories_gsp_desc || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" rows={2} />
                </div>
              </div>
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div>
                  <h4 className="font-semibold text-(--color-gsp-text-primary)">Live Categories</h4>
                  <p className="text-sm text-(--color-gsp-text-secondary)">Subject Categories and their uploaded images are automatically pulled from the Categories database.</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Display Mode</label>
                <select name="enable_dynamic_subject_categories" value={settings.enable_dynamic_subject_categories ? 'true' : 'false'} onChange={(e) => setSettings(prev => ({ ...prev, enable_dynamic_subject_categories: e.target.value === 'true' }))} className="w-full md:w-1/2 border border-(--color-gsp-border-default) rounded-md p-2 text-sm bg-white">
                  <option value="true">Auto (Pull from Database)</option>
                  <option value="false">Manual Pin (Select Specific)</option>
                </select>
              </div>

              {settings.enable_dynamic_subject_categories ? (
                <div className="p-4 bg-violet-soft border border-indigo-100 rounded-(--radius-lg) text-sm text-indigo-700">
                  <p><strong>Auto Live Categories is ON.</strong> The homepage will automatically pull the top categories and their uploaded background images directly from your Categories database.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(settings.subject_categories || []).map((cat, index) => (
                    <div key={index} className="bg-(--color-gsp-surface-muted) p-5 rounded-(--radius-xl) border border-(--color-gsp-border-muted) shadow-(--shadow-1) relative">
                      <button type="button" onClick={() => removeSubjectCategory(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                      <h3 className="font-semibold text-(--color-gsp-text-primary) mb-4 border-b pb-2">Category {index + 1}</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Category Name</label>
                          <input type="text" value={cat.name || ''} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <ImageUpload 
                          label="Background Image"
                          value={cat.image || ''} 
                          onChange={(url) => handleSubjectChange(index, 'image', url)}
                          linksOnly={false}
                          hideLink={true}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addSubjectCategory} className="w-full py-2 border border-dashed border-(--color-gsp-border-default) rounded-(--radius-lg) text-sm font-medium text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-raised)">
                    + Add Category
                  </button>
                </div>
              )}
            </div>
          </details>
        </div>

        {/* Hero Slides */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Hero Carousel Slides ({settings.hero_carousel_mode === 'manual' ? (settings.hero_slides?.length || 0) : 'Auto'} Slides)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Display Mode</label>
                <select name="hero_carousel_mode" value={settings.hero_carousel_mode || 'auto'} onChange={handleChange} className="w-full md:w-1/2 border border-(--color-gsp-border-default) rounded-md p-2 text-sm bg-white">
                  <option value="auto">Auto (Latest Publications)</option>
                  <option value="manual">Manual Pin (Select Specific)</option>
                </select>
                <p className="text-xs text-(--color-gsp-text-secondary) mt-2">
                  {settings.hero_carousel_mode === 'auto' ? 'The carousel will automatically pull the 5 most recent publications.' : 'You are manually controlling the slides.'}
                </p>
              </div>

              {settings.hero_carousel_mode === 'manual' && (
                <>
                  {(settings.hero_slides || []).map((slide, index) => (
                    <div key={index} className="bg-(--color-gsp-surface-muted) p-5 rounded-(--radius-xl) border border-(--color-gsp-border-muted) shadow-(--shadow-1) relative">
                      <button type="button" onClick={() => removeHeroSlide(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                      <h3 className="font-semibold text-(--color-gsp-text-primary) mb-4 border-b pb-2">Slide {index + 1}</h3>
                      <div className="mb-5 pb-5 border-b border-gray-100">
                        <RecordPicker 
                          label="Auto-fill from existing record (Optional)" 
                          items={recordOptions}
                          placeholder="Search for a publication, scholar, blog..."
                          onSelect={(item) => {
                            handleHeroSlideChange(index, 'title', item.title)
                            handleHeroSlideChange(index, 'author', item.subtitle || '')
                            if (item.image) {
                              handleHeroSlideChange(index, 'image', item.image)
                            }
                            if (item.type === 'Scholar') {
                              handleHeroSlideChange(index, 'badge', 'Featured Scholar')
                              handleHeroSlideChange(index, 'label', 'Scholar')
                              handleHeroSlideChange(index, 'avatar', item.image || '')
                            } else if (item.type === 'Publication') {
                              handleHeroSlideChange(index, 'badge', item.originalData?.content_type || 'Article')
                              handleHeroSlideChange(index, 'label', 'Featured Publication')
                            } else {
                              handleHeroSlideChange(index, 'badge', item.type || '')
                              handleHeroSlideChange(index, 'label', 'Featured')
                            }
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Label (e.g. Featured Article)</label>
                          <input type="text" value={slide.label || ''} onChange={(e) => handleHeroSlideChange(index, 'label', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Badge (e.g. eBook)</label>
                          <input type="text" value={slide.badge || ''} onChange={(e) => handleHeroSlideChange(index, 'badge', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Title</label>
                          <input type="text" value={slide.title || ''} onChange={(e) => handleHeroSlideChange(index, 'title', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Author Name</label>
                          <input type="text" value={slide.author || ''} onChange={(e) => handleHeroSlideChange(index, 'author', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Credentials (e.g. Ph.D.)</label>
                          <input type="text" value={slide.cred || ''} onChange={(e) => handleHeroSlideChange(index, 'cred', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                        </div>
                        <div className="md:col-span-2 mt-2">
                          <ImageUpload label="Author Avatar Image" value={slide.avatar || ''} onChange={(url) => handleHeroSlideChange(index, 'avatar', url)} linksOnly={false} hideLink={true} />
                        </div>
                        <div className="md:col-span-2 mt-2">
                          <ImageUpload label="Slide Background Image" value={slide.image || ''} onChange={(url) => handleHeroSlideChange(index, 'image', url)} linksOnly={false} hideLink={true} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addHeroSlide} className="w-full py-2 border border-dashed border-(--color-gsp-border-default) rounded-(--radius-lg) text-sm font-medium text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-raised)">
                    + Add Slide
                  </button>
                </>
              )}
            </div>
          </details>
        </div>

        {/* Featured Publications */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Featured Publications
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-5 mb-6 pb-6 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Title</label>
                    <input type="text" name="featured_content_gsp_title" value={settings.featured_content_gsp_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Subtitle (Eyebrow)</label>
                    <input type="text" name="featured_content_gsp_subtitle" value={settings.featured_content_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Description</label>
                  <textarea name="featured_content_gsp_desc" value={settings.featured_content_gsp_desc || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" rows={2} />
                </div>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-(--radius-lg) text-sm text-amber-800">
                <p><strong>How to Pin Publications:</strong> You can now pin specific publications to appear here by going to the <a href="/dashboard/admin/publications" className="font-bold underline">Publications</a> tab in your sidebar and clicking the Star (⭐) icon next to the publications you want to feature.</p>
                <p className="mt-2 text-xs text-amber-700">If no publications are starred, the homepage will automatically fallback to showing the latest published content.</p>
              </div>
            </div>
          </details>
        </div>

        {/* How It Works Steps */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              How It Works Steps ({settings.how_it_works_steps?.length || 0} Steps)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Title</label>
                  <input type="text" name="how_it_works_title" value={settings.how_it_works_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Subtitle</label>
                  <input type="text" name="how_it_works_subtitle" value={settings.how_it_works_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>
              {(settings.how_it_works_steps || []).map((step, index) => (
                <div key={index} className="bg-(--color-gsp-surface-muted) p-5 rounded-(--radius-xl) border border-(--color-gsp-border-muted) shadow-(--shadow-1) relative">
                  <button type="button" onClick={() => removeStep(index)} className="absolute top-5 right-5 text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                  <h3 className="font-semibold text-(--color-gsp-text-primary) mb-4 border-b pb-2">Step {index + 1}</h3>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Title</label>
                      <input type="text" value={step.title || ''} onChange={(e) => handleStepChange(index, 'title', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Description</label>
                      <textarea value={step.description || ''} onChange={(e) => handleStepChange(index, 'description', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" rows={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Frequently Asked Questions (FAQs)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 pb-6 border-b">
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Title</label>
                  <input type="text" name="faq_title" value={settings.faq_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Section Subtitle</label>
                  <input type="text" name="faq_subtitle" value={settings.faq_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button type="button" onClick={addFaq} className="text-sm bg-violet-soft text-(--color-gsp-text-inverse) px-3 py-1 rounded-md font-medium hover:bg-indigo-100">
                  + Add FAQ
                </button>
              </div>
          
          <div className="space-y-4">
            {(settings.faqs || []).map((faq, index) => (
              <div key={index} className="bg-(--color-gsp-surface-raised) p-4 rounded-(--radius-xl) border border-(--color-gsp-border-muted) relative">
                <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-medium">
                  Remove
                </button>
                <div className="space-y-3 pr-12">
                  <div>
                    <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Question</label>
                    <input aria-label="Input field" type="text" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="e.g. What is this?" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Answer</label>
                    <div className="bg-white rounded-md">
                      <ReactQuill theme="snow" value={faq.answer || ''} onChange={(val) => handleFaqChange(index, 'answer', val)} className="h-32 mb-10" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!(settings.faqs?.length) && (
              <p className="text-sm text-(--color-gsp-text-secondary) italic">No FAQs added yet.</p>
            )}
            </div>
          </div>
          </details>
        </div>

        {/* Other Sections (Titles Only) */}
        <div className="border border-(--color-gsp-border-muted) rounded-(--radius-xl) overflow-hidden">
          <details className="group">
            <summary className="p-4 bg-(--color-gsp-surface-raised) font-semibold text-lg cursor-pointer flex justify-between items-center group-open:border-b">
              Other Sections Headings (Testimonials, Scholars, etc.)
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal group-open:hidden">Click to expand</span>
              <span className="text-sm text-(--color-gsp-text-secondary) font-normal hidden group-open:inline">Click to collapse</span>
            </summary>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex items-center justify-between border-b pb-1">
                  <h3 className="font-semibold text-(--color-gsp-text-primary)">GSP Featured Scholars</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="show_featured_scholars_gsp" checked={settings.show_featured_scholars_gsp ?? true} onChange={handleChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-gsp-surface-muted) after:border-(--color-gsp-border-default) after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                    <span className="text-sm font-medium">Show Section</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Title</label>
                  <input type="text" name="featured_scholars_gsp_title" value={settings.featured_scholars_gsp_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Subtitle</label>
                  <input type="text" name="featured_scholars_gsp_subtitle" value={settings.featured_scholars_gsp_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Display Mode</label>
                  <select name="featured_scholars_mode" value={settings.featured_scholars_mode || 'dynamic'} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm bg-white">
                    <option value="dynamic">Auto (Latest First)</option>
                    <option value="random">Randomize (Shuffle Latest)</option>
                    <option value="manual">Manual Pin (Select Specific)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                
                {settings.featured_scholars_mode === 'manual' && (
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-medium text-(--color-gsp-text-secondary)">Pinned Scholars ({settings.pinned_scholars?.length || 0})</h4>
                    {(settings.pinned_scholars || []).map((scholar: any, index: number) => (
                      <div key={index} className="bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-lg) border border-(--color-gsp-border-muted) relative">
                        <button type="button" onClick={() => removePinnedScholar(index)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-700 font-medium z-10">Remove</button>
                        <div className="mb-4 pr-12">
                          <RecordPicker 
                            label="Auto-fill from existing scholar (Optional)" 
                            items={recordOptions.filter(r => r.type === 'Scholar')}
                            placeholder="Search for a scholar..."
                            onSelect={(item) => {
                              handlePinnedScholarChange(index, 'name', item.title)
                              if (item.subtitle) handlePinnedScholarChange(index, 'university', item.subtitle)
                              if (item.image) handlePinnedScholarChange(index, 'image', item.image)
                              if (item.originalData) {
                                if (item.originalData.qualification) handlePinnedScholarChange(index, 'credentials', item.originalData.qualification)
                                if (item.originalData._count?.publications) handlePinnedScholarChange(index, 'papers_count', String(item.originalData._count.publications))
                              }
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-12">
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Name</label>
                            <input type="text" value={scholar.name || ''} onChange={(e) => handlePinnedScholarChange(index, 'name', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="e.g. Dr. Priya Nair-Kapoor" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Credentials / Degrees</label>
                            <input type="text" value={scholar.credentials || ''} onChange={(e) => handlePinnedScholarChange(index, 'credentials', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="e.g. Hon. D.B.A." />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">University / Department</label>
                            <input type="text" value={scholar.university || ''} onChange={(e) => handlePinnedScholarChange(index, 'university', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="e.g. Indian Institute of Management" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Stats/Papers (e.g. 42)</label>
                            <input type="text" value={scholar.papers_count || ''} onChange={(e) => handlePinnedScholarChange(index, 'papers_count', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="42" />
                          </div>
                          <div className="md:col-span-2 mt-2">
                            <ImageUpload label="Scholar Photo" value={scholar.image || ''} onChange={(url) => handlePinnedScholarChange(index, 'image', url)} linksOnly={false} hideLink={true} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addPinnedScholar} className="w-full py-2 border border-dashed border-(--color-gsp-border-default) rounded-(--radius-lg) text-sm font-medium text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-raised)">
                      + Add Pinned Scholar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2 flex items-center justify-between border-b pb-1">
                  <h3 className="font-semibold text-(--color-gsp-text-primary)">From The GSP Blog (News)</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="show_recent_blogs" checked={settings.show_recent_blogs ?? true} onChange={handleChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-gsp-surface-muted) after:border-(--color-gsp-border-default) after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
                    <span className="text-sm font-medium">Show Section</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Display Mode</label>
                  <select name="featured_blogs_mode" value={settings.featured_blogs_mode || 'dynamic'} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm bg-white">
                    <option value="dynamic">Auto (Latest First)</option>
                    <option value="random">Randomize (Shuffle Latest)</option>
                    <option value="manual">Manual Pin (Select Specific)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                
                {settings.featured_blogs_mode === 'manual' && (
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="text-sm font-medium text-(--color-gsp-text-secondary)">Pinned Blogs ({settings.pinned_blogs?.length || 0})</h4>
                    {(settings.pinned_blogs || []).map((blog: any, index: number) => (
                      <div key={index} className="bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-lg) border border-(--color-gsp-border-muted) relative">
                        <button type="button" onClick={() => removePinnedBlog(index)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-700 font-medium z-10">Remove</button>
                        <div className="mb-4 pr-12">
                          <RecordPicker 
                            label="Auto-fill from existing blog/news (Optional)" 
                            items={recordOptions.filter(r => r.type === 'Blog' || r.type === 'News')}
                            placeholder="Search for a post..."
                            onSelect={(item) => {
                              handlePinnedBlogChange(index, 'title', item.title)
                              handlePinnedBlogChange(index, 'badge', item.type || 'News')
                              if (item.image) handlePinnedBlogChange(index, 'image', item.image)
                              if (item.originalData) {
                                if (item.originalData.content) {
                                  // Basic HTML strip for description
                                  const text = item.originalData.content.replace(/<[^>]*>?/gm, '')
                                  handlePinnedBlogChange(index, 'description', text.substring(0, 100) + '...')
                                }
                                if (item.originalData.published_at) {
                                  handlePinnedBlogChange(index, 'date', new Date(item.originalData.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))
                                }
                                handlePinnedBlogChange(index, 'author', item.type === 'Blog' ? 'GSP Author' : 'GSP Editorial')
                              }
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-12">
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Badge (e.g. News)</label>
                            <input type="text" value={blog.badge || ''} onChange={(e) => handlePinnedBlogChange(index, 'badge', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="News" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Title</label>
                            <input type="text" value={blog.title || ''} onChange={(e) => handlePinnedBlogChange(index, 'title', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="e.g. Annual Research Grant..." />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Description</label>
                            <textarea value={blog.description || ''} onChange={(e) => handlePinnedBlogChange(index, 'description', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" rows={2} />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Author Name (e.g. GSP Editorial)</label>
                            <input type="text" value={blog.author || ''} onChange={(e) => handlePinnedBlogChange(index, 'author', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="GSP Editorial" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">Date</label>
                            <input type="text" value={blog.date || ''} onChange={(e) => handlePinnedBlogChange(index, 'date', e.target.value)} className="w-full border border-(--color-gsp-border-default) rounded-md p-1.5 text-sm" placeholder="Jun 15, 2026" />
                          </div>
                          <div className="md:col-span-2 mt-2">
                            <ImageUpload label="Blog Cover Image" value={blog.image || ''} onChange={(url) => handlePinnedBlogChange(index, 'image', url)} linksOnly={false} hideLink={true} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={addPinnedBlog} className="w-full py-2 border border-dashed border-(--color-gsp-border-default) rounded-(--radius-lg) text-sm font-medium text-(--color-gsp-text-primary) hover:bg-(--color-gsp-surface-raised)">
                      + Add Pinned Blog
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-(--color-gsp-text-primary) border-b pb-1">Testimonials</h3></div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Title</label>
                  <input type="text" name="testimonials_title" value={settings.testimonials_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Subtitle</label>
                  <input type="text" name="testimonials_subtitle" value={settings.testimonials_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-(--color-gsp-text-primary) border-b pb-1">CTA Banner</h3></div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Title</label>
                  <input type="text" name="cta_title" value={settings.cta_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Subtitle</label>
                  <input type="text" name="cta_subtitle" value={settings.cta_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2"><h3 className="font-semibold text-(--color-gsp-text-primary) border-b pb-1">Platform Metrics (Stats Bar)</h3></div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Title</label>
                  <input type="text" name="stats_title" value={settings.stats_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm font-semibold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Subtitle</label>
                  <input type="text" name="stats_subtitle" value={settings.stats_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-(--color-gsp-text-primary) border-b pb-1">Legacy Sections</h3>
                  <p className="text-sm text-(--color-gsp-text-secondary) mt-1">These settings are for older sections that might not be visible on the new home page.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Featured Content Title</label>
                  <input type="text" name="featured_title" value={settings.featured_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Featured Content Subtitle</label>
                  <input type="text" name="featured_subtitle" value={settings.featured_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Categories Title</label>
                  <input type="text" name="categories_title" value={settings.categories_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Categories Subtitle</label>
                  <input type="text" name="categories_subtitle" value={settings.categories_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Scholars Title</label>
                  <input type="text" name="scholars_title" value={settings.scholars_title || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Legacy Scholars Subtitle</label>
                  <input type="text" name="scholars_subtitle" value={settings.scholars_subtitle || ''} onChange={handleChange} className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm" />
                </div>
              </div>

            </div>
          </details>
        </div>

        {/* Visibility Toggles */}
        <div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section Visibility</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_home_hero" checked={settings.show_home_hero ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Hero Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_explore_categories_gsp" checked={settings.show_explore_categories_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Explore Categories</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_subject_categories_gsp" checked={settings.show_subject_categories_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Subject Categories</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_featured_content_gsp" checked={settings.show_featured_content_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show GSP Featured Content</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_how_it_works" checked={settings.show_how_it_works ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show How It Works</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_featured_scholars_gsp" checked={settings.show_featured_scholars_gsp ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show GSP Featured Scholars</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_cta_banner" checked={settings.show_cta_banner ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show CTA Banner</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_stats_section" checked={settings.show_stats_section ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Statistics Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_categories_section" checked={settings.show_categories_section ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Icons/Categories Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_featured_content" checked={settings.show_featured_content ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Featured Content (Carousel)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_featured_scholars" checked={settings.show_featured_scholars ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Featured Scholars (Carousel)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_testimonials" checked={settings.show_testimonials ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show Testimonials</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised)">
              <input aria-label="Input field" type="checkbox" name="show_faq_section" checked={settings.show_faq_section ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium">Show FAQ Section</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-(--radius-lg) cursor-pointer hover:bg-(--color-gsp-surface-raised) bg-violet-soft/50 border-indigo-100">
              <input aria-label="Input field" type="checkbox" name="enable_carousel_autoplay" checked={settings.enable_carousel_autoplay ?? true} onChange={handleChange} className="w-5 h-5 text-(--color-gsp-text-inverse) rounded" />
              <span className="font-medium text-indigo-900">Enable Carousel Autoplay</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" disabled={saving}
            className="bg-(--color-gsp-text-inverse) text-white px-8 py-3 rounded-(--radius-xl) hover:bg-indigo-700 font-bold disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
