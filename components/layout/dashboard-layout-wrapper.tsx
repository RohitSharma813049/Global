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
    <div className="flex min-h-screen bg-[var(--color-gsp-surface-muted)] overflow-x-hidden max-w-[100vw] font-sans">
      <DashboardSidebar />
      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isPinned ? 'md:ml-64' : 'md:ml-20'} ml-0 flex flex-col min-h-screen`}>
        {/* Top Header Placeholder */}
        <header className="h-16 bg-[var(--color-gsp-surface-muted)] border-b border-[var(--color-gsp-border-muted)] flex items-center px-4 md:px-8 shadow-sm shrink-0 justify-between">
          <div className="flex items-center gap-4">
              <button 
                className="md:hidden p-2 -ml-2 text-[var(--color-gsp-text-primary)] hover:bg-[var(--color-gsp-border-muted)] rounded-[var(--radius-sm)] transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MdMenu className="w-6 h-6" />
              </button>

            {/* Logo removed since sidebar is now visible for all users */}

            <div className="hidden sm:block flex-1 max-w-md">
              <input aria-label="Input field" 
              type="text" 
                placeholder="Search..." 
                className="w-full px-4 py-2 bg-white border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-sm)] text-[var(--font-size-md)] text-[var(--color-gsp-text-primary)] placeholder-[var(--color-gsp-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gsp-text-inverse)] focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            {role === 'user' && (
              <BecomeScholarModal>
                <button className="flex items-center px-3 py-1.5 md:px-5 md:py-2 bg-[var(--color-gsp-text-inverse)] text-white text-[var(--font-size-md)] font-semibold rounded-[var(--radius-sm)] hover:bg-[#4A1F8C] hover:shadow-[var(--shadow-1)] transition-all">
                  Become a Scholar
                </button>
              </BecomeScholarModal>
            )}
            <NotificationsDropdown />
            <div className="w-8 h-8 bg-[#F4F1FA] text-[var(--color-gsp-text-inverse)] rounded-full flex items-center justify-center font-bold shadow-sm overflow-hidden">
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
              className="p-2 text-[var(--color-gsp-text-primary)] hover:text-red-600 transition-colors rounded-full hover:bg-red-50 hidden sm:flex"
              title="Log out"
            >
              <MdLogout className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-[var(--spacing-8)] pb-20 md:pb-[var(--spacing-8)] overflow-y-auto bg-[var(--color-gsp-surface-muted)] text-[var(--color-gsp-text-primary)]">
          {children}
        </main>
        
        {/* DashboardBottomNav removed as per user request to use mobile sidebar */}
      </div>
    </div>
  );
}
