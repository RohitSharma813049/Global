'use client'

import { useState, useEffect } from 'react'
import { submitHelpRequest } from '@/app/actions/help'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Footer from '@/components/layout/footer'
import { useSession } from 'next-auth/react'

export default function HelpPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }))
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitHelpRequest(formData)
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="min-h-screen py-24 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-500 mb-8">Send us a message and we'll get back to you shortly.</p>

          {success && (
            <div className="bg-green-100 text-green-800 p-4 rounded-md mb-6">
              Your message has been sent successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  readOnly={!!session?.user?.name}
                  className={session?.user?.name ? "bg-gray-100 cursor-not-allowed" : ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  required 
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  readOnly={!!session?.user?.email}
                  className={session?.user?.email ? "bg-gray-100 cursor-not-allowed" : ""}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                required 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                required 
                rows={6}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your issue or question..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
