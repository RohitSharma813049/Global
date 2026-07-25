'use client'

import React, { useState, useRef, useEffect } from 'react'
import { updateScholarProfile } from '@/app/actions/scholar-profile'
import { MdEdit } from 'react-icons/md'

export default function ScholarProfileForm({ scholar }: { scholar: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [selectedVideos, setSelectedVideos] = useState<File[]>([])
  const [deletedMedia, setDeletedMedia] = useState<string[]>([])
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleRemoveMedia = (url: string) => {
    setDeletedMedia(prev => [...prev, url]);
    setIsDirty(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('deletedMedia', JSON.stringify(deletedMedia))
    
    try {
      const result = await updateScholarProfile(formData)
      
      if (result.error) {
        setMessage(`Error: ${result.error}`)
      } else {
        setMessage('Profile updated successfully!')
        setIsDirty(false)
        setIsEditing(false)
        setDeletedMedia([])
      }
    } catch (error: any) {
      if (error.message && error.message.includes('Unexpected end of form')) {
        setMessage('Error: The file is too large or the connection dropped (Unexpected end of form). Try a smaller file or wait for a stable connection.')
      } else {
        setMessage(`Error: ${error.message || 'Something went wrong during upload'}`)
      }
    }
    
    setLoading(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4 md:space-y-6">
        {message && (
          <div className={`p-3 rounded-md text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Biography</h3>
          <p className="mt-2 text-[var(--color-gsp-text-primary)] whitespace-pre-wrap">{scholar.bio || 'No biography provided.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Institution</h3>
            <p className="mt-1 text-[var(--color-gsp-text-primary)]">{scholar.institution || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Highest Qualification</h3>
            <p className="mt-1 text-[var(--color-gsp-text-primary)]">{scholar.qualification || 'Not specified'}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Specialization</h3>
            <p className="mt-1 text-[var(--color-gsp-text-primary)]">{scholar.specialization || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[var(--color-gsp-border-muted)]">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-[var(--radius-lg)] shadow-[var(--shadow-1)] text-sm font-medium text-white bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <MdEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* Display Media in Read-only mode */}
        {(scholar.video_url || (scholar.gallery_images && scholar.gallery_images.length > 0) || (scholar.gallery_videos && scholar.gallery_videos.length > 0)) && (
          <div className="pt-8 mt-4 border-t border-[var(--color-gsp-border-strong)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--color-gsp-text-primary)]">Media Gallery</h3>
            </div>
            
            {scholar.video_url && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-[var(--color-gsp-text-secondary)] uppercase tracking-wider mb-4 opacity-80">Featured Video</h4>
                <div className="w-full max-w-3xl bg-[var(--color-gsp-surface-raised)] rounded-[var(--radius-xl)] shadow-lg overflow-hidden aspect-video flex items-center justify-center border border-[var(--color-gsp-border-default)] transition-all duration-300 hover:shadow-xl">
                  <video src={scholar.video_url} controls className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {scholar.gallery_images && scholar.gallery_images.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-[var(--color-gsp-text-secondary)] uppercase tracking-wider mb-4 opacity-80">Photo Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {scholar.gallery_images.map((url: string, index: number) => (
                    <div key={index} className="group relative aspect-square bg-[var(--color-gsp-surface-raised)] rounded-[var(--radius-lg)] shadow-sm overflow-hidden border border-[var(--color-gsp-border-muted)] hover:border-purple-300 transition-all duration-300 cursor-pointer">
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scholar.gallery_videos && scholar.gallery_videos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-gsp-text-secondary)] uppercase tracking-wider mb-4 opacity-80">Additional Videos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {scholar.gallery_videos.map((url: string, index: number) => (
                    <div key={index} className="bg-[var(--color-gsp-surface-raised)] rounded-[var(--radius-lg)] shadow-md overflow-hidden aspect-video flex items-center justify-center border border-[var(--color-gsp-border-default)] transition-all duration-300 hover:shadow-lg">
                      <video src={url} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Biography</label>
        <textarea aria-label="Input field" 
          name="bio" 
          id="bio" 
          rows={4} 
          defaultValue={scholar.bio || ''}
          placeholder="Tell us about your academic background and research interests..."
          className="mt-1 block w-full px-3 py-2 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Institution</label>
          <input aria-label="Input field" 
            type="text" 
            name="institution" 
            id="institution" 
            defaultValue={scholar.institution || ''}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" 
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Highest Qualification</label>
          <input aria-label="Input field" 
            type="text" 
            name="qualification" 
            id="qualification" 
            defaultValue={scholar.qualification || ''}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" 
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="specialization" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Specialization</label>
          <input aria-label="Input field" 
            type="text" 
            name="specialization" 
            id="specialization" 
            defaultValue={scholar.specialization || ''}
            className="mt-1 block w-full px-3 py-2 border border-[var(--color-gsp-border-default)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-[var(--color-gsp-border-muted)]">
        <h3 className="text-lg font-medium text-[var(--color-gsp-text-primary)] mb-4">Media Gallery</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="video_file" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Featured Video</label>
            <input aria-label="Featured Video Upload" 
              type="file" 
              name="video_file" 
              id="video_file" 
              accept="video/mp4,video/webm,video/ogg"
              className="mt-1 block w-full px-3 py-1.5 border border-[var(--color-gsp-border-default)] bg-[var(--color-gsp-surface-muted)] rounded-md shadow-[var(--shadow-1)] focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm text-[var(--color-gsp-text-secondary)] file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F4F1FA] file:text-purple-700 hover:file:bg-purple-100" 
            />
            {scholar.video_url && !deletedMedia.includes(scholar.video_url) && (
              <div className="mt-2 flex items-center justify-between p-2 bg-[var(--color-gsp-surface-muted)] border border-[var(--color-gsp-border-default)] rounded-md">
                <p className="text-xs text-[var(--color-gsp-text-inverse)] truncate mr-2">Current: {scholar.video_url.split('/').pop()}</p>
                <button type="button" onClick={() => handleRemoveMedia(scholar.video_url)} className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded">Remove</button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery_images" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Photos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-purple-500 transition-colors bg-[var(--color-gsp-surface-raised)]">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-[var(--color-gsp-text-secondary)]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-[var(--color-gsp-text-secondary)] justify-center">
                  <label htmlFor="gallery_images" className="relative cursor-pointer bg-[var(--color-gsp-surface-muted)] rounded-md font-medium text-[var(--color-gsp-text-inverse)] hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-1">
                    <span>Add Photos</span>
                    <input 
                      aria-label="Input field" 
                      id="gallery_images" 
                      name="gallery_images" 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="sr-only" 
                      onChange={(e) => setSelectedPhotos(e.target.files ? Array.from(e.target.files) : [])}
                    />
                  </label>
                </div>
                <p className="text-xs text-[var(--color-gsp-text-secondary)]">PNG, JPG up to 5MB each</p>
              </div>
            </div>
            {selectedPhotos.length > 0 && (
              <div className="mt-2 text-xs text-green-600">
                Selected: {selectedPhotos.map(f => f.name).join(', ')}
              </div>
            )}
            
            {scholar.gallery_images?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-[var(--color-gsp-text-secondary)]">Current Gallery Photos:</p>
                {scholar.gallery_images.filter((url: string) => !deletedMedia.includes(url)).map((url: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[var(--color-gsp-surface-muted)] border border-[var(--color-gsp-border-default)] rounded-md">
                    <p className="text-xs text-[var(--color-gsp-text-inverse)] truncate mr-2">Image {index + 1}: {url.split('/').pop()}</p>
                    <button type="button" onClick={() => handleRemoveMedia(url)} className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery_videos" className="block text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Videos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-gsp-border-default)] border-dashed rounded-md hover:border-purple-500 transition-colors bg-[var(--color-gsp-surface-raised)]">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-[var(--color-gsp-text-secondary)]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-[var(--color-gsp-text-secondary)] justify-center">
                  <label htmlFor="gallery_videos" className="relative cursor-pointer bg-[var(--color-gsp-surface-muted)] rounded-md font-medium text-[var(--color-gsp-text-inverse)] hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-1">
                    <span>Add Videos</span>
                    <input 
                      aria-label="Input field" 
                      id="gallery_videos" 
                      name="gallery_videos" 
                      type="file" 
                      accept="video/mp4,video/webm,video/ogg" 
                      multiple 
                      className="sr-only" 
                      onChange={(e) => setSelectedVideos(e.target.files ? Array.from(e.target.files) : [])}
                    />
                  </label>
                </div>
                <p className="text-xs text-[var(--color-gsp-text-secondary)]">MP4, WEBM up to 50MB each</p>
              </div>
            </div>
            {selectedVideos.length > 0 && (
              <div className="mt-2 text-xs text-green-600">
                Selected: {selectedVideos.map(f => f.name).join(', ')}
              </div>
            )}
            
            {scholar.gallery_videos?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-[var(--color-gsp-text-secondary)]">Current Gallery Videos:</p>
                {scholar.gallery_videos.filter((url: string) => !deletedMedia.includes(url)).map((url: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[var(--color-gsp-surface-muted)] border border-[var(--color-gsp-border-default)] rounded-md">
                    <p className="text-xs text-[var(--color-gsp-text-inverse)] truncate mr-2">Video {index + 1}: {url.split('/').pop()}</p>
                    <button type="button" onClick={() => handleRemoveMedia(url)} className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-gsp-border-muted)]">
        <button
          type="button"
          onClick={() => {
            if (isDirty) {
              if (window.confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                setIsEditing(false);
                setIsDirty(false);
                setDeletedMedia([]);
              }
            } else {
              setIsEditing(false);
            }
          }}
          className="px-4 py-2 border border-[var(--color-gsp-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-1)] text-sm font-medium text-[var(--color-gsp-text-primary)] bg-[var(--color-gsp-surface-muted)] hover:bg-[var(--color-gsp-surface-raised)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-[var(--radius-lg)] shadow-[var(--shadow-1)] text-sm font-medium text-white bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
