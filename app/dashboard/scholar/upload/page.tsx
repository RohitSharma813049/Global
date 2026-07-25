'use client'

import React, { useState, useEffect } from 'react'
import { uploadPublication, uploadSingleFileToR2, getScholarPublications } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { getScholarProfile } from '@/app/actions/settings'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function ScholarUploadPage() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [hasPublishedArticle, setHasPublishedArticle] = useState(false)
  const [selectedContentType, setSelectedContentType] = useState('thesis')
  const [abstract, setAbstract] = useState('')
  const [coverName, setCoverName] = useState('')
  const [bannerName, setBannerName] = useState('')
  const [galleryNames, setGalleryNames] = useState('')
  const [uploadStatusText, setUploadStatusText] = useState('')
  const [galleryVideoNames, setGalleryVideoNames] = useState('')
  const [fileName, setFileName] = useState('')
  const [declarations, setDeclarations] = useState({ originality: false, copyright: false, terms: false })
  const router = useRouter()

  const clearFile = (e: React.MouseEvent, inputId: string, stateSetter: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault()
    e.stopPropagation()
    const input = document.getElementById(inputId) as HTMLInputElement
    if (input) input.value = ''
    stateSetter('')
  }

  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(console.error)
    getScholarPublications().then(res => {
      if (res?.data) {
        setHasPublishedArticle(res.data.some(p => p.status === 'published' && p.content_type === 'article'))
      }
    }).catch(console.error)
  }, [])

  const nextStep = () => {
    const form = document.getElementById('uploadForm') as HTMLFormElement;
    if (!form) return;
    
    // Check validity of current step
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
      const inputs = currentStepElement.querySelectorAll('input, select, textarea');
      let isValid = true;
      let firstInvalid: any = null;
      
      inputs.forEach((input: any) => {
        if (input.checkValidity && !input.checkValidity()) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });
      
      if (!isValid) {
        if (firstInvalid) {
          try {
            firstInvalid.reportValidity();
          } catch(e) {
            // reportValidity fails on hidden inputs in some browsers
          }
          
          if (currentStep === 4 && firstInvalid.id === 'file') {
            setError("Please select a PDF, DOCX, or EPUB document to upload.");
          } else {
            setError(`Please fill out the required field: ${firstInvalid.name || firstInvalid.id || 'above'}.`);
          }
        }
        return;
      }

      if (currentStep === 1) {
        const contentType = document.getElementById('content_type') as HTMLSelectElement
        if (contentType?.value === 'thesis' && !hasPublishedArticle) {
          setError("You must publish a research paper before submitting a thesis.")
          return
        }
      }
    }
    
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setUploadProgress(0)
    setError('')
    setUploadStatusText('Starting upload...')
    
    const formData = new FormData(e.currentTarget)
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | undefined;
    if (submitter && submitter.name === 'status') {
      formData.set('status', submitter.value);
    }
    
    try {
      // Helper to upload a single file and return URL
      const uploadField = async (fieldName: string, label: string) => {
        const file = formData.get(fieldName) as File | null;
        if (file && file.size > 0) {
          setUploadStatusText(`Uploading ${label}...`);
          const singleData = new FormData();
          singleData.append('file', file);
          const res = await uploadSingleFileToR2(singleData);
          if (res.error) throw new Error(`${label} upload failed: ${res.error}`);
          if (res.url) {
            formData.set(`${fieldName}_url`, res.url);
          }
        }
        formData.delete(fieldName); // Remove raw file to save bandwidth
      };

      // Upload files sequentially
      await uploadField('file', 'Main Document');
      await uploadField('video_file', 'Main Video');
      await uploadField('cover_image', 'Cover Image');
      await uploadField('banner_image', 'Banner Image');

      // Gallery Images
      const gImages = formData.getAll('gallery_images') as File[];
      formData.delete('gallery_images');
      for (let i = 0; i < gImages.length; i++) {
        const f = gImages[i];
        if (f && f.size > 0) {
          setUploadStatusText(`Uploading Gallery Image (${i + 1}/${gImages.length})...`);
          const singleData = new FormData();
          singleData.append('file', f);
          const res = await uploadSingleFileToR2(singleData);
          if (res.error) throw new Error(`Gallery Image ${i + 1} upload failed: ${res.error}`);
          if (res.url) formData.append('gallery_images_urls', res.url);
        }
      }

      // Gallery Videos
      const gVideos = formData.getAll('gallery_videos') as File[];
      formData.delete('gallery_videos');
      for (let i = 0; i < gVideos.length; i++) {
        const f = gVideos[i];
        if (f && f.size > 0) {
          setUploadStatusText(`Uploading Gallery Video (${i + 1}/${gVideos.length})...`);
          const singleData = new FormData();
          singleData.append('file', f);
          const res = await uploadSingleFileToR2(singleData);
          if (res.error) throw new Error(`Gallery Video ${i + 1} upload failed: ${res.error}`);
          if (res.url) formData.append('gallery_videos_urls', res.url);
        }
      }

      setUploadStatusText('Finalizing submission...');
      setUploadProgress(90);

      const result = await uploadPublication(formData)
      
      setUploadProgress(100);
      
      if (result.error) {
        setTimeout(() => {
          setError(result.error)
          setLoading(false)
          setUploadProgress(0)
          setUploadStatusText('')
        }, 500);
      } else {
        setTimeout(() => {
          router.push('/dashboard/scholar?upload_success=true')
        }, 800);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Unexpected end of form')) {
        setError('Upload failed: The total file size is too large or your connection dropped. Try removing large videos/images and try again.');
      } else {
        setError(err.message || 'An error occurred during upload.');
      }
      setLoading(false);
      setUploadProgress(0);
      setUploadStatusText('');
    }
  }

  const stepTitles = [
    "Basic Information",
    "Author Details",
    "Content & Abstract",
    "Media & Files",
    "Declarations"
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-gsp-text-primary)]">Upload Publication</h1>
          <p className="text-[var(--color-gsp-text-secondary)] mt-2">Submit your thesis, article, or eBook to the Global Scholar Publications platform.</p>
        </div>

      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#2F115D] z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          ></div>
          
          {stepTitles.map((title, index) => {
            const stepNum = index + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${isActive ? 'bg-[#2F115D] border-[#2F115D] text-white' : isCompleted ? 'bg-[#2F115D] border-[#2F115D] text-white opacity-80' : 'bg-[var(--color-gsp-surface-muted)] border-[var(--color-gsp-border-default)] text-[var(--color-gsp-text-secondary)]'}`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <div className={`absolute top-12 text-xs font-medium whitespace-nowrap hidden sm:block ${isActive || isCompleted ? 'text-[var(--color-gsp-text-primary)]' : 'text-[var(--color-gsp-text-secondary)]'}`}>
                  {title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] overflow-hidden sm:mt-16">
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          <form id="uploadForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Basic Information */}
            <div id="step-1" className={currentStep === 1 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-6 border-b pb-2">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Publication Title</label>
                  <input aria-label="Input field" 
                    type="text" 
                    name="title" 
                    id="title" 
                    required={currentStep === 1}
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                  />
                </div>
                <div>
                  <label htmlFor="content_type" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Content Type</label>
                  <select aria-label="Select field" 
                    name="content_type" 
                    id="content_type" 
                    required={currentStep === 1}
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] bg-[var(--color-gsp-surface-muted)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="thesis">Thesis</option>
                    <option value="article">Research Article</option>
                    <option value="ebook">eBook</option>
                    <option value="magazine">Magazine / Journal</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Category</label>
                  <select aria-label="Select field" 
                    name="category_id" 
                    id="category_id" 
                    required={currentStep === 1}
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] bg-[var(--color-gsp-surface-muted)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.length > 0 ? categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    )) : (
                      <option value="" disabled>Loading categories...</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="doi" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">
                    {selectedContentType === 'thesis' ? 'DOI (Required)' : 'DOI (Optional)'}
                  </label>
                  <input aria-label="Input field" 
                    type="text" 
                    name="doi" 
                    id="doi" 
                    required={selectedContentType === 'thesis'}
                    placeholder={selectedContentType === 'thesis' ? "Enter your DOI" : "Enter DOI if you already have one (e.g. 10.1234/abc)"}
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Author Details */}
            <div id="step-2" className={currentStep === 2 ? 'block' : 'hidden'}>
              <div className="flex items-center justify-between mb-6 border-b pb-2">
                <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)]">Author Details</h2>
                {session?.user && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button"
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          const originalText = btn.innerText;
                          btn.innerText = 'Loading...';
                          btn.disabled = true;
                          try {
                            const profile = await getScholarProfile();
                            if (profile) {
                              const nameInput = document.getElementById('author_name') as HTMLInputElement;
                              const emailInput = document.getElementById('email_address') as HTMLInputElement;
                              const instInput = document.getElementById('institution') as HTMLInputElement;
                              
                              if (nameInput && profile.name) nameInput.value = profile.name;
                              if (emailInput && profile.email) emailInput.value = profile.email;
                              if (instInput && profile.institution) instInput.value = profile.institution;
                            }
                          } catch (err) {
                            console.error('Failed to autofill', err);
                          } finally {
                            btn.innerText = originalText;
                            btn.disabled = false;
                          }
                        }}
                        className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 font-medium transition-colors disabled:opacity-50"
                      >
                        Autofill from my account
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pulls Name, Email, and Institution from your Scholar Profile</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="author_name" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Author Name</label>
                    <input aria-label="Author Name" 
                      type="text" 
                      name="author_name" 
                      id="author_name" 
                      required={currentStep === 2}
                      className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email_address" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Email Address</label>
                    <input aria-label="Email Address" 
                      type="email" 
                      name="email_address" 
                      id="email_address" 
                      required={currentStep === 2}
                      className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Institution / University Name</label>
                  <input aria-label="Institution" 
                    type="text" 
                    name="institution" 
                    id="institution" 
                    required={currentStep === 2}
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Content & Abstract */}
            <div id="step-3" className={currentStep === 3 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-6 border-b pb-2">Content & Abstract</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="abstract" className="block text-sm font-medium text-[var(--color-gsp-text-primary)] mb-1">Abstract / Summary</label>
                  <input type="hidden" name="abstract" value={abstract} />
                  <ReactQuill 
                    theme="snow" 
                    value={abstract} 
                    onChange={setAbstract} 
                    className="bg-[var(--color-gsp-surface-muted)] rounded-md mb-12 h-48"
                  />
                </div>
                <div>
                  <label htmlFor="doi" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">DOI (Optional)</label>
                  <input aria-label="DOI" 
                    type="text" 
                    name="doi" 
                    id="doi" 
                    placeholder="e.g. 10.1000/xyz123"
                    className="mt-1 block w-full px-4 py-3 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Media & Files */}
            <div id="step-4" className={currentStep === 4 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-6 border-b pb-2">Media & Files</h2>
              <div className="space-y-6">
                <div>
                  <span className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Upload Document (PDF)*</span>
                  <label htmlFor="file" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 transition-colors bg-[var(--color-gsp-surface-raised)] cursor-pointer">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-emerald-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-[var(--color-gsp-text-secondary)] justify-center">
                        <span className="relative font-medium text-emerald-600 hover:text-emerald-500 px-2 py-1 flex items-center gap-2">
                          {fileName || "Add PDF Document"}
                          {fileName && (
                            <button type="button" onClick={(e) => clearFile(e, 'file', setFileName)} className="text-gray-400 hover:text-red-500 p-1" title="Remove file">
                              ✕
                            </button>
                          )}
                        </span>
                        <input id="file" name="file" type="file" accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.epub,application/epub+zip" className="sr-only" required={currentStep === 4} onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              setError("PDF Document exceeds the 5MB limit.");
                              e.target.value = '';
                              setFileName('');
                              return;
                            }
                            setError('');
                            setFileName(file.name);
                          } else {
                            setFileName('');
                          }
                        }} />
                      </div>
                      <p className="text-xs text-[var(--color-gsp-text-secondary)]">Required: PDF, DOCX, EPUB up to 5MB</p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Cover Photo</span>
                    <label htmlFor="cover_image" className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)] cursor-pointer">
                      <div className="text-center relative">
                        <span className="text-emerald-600 font-medium text-sm flex items-center justify-center gap-2">
                          {coverName || "Browse File"}
                          {coverName && (
                            <button type="button" onClick={(e) => clearFile(e, 'cover_image', setCoverName)} className="text-gray-400 hover:text-red-500 p-1" title="Remove file">
                              ✕
                            </button>
                          )}
                        </span>
                        <input id="cover_image" name="cover_image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setError("Cover Photo exceeds the 2MB limit.");
                              e.target.value = '';
                              setCoverName('');
                              return;
                            }
                            setError('');
                            setCoverName(file.name);
                          } else {
                            setCoverName('');
                          }
                        }} />
                      </div>
                    </label>
                    <p className="mt-2 text-xs text-[var(--color-gsp-text-secondary)] text-center">Required: JPG, PNG, WEBP up to 2MB</p>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Banner Image</span>
                    <label htmlFor="banner_image" className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)] cursor-pointer">
                      <div className="text-center relative">
                        <span className="text-emerald-600 font-medium text-sm flex items-center justify-center gap-2">
                          {bannerName || "Browse File"}
                          {bannerName && (
                            <button type="button" onClick={(e) => clearFile(e, 'banner_image', setBannerName)} className="text-gray-400 hover:text-red-500 p-1" title="Remove file">
                              ✕
                            </button>
                          )}
                        </span>
                        <input id="banner_image" name="banner_image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              setError("Banner Image exceeds the 2MB limit.");
                              e.target.value = '';
                              setBannerName('');
                              return;
                            }
                            setError('');
                            setBannerName(file.name);
                          } else {
                            setBannerName('');
                          }
                        }} />
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-gsp-text-secondary)] text-center">Optional: JPG, PNG, WEBP up to 2MB</p>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Photos</span>
                    <label htmlFor="gallery_images" className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)] cursor-pointer">
                      <div className="text-center relative">
                        <span className="text-emerald-600 font-medium text-sm flex items-center justify-center gap-2 flex-wrap">
                          {galleryNames || "Browse Files (Multiple)"}
                          {galleryNames && (
                            <button type="button" onClick={(e) => clearFile(e, 'gallery_images', setGalleryNames)} className="text-gray-400 hover:text-red-500 p-1" title="Remove files">
                              ✕
                            </button>
                          )}
                        </span>
                        <input id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const hasLargeFile = files.some(f => f.size > 2 * 1024 * 1024);
                          if (hasLargeFile) {
                            setError("One or more gallery images exceed the 2MB limit.");
                            e.target.value = '';
                            setGalleryNames('');
                            return;
                          }
                          setError('');
                          setGalleryNames(files.map(f => f.name).join(', '));
                        }} />
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-gsp-text-secondary)] text-center">Optional: Images up to 2MB each</p>
                    </label>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Main Video</span>
                    <label htmlFor="video_file" className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)] cursor-pointer">
                      <div className="text-center relative">
                        <span className="text-emerald-600 font-medium text-sm flex items-center justify-center gap-2">
                          {galleryVideoNames || "Browse Video File"}
                          {galleryVideoNames && (
                            <button type="button" onClick={(e) => clearFile(e, 'video_file', setGalleryVideoNames)} className="text-gray-400 hover:text-red-500 p-1" title="Remove file">
                              ✕
                            </button>
                          )}
                        </span>
                        <input id="video_file" name="video_file" type="file" accept="video/mp4,video/webm" className="sr-only" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 20 * 1024 * 1024) {
                              setError("Video exceeds the 20MB limit.");
                              e.target.value = '';
                              setGalleryVideoNames('');
                              return;
                            }
                            setError('');
                            setGalleryVideoNames(file.name);
                          } else {
                            setGalleryVideoNames('');
                          }
                        }} />
                      </div>
                      <p className="mt-2 text-xs text-[var(--color-gsp-text-secondary)] text-center">Optional: MP4/WebM up to 20MB</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Declarations & Submit */}
            <div id="step-5" className={currentStep === 5 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-6 border-b pb-2">Declarations</h2>
              <div className="space-y-4 bg-[var(--color-gsp-surface-raised)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-gsp-border-muted)]">
                
                <div className="flex items-start pb-4 border-b border-[var(--color-gsp-border-muted)]">
                  <div className="flex items-center h-5">
                    <input
                      id="agree_all"
                      type="checkbox"
                      checked={declarations.originality && declarations.copyright && declarations.terms}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setDeclarations({ originality: checked, copyright: checked, terms: checked });
                      }}
                      className="w-5 h-5 text-[#2F115D] bg-[var(--color-gsp-surface-muted)] border-[var(--color-gsp-border-default)] rounded focus:ring-[#2F115D]"
                    />
                  </div>
                  <label htmlFor="agree_all" className="ms-3 text-sm font-bold text-[var(--color-gsp-text-primary)]">
                    Agree to all terms & conditions
                  </label>
                </div>

                <div className="flex items-start pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="originality_declaration"
                      name="originality_declaration"
                      type="checkbox"
                      value="true"
                      required={currentStep === 5}
                      checked={declarations.originality}
                      onChange={(e) => setDeclarations(prev => ({ ...prev, originality: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 bg-[var(--color-gsp-surface-muted)] border-[var(--color-gsp-border-default)] rounded focus:ring-emerald-500"
                    />
                  </div>
                  <label htmlFor="originality_declaration" className="ms-3 text-sm font-medium text-[var(--color-gsp-text-primary)] leading-relaxed">
                    I declare that this work is original and does not infringe upon any third-party rights.
                  </label>
                </div>

                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="copyright_declaration"
                      name="copyright_declaration"
                      type="checkbox"
                      value="true"
                      required={currentStep === 5}
                      checked={declarations.copyright}
                      onChange={(e) => setDeclarations(prev => ({ ...prev, copyright: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 bg-[var(--color-gsp-surface-muted)] border-[var(--color-gsp-border-default)] rounded focus:ring-emerald-500"
                    />
                  </div>
                  <label htmlFor="copyright_declaration" className="ms-3 text-sm font-medium text-[var(--color-gsp-text-primary)] leading-relaxed">
                    I agree to the copyright terms of Global Scholar Publications.
                  </label>
                </div>

                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms_acceptance"
                      name="terms_acceptance"
                      type="checkbox"
                      value="true"
                      required={currentStep === 5}
                      checked={declarations.terms}
                      onChange={(e) => setDeclarations(prev => ({ ...prev, terms: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 bg-[var(--color-gsp-surface-muted)] border-[var(--color-gsp-border-default)] rounded focus:ring-emerald-500"
                    />
                  </div>
                  <label htmlFor="terms_acceptance" className="ms-3 text-sm font-medium text-[var(--color-gsp-text-primary)] leading-relaxed">
                    I accept the Terms and Conditions of the platform.
                  </label>
                </div>
              </div>
            </div>

            {/* Form Controls */}
            <div className="pt-6 mt-6 border-t border-[var(--color-gsp-border-muted)] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={loading}
                className={`w-full sm:w-auto py-2 px-6 rounded-md font-medium text-[var(--color-gsp-text-primary)] bg-[var(--color-gsp-surface-muted)] border border-[var(--color-gsp-border-default)] hover:bg-[var(--color-gsp-surface-raised)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none hidden sm:block' : ''} disabled:opacity-50`}
              >
                Back
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="w-full sm:w-auto py-2 px-8 rounded-md font-medium text-white bg-[#2F115D] hover:bg-[#3d167a] shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F115D] transition-colors disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <button
                    type="submit"
                    name="status"
                    value="draft"
                    formNoValidate
                    disabled={loading}
                    className="w-full sm:w-auto py-2 px-6 rounded-md font-medium text-[var(--color-gsp-text-primary)] bg-[var(--color-gsp-surface-muted)] hover:bg-[var(--color-gsp-surface-raised)] border border-[var(--color-gsp-border-default)] shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="submitted"
                    disabled={loading}
                    className="w-full sm:w-auto py-2 px-8 rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50 flex items-center justify-center sm:min-w-[200px]"
                  >
                    {loading ? (
                      <span className="flex flex-col items-center gap-1">
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                        {uploadStatusText && <span className="text-xs font-normal opacity-90">{uploadStatusText}</span>}
                      </span>
                    ) : 'Submit Publication'}
                  </button>
                </div>
              )}
            </div>

          </form>
          
          {/* Upload Progress Overlay */}
          {loading && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-[var(--radius-xl)]">
              <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Uploading Files...</h3>
                <p className="text-sm text-gray-500 mb-6">Please keep this window open until the upload completes.</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-4">
                  <span>{uploadProgress < 100 ? 'Processing...' : 'Finalizing...'}</span>
                  <span>{Math.round(Math.min(uploadProgress, 100))}%</span>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}
