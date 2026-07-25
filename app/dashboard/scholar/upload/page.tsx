'use client'

import React, { useState, useEffect } from 'react'
import { uploadPublication } from '@/app/actions/publications'
import { getCategories } from '@/app/actions/taxonomy'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function ScholarUploadPage() {
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [abstract, setAbstract] = useState('')
  const [coverName, setCoverName] = useState('')
  const [bannerName, setBannerName] = useState('')
  const [galleryNames, setGalleryNames] = useState('')
  const [galleryVideoNames, setGalleryVideoNames] = useState('')
  const router = useRouter()

  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(console.error)
  }, [])

  const nextStep = () => {
    const form = document.getElementById('uploadForm') as HTMLFormElement;
    if (!form) return;
    
    // Check validity of current step
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
      const inputs = currentStepElement.querySelectorAll('input, select, textarea');
      let isValid = true;
      inputs.forEach((input: any) => {
        if (input.checkValidity && !input.checkValidity()) {
          input.reportValidity();
          isValid = false;
        }
      });
      if (!isValid) return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | undefined;
    if (submitter && submitter.name === 'status') {
      formData.set('status', submitter.value);
    }
    
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

  const stepTitles = [
    "Basic Information",
    "Author Details",
    "Content & Abstract",
    "Media & Files",
    "Declarations"
  ];

  return (
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
                      <option key={cat.id} value={cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}>{cat.name}</option>
                    )) : (
                      <>
                        <option value="cs_ai">Computer Science & AI</option>
                        <option value="engineering">Engineering & Technology</option>
                        <option value="medical">Medical & Health Sciences</option>
                        <option value="business">Business & Management</option>
                        <option value="other">Other</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Author Details */}
            <div id="step-2" className={currentStep === 2 ? 'block' : 'hidden'}>
              <div className="flex items-center justify-between mb-6 border-b pb-2">
                <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)]">Author Details</h2>
                {session?.user && (
                  <button 
                    type="button"
                    onClick={() => {
                      const nameInput = document.getElementById('author_name') as HTMLInputElement;
                      const emailInput = document.getElementById('email_address') as HTMLInputElement;
                      if (nameInput && session.user.name) nameInput.value = session.user.name;
                      if (emailInput && session.user.email) emailInput.value = session.user.email;
                    }}
                    className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 font-medium transition-colors"
                  >
                    Autofill from my account
                  </button>
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
                    className="bg-[var(--color-gsp-surface-muted)] rounded-md mb-2 h-48 pb-12"
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
                  <label htmlFor="file" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Upload Document (PDF)*</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 transition-colors bg-[var(--color-gsp-surface-raised)]">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-emerald-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-[var(--color-gsp-text-secondary)] justify-center">
                        <label htmlFor="file" className="relative cursor-pointer bg-[var(--color-gsp-surface-muted)] rounded-md font-medium text-emerald-600 hover:text-emerald-500 px-2 py-1 shadow-[var(--shadow-1)] border">
                          <span>Add PDF Document</span>
                          <input id="file" name="file" type="file" accept=".pdf,.docx,.epub" className="sr-only" required={currentStep === 4} />
                        </label>
                      </div>
                      <p className="text-xs text-[var(--color-gsp-text-secondary)]">Required: PDF, DOCX, EPUB up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cover_image" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Cover Photo</label>
                    <div className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)]">
                      <div className="text-center">
                        <label htmlFor="cover_image" className="cursor-pointer text-emerald-600 font-medium text-sm">
                          {coverName || "Browse File"}
                          <input id="cover_image" name="cover_image" type="file" accept="image/*" className="sr-only" onChange={(e) => setCoverName(e.target.files?.[0]?.name || '')} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="banner_image" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Banner Image</label>
                    <div className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)]">
                      <div className="text-center">
                        <label htmlFor="banner_image" className="cursor-pointer text-emerald-600 font-medium text-sm">
                          {bannerName || "Browse File"}
                          <input id="banner_image" name="banner_image" type="file" accept="image/*" className="sr-only" onChange={(e) => setBannerName(e.target.files?.[0]?.name || '')} />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="gallery_images" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Photos</label>
                    <div className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)]">
                      <div className="text-center">
                        <label htmlFor="gallery_images" className="cursor-pointer text-emerald-600 font-medium text-sm">
                          {galleryNames || "Browse Files (Multiple)"}
                          <input id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setGalleryNames(files.map(f => f.name).join(', '));
                          }} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="video_file" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Main Video</label>
                    <div className="mt-1 flex justify-center px-4 py-4 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-emerald-500 bg-[var(--color-gsp-surface-raised)]">
                      <div className="text-center">
                        <label htmlFor="video_file" className="cursor-pointer text-emerald-600 font-medium text-sm">
                          Browse Video File
                          <input id="video_file" name="video_file" type="file" accept="video/mp4,video/webm" className="sr-only" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Declarations & Submit */}
            <div id="step-5" className={currentStep === 5 ? 'block' : 'hidden'}>
              <h2 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-6 border-b pb-2">Declarations</h2>
              <div className="space-y-4 bg-[var(--color-gsp-surface-raised)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-gsp-border-muted)]">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="originality_declaration"
                      name="originality_declaration"
                      type="checkbox"
                      value="true"
                      required={currentStep === 5}
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
            <div className="pt-6 mt-6 border-t border-[var(--color-gsp-border-muted)] flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                className={`py-2 px-6 rounded-md font-medium text-[var(--color-gsp-text-primary)] bg-[var(--color-gsp-surface-muted)] border border-[var(--color-gsp-border-default)] hover:bg-[var(--color-gsp-surface-raised)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                Back
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="py-2 px-8 rounded-md font-medium text-white bg-[#2F115D] hover:bg-[#3d167a] shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F115D] transition-colors"
                >
                  Continue
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    name="status"
                    value="draft"
                    formNoValidate
                    disabled={loading}
                    className="py-2 px-6 rounded-md font-medium text-[var(--color-gsp-text-primary)] bg-[var(--color-gsp-surface-muted)] hover:bg-[var(--color-gsp-surface-raised)] border border-[var(--color-gsp-border-default)] shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    name="status"
                    value="submitted"
                    disabled={loading}
                    className="py-2 px-8 rounded-md font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-[var(--shadow-1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Publication'}
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
