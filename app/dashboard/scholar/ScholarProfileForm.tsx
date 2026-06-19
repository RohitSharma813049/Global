'use client'

import React, { useState } from 'react'
import { updateScholarProfile } from '@/app/actions/scholar-profile'

export default function ScholarProfileForm({ scholar }: { scholar: any }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const result = await updateScholarProfile(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else {
      setMessage('Profile updated successfully!')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-3 rounded-md text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biography</label>
        <textarea aria-label="Input field" 
          name="bio" 
          id="bio" 
          rows={4} 
          defaultValue={scholar.bio || ''}
          placeholder="Tell us about your academic background and research interests..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
          <input aria-label="Input field" 
            type="text" 
            name="institution" 
            id="institution" 
            defaultValue={scholar.institution || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Highest Qualification</label>
          <input aria-label="Input field" 
            type="text" 
            name="qualification" 
            id="qualification" 
            defaultValue={scholar.qualification || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
          <input aria-label="Input field" 
            type="text" 
            name="specialization" 
            id="specialization" 
            defaultValue={scholar.specialization || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Media Gallery</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="video_file" className="block text-sm font-medium text-gray-700">Featured Video</label>
            <input aria-label="Featured Video Upload" 
              type="file" 
              name="video_file" 
              id="video_file" 
              accept="video/mp4,video/webm,video/ogg"
              className="mt-1 block w-full px-3 py-1.5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" 
            />
            {scholar.video_url && <p className="mt-2 text-xs text-emerald-600">You currently have a featured video uploaded.</p>}
          </div>

          <div>
            <label htmlFor="gallery_images" className="block text-sm font-medium text-gray-700">Gallery Photos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="gallery_images" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                    <span>Add Photos</span>
                    <input aria-label="Input field" id="gallery_images" name="gallery_images" type="file" accept="image/*" multiple className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
              </div>
            </div>
            {scholar.gallery_images?.length > 0 && <p className="mt-2 text-xs text-emerald-600">You have {scholar.gallery_images.length} photo(s) in your gallery. Uploading new photos will add to them.</p>}
          </div>

          <div>
            <label htmlFor="gallery_videos" className="block text-sm font-medium text-gray-700">Gallery Videos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="gallery_videos" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-1">
                    <span>Add Videos</span>
                    <input aria-label="Input field" id="gallery_videos" name="gallery_videos" type="file" accept="video/mp4,video/webm,video/ogg" multiple className="sr-only" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">MP4, WEBM up to 50MB each</p>
              </div>
            </div>
            {scholar.gallery_videos?.length > 0 && <p className="mt-2 text-xs text-emerald-600">You have {scholar.gallery_videos.length} video(s) in your gallery. Uploading new videos will add to them.</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  )
}
