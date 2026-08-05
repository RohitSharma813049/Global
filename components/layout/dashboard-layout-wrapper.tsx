"use client";
import React from "react";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import DashboardBottomNav from "@/components/layout/dashboard-bottom-nav";
import { useSidebar } from "@/components/sidebar-context";
import { MdLogout, MdMenu, MdSettings, MdSwapHoriz, MdHome } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BecomeScholarModal } from "@/components/become-scholar-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex min-h-screen bg-(--color-gsp-surface-muted) overflow-x-hidden max-w-[100vw] font-sans">
      <DashboardSidebar />
      <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isPinned ? 'md:ml-64' : 'md:ml-20'} ml-0 flex flex-col min-h-screen`}>
        {/* Top Header Placeholder */}
        <header className="h-16 bg-(--color-gsp-surface-muted) border-b border-(--color-gsp-border-muted) flex items-center px-4 md:px-8 shadow-sm shrink-0 justify-between">
          <div className="flex items-center gap-4">
              <button 
                className="md:hidden p-2 -ml-2 text-(--color-gsp-text-primary) hover:bg-(--color-gsp-border-muted) rounded-(--radius-sm) transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MdMenu className="w-6 h-6" />
              </button>

            {/* Logo removed since sidebar is now visible for all users */}

            <div className="hidden sm:block flex-1 max-w-md">
              {/* Search functionality is planned for a future update */}
            </div>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            {role === 'user' && (
              <BecomeScholarModal>
                <button className="flex items-center px-3 py-1.5 md:px-5 md:py-2 bg-(--color-gsp-text-inverse) text-white text-(--font-size-md) font-semibold rounded-(--radius-sm) hover:bg-[#4A1F8C] hover:shadow-(--shadow-1) transition-all">
                  Become a Scholar
                </button>
              </BecomeScholarModal>
            )}
            <NotificationsDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 bg-violet-soft text-(--color-gsp-text-inverse) rounded-full flex items-center justify-center font-bold shadow-sm overflow-hidden outline-none hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer">
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
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-100 shadow-lg rounded-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-gray-500">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-50 outline-none">
                    <MdHome className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Back to Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-50 outline-none">
                    <MdSettings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-3 text-sm rounded-md hover:bg-gray-50 outline-none" onClick={() => { signOut({ callbackUrl: '/' }) }}>
                  <MdSwapHoriz className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Switch Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-3 text-sm rounded-md text-red-600 focus:text-red-700 hover:bg-red-50 focus:bg-red-50 outline-none" onClick={() => signOut({ callbackUrl: '/' })}>
                  <MdLogout className="mr-3 h-4 w-4 text-red-600" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-(--spacing-8) pb-20 md:pb-(--spacing-8) overflow-y-auto bg-(--color-gsp-surface-muted) text-(--color-gsp-text-primary)">
          {children}
        </main>
        
        {/* DashboardBottomNav removed as per user request to use mobile sidebar */}
      </div>
    </div>
  );
}
