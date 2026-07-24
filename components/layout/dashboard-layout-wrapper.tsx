"use client";
import React from "react";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import DashboardBottomNav from "@/components/layout/dashboard-bottom-nav";
import { useSidebar } from "@/components/sidebar-context";
import { MdLogout, MdMenu } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BecomeScholarModal } from "@/components/become-scholar-modal";

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isPinned, setIsMobileMenuOpen } = useSidebar();
  const { data: session } = useSession();
  const role = session?.user?.role || "user";
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.image) {
      setLocalAvatar(session.user.image);
    }
  }, [session?.user?.image]);

  useEffect(() => {
    const handleAvatarUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setLocalAvatar(customEvent.detail || null);
      }
    };
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden max-w-[100vw]">
      <DashboardSidebar />
      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isPinned ? 'md:ml-64' : 'md:ml-20'} ml-0 flex flex-col min-h-screen`}>
        {/* Top Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 shadow-sm shrink-0 justify-between">
          <div className="flex items-center gap-4">
              <button 
                className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MdMenu className="w-6 h-6" />
              </button>

            {/* Logo removed since sidebar is now visible for all users */}

            <div className="hidden sm:block flex-1 max-w-md">
              <input aria-label="Input field" 
              type="text" 
                placeholder="Search..." 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            {role === 'user' && (
              <BecomeScholarModal>
                <button className="flex items-center px-3 py-1.5 md:px-5 md:py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 hover:shadow-md transition-all">
                  Become a Scholar
                </button>
              </BecomeScholarModal>
            )}
            <NotificationsDropdown />
            <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold shadow-sm overflow-hidden">
              {localAvatar ? (
                <img 
                  key={localAvatar}
                  src={localAvatar} 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }} 
                />
              ) : null}
              <div 
                className="w-full h-full flex items-center justify-center" 
                style={{ display: localAvatar ? 'none' : 'flex' }}
              >
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : session?.user?.email ? session.user.email.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 hidden sm:flex"
              title="Log out"
            >
              <MdLogout className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
          {children}
        </main>
        
        {/* DashboardBottomNav removed as per user request to use mobile sidebar */}
      </div>
    </div>
  );
}
