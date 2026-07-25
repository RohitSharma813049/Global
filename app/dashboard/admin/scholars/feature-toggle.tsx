'use client'

import { useTransition } from "react"
import { toggleFeaturedScholar } from "@/app/actions/scholar-management"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

export default function FeatureToggle({ scholarId, isFeatured }: { scholarId: string, isFeatured: boolean }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (checked: boolean) => {
    startTransition(async () => {
      const res = await toggleFeaturedScholar(scholarId, checked)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(checked ? "Scholar featured!" : "Scholar removed from featured.")
      }
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={isFeatured} 
        onCheckedChange={handleToggle} 
        disabled={isPending}
      />
      <span className="text-sm text-(--color-gsp-text-secondary)">
        {isPending ? 'Updating...' : isFeatured ? 'Featured' : 'Not Featured'}
      </span>
    </div>
  )
}
