'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createScholar } from '@/app/actions/scholars'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Trash } from 'lucide-react'
import Link from 'next/link'

export default function CreateScholarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState([{ title: '', metadata: '', video_url: '', is_main_video: true }])
  const [publications, setPublications] = useState([{ title: '', metadata: '', tag: '', url: '' }])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      name: formData.get('name'),
      initials: formData.get('initials'),
      professional_role: formData.get('professional_role'),
      description: formData.get('description'),
      country: formData.get('country'),
      country_code: formData.get('country_code'),
      flag_emoji: formData.get('flag_emoji'),
      domain: formData.get('domain'),
      is_honorary: formData.get('is_honorary') === 'on',
      is_verified: formData.get('is_verified') === 'on',
      is_featured: formData.get('is_featured') === 'on',
      videos: videos.filter(v => v.title && v.video_url),
      publications: publications.filter(p => p.title && p.tag)
    }

    const res = await createScholar(payload)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Scholar created successfully!')
      router.push('/dashboard/admin/scholars')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/scholars">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Scholar</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input name="name" placeholder="Dr. Amira Al-Rashidi" required />
            </div>
            <div className="space-y-2">
              <Label>Initials</Label>
              <Input name="initials" placeholder="AR" required maxLength={3} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Professional Role</Label>
              <Input name="professional_role" placeholder="MD, Al-Rashidi Capital" required />
            </div>
            <div className="space-y-2">
              <Label>Domain / Industry</Label>
              <Input name="domain" placeholder="Investment & Finance" required />
            </div>
            <div className="space-y-2">
              <Label>Country Full Name</Label>
              <Input name="country" placeholder="United Arab Emirates" required />
            </div>
            <div className="space-y-2">
              <Label>Country Code</Label>
              <Input name="country_code" placeholder="UAE" required />
            </div>
            <div className="space-y-2">
              <Label>Flag Emoji</Label>
              <Input name="flag_emoji" placeholder="🇦🇪" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description / Bio</Label>
              <Textarea name="description" placeholder="A brief biography of the scholar..." rows={4} required />
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Status</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="is_honorary" name="is_honorary" />
              <Label htmlFor="is_honorary">Honorary Doctorate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="is_verified" name="is_verified" />
              <Label htmlFor="is_verified">Verified Profile</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="is_featured" name="is_featured" />
              <Label htmlFor="is_featured">Featured Scholar</Label>
            </div>
          </CardContent>
        </Card>

        {/* Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Videos</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setVideos([...videos, { title: '', metadata: '', video_url: '', is_main_video: false }])}>
              <Plus className="h-4 w-4 mr-2" /> Add Video
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {videos.map((vid, idx) => (
              <div key={idx} className="flex items-start gap-4 border p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <Input 
                    placeholder="Video Title" 
                    value={vid.title} 
                    onChange={e => { const v = [...videos]; v[idx].title = e.target.value; setVideos(v) }} 
                  />
                  <Input 
                    placeholder="URL (YouTube/Vimeo)" 
                    value={vid.video_url} 
                    onChange={e => { const v = [...videos]; v[idx].video_url = e.target.value; setVideos(v) }} 
                  />
                  <Input 
                    placeholder="Metadata (e.g. 14:32 · Recorded 2024)" 
                    value={vid.metadata} 
                    onChange={e => { const v = [...videos]; v[idx].metadata = e.target.value; setVideos(v) }} 
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id={`main-video-${idx}`}
                      checked={vid.is_main_video} 
                      onCheckedChange={c => { const v = [...videos]; v[idx].is_main_video = !!c; setVideos(v) }} 
                    />
                    <Label htmlFor={`main-video-${idx}`}>Main Video?</Label>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setVideos(videos.filter((_, i) => i !== idx))}>
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Publications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Publications</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setPublications([...publications, { title: '', metadata: '', tag: '', url: '' }])}>
              <Plus className="h-4 w-4 mr-2" /> Add Publication
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {publications.map((pub, idx) => (
              <div key={idx} className="flex items-start gap-4 border p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <Input 
                    placeholder="Publication Title" 
                    value={pub.title} 
                    onChange={e => { const p = [...publications]; p[idx].title = e.target.value; setPublications(p) }} 
                  />
                  <Input 
                    placeholder="Metadata (e.g. GSP · 2024)" 
                    value={pub.metadata} 
                    onChange={e => { const p = [...publications]; p[idx].metadata = e.target.value; setPublications(p) }} 
                  />
                  <Input 
                    placeholder="Tag (e.g. Article, eBook)" 
                    value={pub.tag} 
                    onChange={e => { const p = [...publications]; p[idx].tag = e.target.value; setPublications(p) }} 
                  />
                  <Input 
                    placeholder="External URL (Optional)" 
                    value={pub.url} 
                    onChange={e => { const p = [...publications]; p[idx].url = e.target.value; setPublications(p) }} 
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setPublications(publications.filter((_, i) => i !== idx))}>
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Scholar Profile'}
        </Button>
      </form>
    </div>
  )
}
