'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function ScholarSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    startTransition(() => {
      if (val) {
        router.push(`/dashboard/admin/scholars?q=${encodeURIComponent(val)}`)
      } else {
        router.push('/dashboard/admin/scholars')
      }
    })
  }

  return (
    <div className="relative w-full max-w-sm mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        className="pl-10"
        placeholder="Search by username, name, or email..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  )
}
