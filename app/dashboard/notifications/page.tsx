"use client";

import React, { useState, useEffect } from "react";
import { MdNotificationsNone, MdCheckCircle, MdInfo, MdWarning } from "react-icons/md";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/app/actions/notifications";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const handleClearAll = () => {
    // We don't have a delete action yet, so just clear local state for now
    setNotifications([]);
  };

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <MdCheckCircle className="h-6 w-6 text-green-500" />;
      case "warning": return <MdWarning className="h-6 w-6 text-yellow-500" />;
      case "info": 
      default: return <MdInfo className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
        <div className="p-6 md:p-8 border-b border-(--color-gsp-border-muted) flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-(--color-gsp-text-primary) flex items-center">
              <MdNotificationsNone className="mr-2 h-7 w-7 text-(--color-gsp-text-inverse)" />
              Notifications
            </h1>
            <p className="text-(--color-gsp-text-secondary) mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleMarkAllAsRead} className="text-sm font-medium px-4 py-2 bg-(--color-gsp-surface-raised) text-(--color-gsp-text-primary) hover:bg-gray-100 rounded-(--radius-lg) transition-colors border border-(--color-gsp-border-muted)">
              Mark all as read
            </button>
            <button onClick={handleClearAll} className="text-sm font-medium px-4 py-2 bg-(--color-gsp-surface-raised) text-(--color-gsp-text-primary) hover:bg-gray-100 rounded-(--radius-lg) transition-colors border border-(--color-gsp-border-muted)">
              Clear all
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center bg-(--color-gsp-surface-muted)">
              <div className="bg-(--color-gsp-surface-raised) h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <MdNotificationsNone className="h-8 w-8 text-(--color-gsp-text-secondary)" />
              </div>
              <h3 className="text-lg font-medium text-(--color-gsp-text-primary)">No notifications</h3>
              <p className="mt-1 text-(--color-gsp-text-secondary) max-w-sm mx-auto">
                You're all caught up! When you receive notifications, they will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 hover:bg-(--color-gsp-surface-raised) transition-colors flex gap-4 ${notification.is_read ? 'bg-(--color-gsp-surface-muted)' : 'bg-violet-soft/20'}`}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                    <h3 className={`text-base ${notification.is_read ? 'text-(--color-gsp-text-primary) font-medium' : 'text-(--color-gsp-text-primary) font-bold'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-(--color-gsp-text-secondary) whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${notification.is_read ? 'text-(--color-gsp-text-secondary)' : 'text-(--color-gsp-text-primary)'}`}>
                    {notification.message}
                  </p>
                  
                  {!notification.is_read && (
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => handleMarkAsRead(notification.id)} className="text-xs font-medium text-(--color-gsp-text-inverse) hover:text-indigo-800 bg-violet-soft hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                        Mark as read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-4 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised) text-center">
            <p className="text-sm text-(--color-gsp-text-secondary)">End of notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
