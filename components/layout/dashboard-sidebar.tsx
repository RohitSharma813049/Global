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
  MdPendingActions,
  MdSchool,
  MdPushPin,
  MdArticle,
  MdNewspaper,
  MdWeb,
  MdStar,
  MdPerson,
  MdDeleteSweep
} from "react-icons/md";
import { useSidebar } from "@/components/sidebar-context";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const { isPinned, setIsPinned, setIsHovered, isExpanded, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

  const readerLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/dashboard/user/library", icon: MdLibraryBooks },
  ];

  const scholarLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/dashboard/scholar/library", icon: MdLibraryBooks },
    { name: "Scholar Profile", href: "/dashboard/scholar", icon: MdDescription },
    { name: "My Publications", href: "/dashboard/scholar/publications", icon: MdLibraryBooks },
    { name: "Upload Publication", href: "/dashboard/scholar/upload", icon: MdBookmark },
    { name: "Analytics", href: "/dashboard/scholar/analytics", icon: MdAnalytics },
  ];

  const adminLinks = [
    { name: "User Management", href: "/dashboard/admin/users", icon: MdPeople },
    { name: "Scholar Applications", href: "/dashboard/admin/scholar-applications", icon: MdPeople },
    { name: "Review Publications", href: "/dashboard/admin/publications", icon: MdPendingActions },
    { name: "Categories", href: "/dashboard/admin/categories", icon: MdBookmark },
    { name: "Content Types", href: "/dashboard/admin/content-types", icon: MdLibraryBooks },
    { name: "Featured Scholars", href: "/dashboard/admin/featured-scholars", icon: MdPerson },
    { name: "Testimonials", href: "/dashboard/admin/testimonials", icon: MdStar },
    { name: "Blogs", href: "/dashboard/admin/blogs", icon: MdArticle },
    { name: "News", href: "/dashboard/admin/news", icon: MdNewspaper },
    { name: "Recycle Bin", href: "/dashboard/admin/recycle-bin", icon: MdDeleteSweep },
  ];

  const superAdminLinks = [
    { name: "Audit Logs", href: "/dashboard/super-admin/audit-logs", icon: MdLibraryBooks },
    { name: "User Management", href: "/dashboard/admin/users", icon: MdPeople },
    { name: "Scholar Applications", href: "/dashboard/admin/scholar-applications", icon: MdPeople },
    { name: "Review Publications", href: "/dashboard/admin/publications", icon: MdPendingActions },
    { name: "Categories", href: "/dashboard/admin/categories", icon: MdBookmark },
    { name: "Content Types", href: "/dashboard/admin/content-types", icon: MdLibraryBooks },
    { name: "Featured Scholars", href: "/dashboard/admin/featured-scholars", icon: MdPerson },
    { name: "Testimonials", href: "/dashboard/admin/testimonials", icon: MdStar },
    { name: "Blogs", href: "/dashboard/admin/blogs", icon: MdArticle },
    { name: "News", href: "/dashboard/admin/news", icon: MdNewspaper },
    { name: "Help Messages", href: "/dashboard/super-admin/help-messages", icon: MdArticle },
    { name: "Recycle Bin", href: "/dashboard/super-admin/recycle-bin", icon: MdDeleteSweep },
  ];

  const links = role === "super_admin" 
    ? superAdminLinks
    : role === "admin" 
      ? adminLinks 
      : role === "scholar" 
        ? scholarLinks 
        : readerLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex flex-col h-full bg-(--color-gsp-surface-muted) border-r border-(--color-gsp-border-muted) shadow-(--shadow-2) fixed top-0 transition-all duration-300 ease-in-out z-50 
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isMobileMenuOpen ? 'left-0 w-64' : '-left-64 md:left-0'}`}
      >
      <div className={`p-5 border-b border-(--color-gsp-border-muted) flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} overflow-hidden h-20`}>
        {isExpanded ? (
          <Link href="/" className="whitespace-nowrap flex flex-col justify-center transition-opacity duration-300 w-full px-2 mt-2 hover:opacity-80 transition-opacity">
            <img src="/logo1.png" alt="Global Scholar" className="h-10 w-auto object-contain object-left mb-1" />
            <span className="text-[10px] font-bold text-(--color-gsp-text-inverse) uppercase tracking-wider ml-1">{role.replace('_', ' ')} Dashboard</span>
          </Link>
        ) : (
          <Link href="/" className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
            <img src="/favicon.png" alt="Global Scholar" className="w-full h-full object-contain" />
          </Link>
        )}
        
        {isExpanded && (
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-(--radius-sm) text-(--color-gsp-text-primary) hover:text-(--color-gsp-text-inverse) hover:bg-violet-soft transition-all ${isPinned ? 'text-(--color-gsp-text-inverse) bg-violet-soft' : ''}`}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <MdPushPin className={`text-lg transition-transform ${isPinned ? 'rotate-45' : 'rotate-0'}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1 overflow-x-hidden custom-scrollbar">
        <Link 
          href="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center py-2.5 rounded-(--radius-sm) transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'px-3 text-(--font-size-md)' : 'justify-center px-0'} ${pathname === "/dashboard" ? "bg-violet-soft text-(--color-gsp-text-inverse) font-semibold" : "text-(--color-gsp-text-primary) hover:bg-gray-50 hover:text-(--color-gsp-text-secondary)"}`}
          title={!isExpanded && !isMobileMenuOpen ? "Overview" : ""}
        >
          <MdDashboard className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-2' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">Overview</span>}
        </Link>
        
        {(isExpanded || isMobileMenuOpen) && (
          <div className="pt-5 pb-2">
            <p className="px-3 text-2.75 font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Features</p>
          </div>
        )}
        {!isExpanded && <div className="h-4"></div>}
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center py-2.5 rounded-(--radius-sm) transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'px-3 text-(--font-size-md)' : 'justify-center px-0'} ${isActive ? "bg-violet-soft text-(--color-gsp-text-inverse) font-semibold" : "text-(--color-gsp-text-primary) hover:bg-gray-50 hover:text-(--color-gsp-text-secondary)"}`}
              title={!isExpanded && !isMobileMenuOpen ? link.name : ""}
            >
              <Icon className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-2' : ''}`} /> 
              {(isExpanded || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 pb-4 border-t border-(--color-gsp-border-muted) ${(!isExpanded && !isMobileMenuOpen) ? 'flex flex-col items-center' : ''}`}>
        <Link 
          href={role === 'admin' || role === 'super_admin' ? '/dashboard/admin/settings' : '/dashboard/settings'}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center py-2.5 rounded-(--radius-sm) transition-all duration-200 mb-1 ${isExpanded || isMobileMenuOpen ? 'px-3 text-(--font-size-md) font-medium w-full' : 'justify-center w-10 h-10 px-0'} ${(pathname === "/dashboard/settings" || pathname === "/dashboard/admin/settings") ? "bg-violet-soft text-(--color-gsp-text-inverse) font-semibold" : "text-(--color-gsp-text-primary) hover:bg-gray-50 hover:text-(--color-gsp-text-secondary)"}`}
          title={!isExpanded && !isMobileMenuOpen ? "Settings" : ""}
        >
          <MdSettings className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-2' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Settings</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className={`flex items-center py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'w-full px-3 text-sm font-medium' : 'justify-center w-10 h-10 px-0'}`}
          title={!isExpanded && !isMobileMenuOpen ? "Logout" : ""}
        >
          <MdLogout className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-2' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
    </>
  );
}

