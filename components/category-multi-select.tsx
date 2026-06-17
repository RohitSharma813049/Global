'use client'

import React, { useState } from 'react'
import { createCustomCategory } from '@/app/actions/taxonomy'
import { X, Plus, Loader2 } from 'lucide-react'

type Category = {
  id: string
  name: string
}

export function CategoryMultiSelect({ 
  categories, 
  onCategoriesUpdated
}: { 
  categories: Category[], 
  onCategoriesUpdated: (newCategory: Category) => void 
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [creating, setCreating] = useState(false)

  const toggleCategory = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return
    setCreating(true)
    const result = await createCustomCategory(newCategoryName.trim())
    setCreating(false)
    if (result.category) {
      onCategoriesUpdated(result.category)
      setSelectedIds(prev => [...prev, result.category.id])
      setNewCategoryName('')
    } else {
      alert(result.error || 'Failed to create category')
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden inputs to submit with form */}
      {selectedIds.map(id => (
        <input aria-label="Input field" key={`hidden-${id}`} type="hidden" name="subcategory_ids[]" value={id} />
      ))}

      <div className="flex flex-wrap gap-2">
        {categories.map(c => {
          const isSelected = selectedIds.includes(c.id)
          return (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isSelected 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.name}
              {isSelected && <X className="inline-block ml-1 h-3 w-3" />}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
          placeholder="Other (Type to create new subcategory)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !newCategoryName.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
          Add
        </button>
      </div>
    </div>
  )
}
