"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 pt-8 pb-4 text-left">
      <button 
        onClick={() => router.back()} 
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors bg-white hover:bg-indigo-50 border border-gray-200 px-3 py-1.5 rounded-md shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
      </button>
    </div>
  )
}
