'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Sparkles,
  Settings2,
  Grid2X2,
  MessageSquare,
  LayoutDashboard,
  PhoneCall,
  Handshake,
  Home,
  Building,
  Receipt,
  MessageCircle,
  MessageSquareCode,
  Calendar,
  Users,
  Settings,
  GitMerge,
  LogOut,
  User as UserIcon,
  ChevronRight,
  ChevronDown,
  Bot,
  AudioLines,
  Mic,
  Filter,
  GitBranch,
  Tag
} from 'lucide-react'

const navItems = [
  { name: 'Fb Leads', href: '/crm/fb-leads', icon: Grid2X2 },
  { name: 'Campaign Settings', href: '/crm/campaign-settings', icon: MessageSquare },
  { name: 'Dashboard', href: '/crm/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/crm/leads', icon: PhoneCall },
  { name: 'Channel Partners', href: '/crm/channel-partners', icon: Handshake },
  { name: 'Properties', href: '/crm/properties', icon: Home },
  { name: 'Projects', href: '/crm/projects', icon: Building },
  { name: 'Bookings', href: '/crm/bookings', icon: Receipt },
  { name: 'WhatsApp', href: '/crm/whatsapp', icon: MessageCircle },
  { name: 'Manual-WhatsApp', href: '/crm/manual-whatsapp', icon: MessageSquareCode },
  { name: 'Whatsapp Message Templates', href: '/crm/whatsapp-message-templates', icon: MessageSquareCode },
  { name: 'Google Calender', href: '/crm/google-calendar', icon: Calendar },
  { name: 'Users', href: '/crm/users', icon: Users },
  { name: 'Settings', href: '/crm/settings', icon: Settings },
  { name: 'Merge Lead', href: '/crm/merge-lead', icon: GitMerge },
]

export function CrmSidebar() {
  const pathname = usePathname()
  const [isAiFeaturesOpen, setIsAiFeaturesOpen] = useState(true)
  const [isLmOpen, setIsLmOpen] = useState(true)

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 overflow-hidden z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">AI CRM</h1>
            <p className="text-xs text-slate-500">Real Estate</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        
        {/* Top Sections */}
        <div className="space-y-1 mb-4">
          <div className="space-y-1">
            <button 
              onClick={() => setIsAiFeaturesOpen(!isAiFeaturesOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-fuchsia-500" />
                <span className="font-medium text-sm">AI Features</span>
              </div>
              {isAiFeaturesOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {/* AI Features Sub-links */}
            {isAiFeaturesOpen && (
              <div className="pl-11 pr-3 space-y-1 py-1">
                <Link 
                  href="/crm/ai-agents" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/ai-agents' ? 'bg-fuchsia-50 text-fuchsia-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Bot className="w-4 h-4" />
                  AI Agents
                </Link>
                <Link 
                  href="/crm/sound-effect" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/sound-effect' ? 'bg-fuchsia-50 text-fuchsia-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <AudioLines className="w-4 h-4" />
                  Sound Effect
                </Link>
                <Link 
                  href="/crm/voices" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/voices' ? 'bg-fuchsia-50 text-fuchsia-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Mic className="w-4 h-4" />
                  Voices
                </Link>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <button 
              onClick={() => setIsLmOpen(!isLmOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-sm">LM</span>
              </div>
              {isLmOpen ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {/* LM Sub-links */}
            {isLmOpen && (
              <div className="pl-11 pr-3 space-y-1 py-1">
                <Link 
                  href="/crm/lead-sources" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/lead-sources' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Filter className="w-4 h-4" />
                  Lead Sources
                </Link>
                <Link 
                  href="/crm/lead-stages" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/lead-stages' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <GitBranch className="w-4 h-4" />
                  Lead Stages
                </Link>
                <Link 
                  href="/crm/lead-status" 
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${pathname === '/crm/lead-status' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Tag className="w-4 h-4" />
                  Lead Status
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Links */}
        <nav className="space-y-1 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.name === 'Dashboard' && pathname?.includes('/crm/dashboard'))
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 leading-tight">Darp...</span>
              <span className="text-xs text-slate-500">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500">
              <UserIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
