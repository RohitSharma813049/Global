import React from 'react'
import { CrmSidebar } from '@/components/crm/crm-sidebar'
import { CrmHeader } from '@/components/crm/crm-header'

export const metadata = {
  title: 'AI CRM Real Estate',
  description: 'Real Estate CRM Dashboard Template',
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <CrmSidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <CrmHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
