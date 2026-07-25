'use client'

import { useState, useEffect } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  linksOnly?: boolean
  hideLink?: boolean
}

export default function ImageUpload({ value, onChange, label = 'Image', linksOnly = false, hideLink = true }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showGallery, setShowGallery] = useState(false)
  const [libraryImages, setLibraryImages] = useState<string[]>([])
  const [loadingGallery, setLoadingGallery] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      if (data.success) {
        onChange(data.url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError('An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  const openGallery = async () => {
    setShowGallery(true)
    setLoadingGallery(true)
    try {
      const res = await fetch('/api/images')
      const data = await res.json()
      if (data.success) {
        setLibraryImages(data.images)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingGallery(false)
    }
  }

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 items-center flex-wrap">
        {!hideLink && (
          <input aria-label="Input field" 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            className="flex-1 min-w-50 border border-gray-300 rounded-lg p-2 text-sm"
            placeholder="https://example.com/image.jpg"
          />
        )}
        <div className="flex gap-2">
          <div className="relative">
            <input aria-label="Input field" 
              type="file" 
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button 
              type="button" 
              disabled={isUploading}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {value && (
        <div className="mt-2 h-32 w-64 bg-gray-100 rounded-lg overflow-hidden border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Media Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg text-gray-900">Media Library</h3>
              <button onClick={() => setShowGallery(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingGallery ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : libraryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryImages.map((img) => (
                    <div 
                      key={img} 
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                      onClick={() => {
                        onChange(img)
                        setShowGallery(false)
                      }}
                    >
                      <img src={img} alt="Library photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No images uploaded yet.
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-xl">
              <button onClick={() => setShowGallery(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
