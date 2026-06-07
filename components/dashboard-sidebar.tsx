"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  MdDashboard, 
  MdLibraryBooks, 
  MdBookmark, 
  MdExplore, 
  MdAnalytics, 
  MdDescription, 
  MdPeople, 
  MdSettings, 
  MdLogout,
  MdPendingActions
} from "react-icons/md";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";

  const readerLinks = [
    { name: "My Library", href: "/dashboard/library", icon: MdLibraryBooks },
    { name: "Saved Papers", href: "/dashboard/saved", icon: MdBookmark },
    { name: "Discover", href: "/dashboard/discover", icon: MdExplore },
  ];

  const scholarLinks = [
    ...readerLinks,
    { name: "My Publications", href: "/dashboard/publications", icon: MdDescription },
    { name: "Drafts", href: "/dashboard/drafts", icon: MdAnalytics },
  ];

  const adminLinks = [
    { name: "User Management", href: "/dashboard/admin/users", icon: MdPeople },
    { name: "Review Submissions", href: "/dashboard/admin/reviews", icon: MdPendingActions },
  ];

  const links = role === "super_admin" || role === "admin" 
    ? [...scholarLinks, ...adminLinks] 
    : role === "scholar" 
      ? scholarLinks 
      : readerLinks;

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm w-64 fixed top-0 left-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">Global Scholar</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{role} Dashboard</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <Link 
          href="/dashboard"
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${pathname === "/dashboard" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
        >
          <MdDashboard className="mr-3 text-lg" /> Overview
        </Link>
        
        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Features</p>
        </div>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Icon className="mr-3 text-lg" /> {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link 
          href="/dashboard/settings"
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${pathname === "/dashboard/settings" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
        >
          <MdSettings className="mr-3 text-lg" /> Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-2"
        >
          <MdLogout className="mr-3 text-lg" /> Logout
        </button>
      </div>
    </div>
  );
}
