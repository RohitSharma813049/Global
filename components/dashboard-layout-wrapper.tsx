"use client";
import React from "react";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardBottomNav from "@/components/dashboard-bottom-nav";
import { useSidebar } from "./sidebar-context";
import { MdLogout } from "react-icons/md";
import { signOut, useSession } from "next-auth/react";
import { NotificationsDropdown } from "./notifications-dropdown";

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isPinned } = useSidebar();
  const { data: session } = useSession();
  
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden max-w-[100vw]">
      <DashboardSidebar />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isPinned ? 'md:ml-64' : 'md:ml-20'} ml-0 flex flex-col min-h-screen`}>
        {/* Top Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 shadow-sm shrink-0">
          <div className="flex-1">
            <input aria-label="Input field" 
              type="text" 
              placeholder="Search..." 
              className="w-full md:w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <NotificationsDropdown />
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold shadow-sm">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
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
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
          {children}
        </main>
        
        <DashboardBottomNav />
      </div>
    </div>
  );
}
