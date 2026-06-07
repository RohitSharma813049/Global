import React from "react";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 ml-64">
        {/* Top Header Placeholder (can be moved to a component later) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search papers, authors, or categories..." 
              className="w-96 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold shadow-sm">
              U
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
