'use client'

import { useState } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = 'Image URL' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2 items-center">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
          placeholder="https://example.com/image.jpg"
        />
        <span className="text-sm text-gray-500 font-medium">OR</span>
        <div className="relative">
          <input 
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
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {value && (
        <div className="mt-2 h-32 w-64 bg-gray-100 rounded-lg overflow-hidden border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
