'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'

export interface RecordItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type?: string;
  originalData?: any;
}

interface RecordPickerProps {
  label: string;
  items: RecordItem[];
  onSelect: (item: RecordItem) => void;
  placeholder?: string;
}

export default function RecordPicker({ label, items, onSelect, placeholder = "Search and select..." }: RecordPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="relative w-full" ref={ref}>
      <label className="block text-xs font-medium text-(--color-gsp-text-secondary) mb-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-(--color-gsp-border-default) rounded-md p-2 text-sm bg-white flex justify-between items-center cursor-pointer hover:border-indigo-400"
      >
        <span className="text-gray-500">{placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 flex flex-col">
          <div className="sticky top-0 bg-white p-2 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto py-1 flex-1">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">No results found.</div>
            ) : (
              filteredItems.map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    onSelect(item)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="px-3 py-2 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
                >
                  {item.image && (
                    <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                    {item.subtitle && <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>}
                  </div>
                  {item.type && (
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {item.type}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
