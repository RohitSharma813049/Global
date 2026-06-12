"use client";

import React, { useState } from "react";
import { MdNotifications, MdNotificationsNone, MdCheck } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/notifications";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
          {unreadCount > 0 ? (
            <MdNotifications className="w-6 h-6" />
          ) : (
            <MdNotificationsNone className="w-6 h-6" />
          )}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0 sm:mr-4 mt-2" align="end" sideOffset={5}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <MdCheck className="mr-1" /> Mark all read
            </button>
          )}
        </div>
        
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full">
              <MdNotificationsNone className="w-8 h-8 text-gray-300 mb-2" />
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notification.is_read ? 'opacity-70' : 'bg-indigo-50/30'}`}
                >
                  <Link href={notification.link || "#"} className="flex items-start gap-3 w-full">
                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${notification.is_read ? 'bg-transparent' : 'bg-indigo-600'}`} />
                    <div>
                      <p className={`text-sm ${notification.is_read ? 'text-gray-700 font-medium' : 'text-gray-900 font-semibold'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-md">
          <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
