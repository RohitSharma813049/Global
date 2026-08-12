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
          <h3 className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Biography</h3>
          <p className="mt-2 text-(--color-gsp-text-primary) whitespace-pre-wrap">{scholar.bio || 'No biography provided.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h3 className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Institution</h3>
            <p className="mt-1 text-(--color-gsp-text-primary)">{scholar.institution || 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Highest Qualification</h3>
            <p className="mt-1 text-(--color-gsp-text-primary)">{scholar.qualification || 'Not specified'}</p>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Specialization</h3>
            <p className="mt-1 text-(--color-gsp-text-primary)">{scholar.specialization || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-(--color-gsp-border-muted)">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-(--radius-lg) shadow-(--shadow-1) text-sm font-medium text-white bg-(--color-gsp-text-inverse) hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <MdEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* Display Media in Read-only mode */}
        {(scholar.video_url || (scholar.gallery_images && scholar.gallery_images.length > 0) || (scholar.gallery_videos && scholar.gallery_videos.length > 0)) && (
          <div className="pt-8 mt-4 border-t border-(--color-gsp-border-strong)">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-(--color-gsp-text-primary)">Media Gallery</h3>
            </div>
            
            {scholar.video_url && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-(--color-gsp-text-secondary) uppercase tracking-wider mb-4 opacity-80">Featured Video</h4>
                <div className="w-full max-w-3xl bg-(--color-gsp-surface-raised) rounded-(--radius-xl) shadow-lg overflow-hidden aspect-video flex items-center justify-center border border-(--color-gsp-border-default) transition-all duration-300 hover:shadow-xl">
                  <video src={scholar.video_url} controls className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {scholar.gallery_images && scholar.gallery_images.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-(--color-gsp-text-secondary) uppercase tracking-wider mb-4 opacity-80">Photo Gallery</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {scholar.gallery_images.map((url: string, index: number) => (
                    <div key={index} className="group relative aspect-square bg-(--color-gsp-surface-raised) rounded-(--radius-lg) shadow-sm overflow-hidden border border-(--color-gsp-border-muted) hover:border-purple-300 transition-all duration-300 cursor-pointer">
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scholar.gallery_videos && scholar.gallery_videos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-(--color-gsp-text-secondary) uppercase tracking-wider mb-4 opacity-80">Additional Videos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {scholar.gallery_videos.map((url: string, index: number) => (
                    <div key={index} className="bg-(--color-gsp-surface-raised) rounded-(--radius-lg) shadow-md overflow-hidden aspect-video flex items-center justify-center border border-(--color-gsp-border-default) transition-all duration-300 hover:shadow-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Full Name</label>
          <input aria-label="Input field" 
            type="text" 
            name="name" 
            id="name" 
            defaultValue={scholar.users?.raw_user_meta_data?.name || scholar.users?.raw_user_meta_data?.full_name || ''}
            placeholder="Dr. John Smith"
            className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Username / Handle</label>
          <input aria-label="Input field" 
            type="text" 
            name="username" 
            id="username" 
            defaultValue={scholar.username || ''}
            placeholder="johnsmith"
            className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Biography</label>
        <textarea aria-label="Input field" 
          name="bio" 
          id="bio" 
          rows={4} 
          defaultValue={scholar.bio || ''}
          placeholder="Scholar profile biography..."
          className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="institution" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Institution</label>
          <input aria-label="Input field" 
            type="text" 
            name="institution" 
            id="institution" 
            defaultValue={scholar.institution || ''}
            className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Highest Qualification</label>
          <input aria-label="Input field" 
            type="text" 
            name="qualification" 
            id="qualification" 
            defaultValue={scholar.qualification || ''}
            className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="specialization" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Specialization</label>
          <input aria-label="Input field" 
            type="text" 
            name="specialization" 
            id="specialization" 
            defaultValue={scholar.specialization || ''}
            className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
          />
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 mt-8">
        <h3 className="text-5 font-bold text-gray-900 mb-6">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="linkedin_url" className="block text-3.75 font-semibold text-gray-800 mb-1.5">LinkedIn URL</label>
            <input aria-label="Input field" 
              type="url" 
              name="linkedin_url" 
              id="linkedin_url" 
              defaultValue={scholar.linkedin_url || ''}
              placeholder="https://linkedin.com/in/username"
              className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
            />
          </div>
          <div>
            <label htmlFor="twitter_url" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Twitter (X) URL</label>
            <input aria-label="Input field" 
              type="url" 
              name="twitter_url" 
              id="twitter_url" 
              defaultValue={scholar.twitter_url || ''}
              placeholder="https://twitter.com/username"
              className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="website_url" className="block text-3.75 font-semibold text-gray-800 mb-1.5">Personal Website URL</label>
            <input aria-label="Input field" 
              type="url" 
              name="website_url" 
              id="website_url" 
              defaultValue={scholar.website_url || ''}
              placeholder="https://yourwebsite.com"
              className="block w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white" 
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 mt-8">
        <h3 className="text-5 font-bold text-gray-900 mb-6">Media Gallery</h3>
        
        <div className="space-y-8">
          <div>
            <label htmlFor="profile_photo" className="block text-3.75 font-semibold text-gray-800 mb-2">Profile Photo (Optional)</label>
            <input aria-label="Profile Photo Upload" 
              type="file" 
              name="profile_photo" 
              id="profile_photo" 
              accept="image/png,image/jpeg,image/webp"
              capture="user"
              className="block w-full border border-gray-200 rounded-md bg-white text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3E8FF] file:text-[#6B21A8] hover:file:bg-[#E9D5FF] cursor-pointer" 
            />
            {scholar.profile_photo_url && !deletedMedia.includes(scholar.profile_photo_url) && (
              <div className="mt-3 flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                <p className="text-3.25 text-gray-600 truncate mr-2">Current: {scholar.profile_photo_url.split('/').pop()}</p>
                <button type="button" onClick={() => handleRemoveMedia(scholar.profile_photo_url)} className="text-3.25 text-[#DC2626] font-medium px-3 py-1 bg-[#FEF2F2] rounded hover:bg-red-100 transition-colors">Remove</button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">If uploaded, this replaces your Google/GitHub avatar.</p>
          </div>

          <div>
            <label htmlFor="video_file" className="block text-3.75 font-semibold text-gray-800 mb-2">Featured Video</label>
            <input aria-label="Featured Video Upload" 
              type="file" 
              name="video_file" 
              id="video_file" 
              accept="video/mp4,video/webm,video/ogg"
              className="block w-full border border-gray-200 rounded-md bg-white text-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3E8FF] file:text-[#6B21A8] hover:file:bg-[#E9D5FF] cursor-pointer" 
            />
            {scholar.video_url && !deletedMedia.includes(scholar.video_url) && (
              <div className="mt-3 flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                <p className="text-3.25 text-gray-600 truncate mr-2">Current: {scholar.video_url.split('/').pop()}</p>
                <button type="button" onClick={() => handleRemoveMedia(scholar.video_url)} className="text-3.25 text-[#DC2626] font-medium px-3 py-1 bg-[#FEF2F2] rounded hover:bg-red-100 transition-colors">Remove</button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery_images" className="block text-3.75 font-semibold text-gray-800 mb-2">Gallery Photos</label>
            <div className="flex justify-center px-6 py-10 border-2 border-dashed border-gray-200 rounded-md hover:border-purple-400 transition-colors bg-[#FAFAFA] group relative cursor-pointer">
              <div className="space-y-2 text-center flex flex-col items-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 group-hover:text-purple-600 transition-colors">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                  <line x1="16" y1="2" x2="16" y2="6" className="text-black"></line>
                  <line x1="14" y1="4" x2="18" y2="4" className="text-black"></line>
                </svg>
                <div className="flex text-sm justify-center">
                  <label htmlFor="gallery_images" className="relative cursor-pointer rounded-md font-semibold text-[#4C1D95] hover:text-[#5B21B6]">
                    <span>Add Photos</span>
                    <input 
                      aria-label="Input field" 
                      id="gallery_images" 
                      name="gallery_images" 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      multiple 
                      className="sr-only" 
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        const currentCount = scholar.gallery_images?.filter((url: string) => !deletedMedia.includes(url)).length || 0;
                        if (currentCount + files.length > 10) {
                          alert(`You can only have a maximum of 10 gallery photos. You currently have ${currentCount}. Please select fewer photos.`);
                          e.target.value = '';
                          setSelectedPhotos([]);
                          return;
                        }
                        setSelectedPhotos(files);
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB each (Max 10 total)</p>
              </div>
            </div>
            {selectedPhotos.length > 0 && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                Selected: {selectedPhotos.map(f => f.name).join(', ')}
              </div>
            )}
            
            {scholar.gallery_images?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-3.25 font-semibold text-gray-700">Current Gallery Photos:</p>
                {scholar.gallery_images.filter((url: string) => !deletedMedia.includes(url)).map((url: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                    <p className="text-3.25 text-[#4C1D95] truncate mr-2">Image {index + 1}: {url.split('/').pop()}</p>
                    <button type="button" onClick={() => handleRemoveMedia(url)} className="text-3.25 text-[#DC2626] font-medium px-3 py-1 bg-[#FEF2F2] rounded hover:bg-red-100 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery_videos" className="block text-3.75 font-semibold text-gray-800 mb-2">Gallery Videos</label>
            <div className="flex justify-center px-6 py-10 border-2 border-dashed border-[#A855F7] rounded-md bg-[#FAFAFA] group relative cursor-pointer">
              <div className="space-y-2 text-center flex flex-col items-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 group-hover:text-purple-600 transition-colors">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                  <line x1="16" y1="2" x2="16" y2="6" className="text-black"></line>
                  <line x1="14" y1="4" x2="18" y2="4" className="text-black"></line>
                </svg>
                <div className="flex text-sm justify-center">
                  <label htmlFor="gallery_videos" className="relative cursor-pointer rounded-md font-semibold text-[#4C1D95] hover:text-[#5B21B6]">
                    <span>Add Videos</span>
                    <input 
                      aria-label="Input field" 
                      id="gallery_videos" 
                      name="gallery_videos" 
                      type="file" 
                      accept="video/mp4,video/webm,video/ogg" 
                      multiple 
                      className="sr-only" 
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        const currentCount = scholar.gallery_videos?.filter((url: string) => !deletedMedia.includes(url)).length || 0;
                        if (currentCount + files.length > 5) {
                          alert(`You can only have a maximum of 5 gallery videos. You currently have ${currentCount}. Please select fewer videos.`);
                          e.target.value = '';
                          setSelectedVideos([]);
                          return;
                        }
                        setSelectedVideos(files);
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">MP4, WEBM up to 50MB each (Max 5 total)</p>
              </div>
            </div>
            {selectedVideos.length > 0 && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                Selected: {selectedVideos.map(f => f.name).join(', ')}
              </div>
            )}
            
            {scholar.gallery_videos?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-3.25 font-semibold text-gray-700">Current Gallery Videos:</p>
                {scholar.gallery_videos.filter((url: string) => !deletedMedia.includes(url)).map((url: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                    <p className="text-3.25 text-[#4C1D95] truncate mr-2">Video {index + 1}: {url.split('/').pop()}</p>
                    <button type="button" onClick={() => handleRemoveMedia(url)} className="text-3.25 text-[#DC2626] font-medium px-3 py-1 bg-[#FEF2F2] rounded hover:bg-red-100 transition-colors">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
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
          className="px-6 py-2.5 border border-gray-200 rounded-md text-3.5 font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-md text-3.5 font-semibold text-white bg-[#2D1B69] hover:bg-[#1E1246] focus:outline-none disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
