"use client";

import React from "react";
import { MdNotificationsNone, MdCheckCircle, MdInfo, MdWarning } from "react-icons/md";

// Dummy data for notifications
const notifications = [
  {
    id: "1",
    title: "Application Approved",
    description: "Congratulations! Your scholar application has been reviewed and approved. You can now access all scholar features.",
    time: "2 hours ago",
    read: false,
    type: "success"
  },
  {
    id: "2",
    title: "New feature available",
    description: "Check out the new analytics dashboard for your publications. You can now track views and citations in real-time.",
    time: "1 day ago",
    read: false,
    type: "info"
  },
  {
    id: "3",
    title: "Paper published",
    description: "Your paper 'Quantum Computing in Cryptography' is now live and available to the public.",
    time: "3 days ago",
    read: true,
    type: "success"
  },
  {
    id: "4",
    title: "Profile update needed",
    description: "Please update your profile with your latest institution details to maintain your verified status.",
    time: "1 week ago",
    read: true,
    type: "warning"
  }
];

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length;

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MdNotificationsNone className="mr-2 h-7 w-7 text-indigo-600" />
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              Mark all as read
            </button>
            <button className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              Clear all
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-6 hover:bg-gray-50 transition-colors flex gap-4 ${notification.read ? 'bg-white' : 'bg-indigo-50/20'}`}
            >
              <div className="shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                  <h3 className={`text-base ${notification.read ? 'text-gray-800 font-medium' : 'text-gray-900 font-bold'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notification.description}
                </p>
                
                {!notification.read && (
                  <div className="mt-3 flex gap-3">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-500">End of notifications</p>
        </div>
      </div>
    </div>
  );
}
