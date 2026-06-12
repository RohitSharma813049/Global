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
        <textarea 
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
          <input 
            type="text" 
            name="institution" 
            id="institution" 
            defaultValue={scholar.institution || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
        </div>

        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">Highest Qualification</label>
          <input 
            type="text" 
            name="qualification" 
            id="qualification" 
            defaultValue={scholar.qualification || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
          <input 
            type="text" 
            name="specialization" 
            id="specialization" 
            defaultValue={scholar.specialization || ''}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" 
          />
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
