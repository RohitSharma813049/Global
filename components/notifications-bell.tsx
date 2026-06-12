"use client"

import React, { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  link: string | null
  created_at: string
}

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
    // Optionally set up an interval to poll for new notifications here
    const interval = setInterval(fetchNotifications, 60000) // Poll every minute
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data as Notification[])
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      )
    }
    setIsOpen(false)
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0 shadow-xl border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Bell className="h-8 w-8 mb-2 text-gray-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.is_read ? 'bg-indigo-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notification.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
          <Link 
            href="/dashboard" 
            className="block text-center text-xs font-medium text-gray-600 hover:text-indigo-600 py-1"
            onClick={() => setIsOpen(false)}
          >
            View Dashboard
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
