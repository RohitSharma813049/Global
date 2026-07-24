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
  MdPerson
} from "react-icons/md";
import { BecomeScholarModal } from "@/components/become-scholar-modal";
import { useSidebar } from "@/components/sidebar-context";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const { isPinned, setIsPinned, setIsHovered, isExpanded, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

  const readerLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/library", icon: MdLibraryBooks },
    { name: "Saved Papers", href: "/library/saved", icon: MdBookmark },
  ];

  const scholarLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/library", icon: MdLibraryBooks },
    { name: "Saved Papers", href: "/library/saved", icon: MdBookmark },
    { name: "Scholar Profile", href: "/dashboard/scholar", icon: MdDescription },
    { name: "Upload Publication", href: "/dashboard/scholar/upload", icon: MdLibraryBooks },
  ];

  const adminLinks = [
    { name: "User Management", href: "/dashboard/admin/users", icon: MdPeople },
    { name: "Scholar Applications", href: "/dashboard/admin/scholar-applications", icon: MdPeople },
    { name: "Review Publications", href: "/dashboard/admin/publications", icon: MdPendingActions },
    { name: "Categories", href: "/dashboard/admin/categories", icon: MdBookmark },
    { name: "Homepage Settings", href: "/dashboard/admin/settings", icon: MdWeb },
    { name: "Featured Scholars", href: "/dashboard/admin/featured-scholars", icon: MdPerson },
    { name: "Testimonials", href: "/dashboard/admin/testimonials", icon: MdStar },
    { name: "Blogs", href: "/dashboard/admin/blogs", icon: MdArticle },
    { name: "News", href: "/dashboard/admin/news", icon: MdNewspaper },
  ];

  const superAdminLinks = [
    { name: "Audit Logs", href: "/dashboard/super-admin/audit-logs", icon: MdLibraryBooks },
    ...adminLinks
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
        className={`flex flex-col h-full bg-white border-r border-gray-200 shadow-lg fixed top-0 transition-all duration-300 ease-in-out z-50 
          ${isExpanded ? 'w-64' : 'w-20'} 
          ${isMobileMenuOpen ? 'left-0 w-64' : '-left-64 md:left-0'}`}
      >
      <div className={`p-5 border-b border-gray-100 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} overflow-hidden h-20`}>
        {isExpanded ? (
          <div className="whitespace-nowrap flex items-center gap-3 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <img src="/logo1.png" alt="Global Scholar" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight leading-tight">Global Scholar</h2>
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{role.replace('_', ' ')}</span>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <img src="/logo1.png" alt="Global Scholar" className="w-full h-full object-contain" />
          </div>
        )}
        
        {isExpanded && (
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all ${isPinned ? 'text-purple-600 bg-purple-50' : ''}`}
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
          className={`flex items-center py-2.5 rounded-lg transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'px-3 text-sm' : 'justify-center px-0'} ${pathname === "/dashboard" ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          title={!isExpanded && !isMobileMenuOpen ? "Overview" : ""}
        >
          <MdDashboard className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-3' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">Overview</span>}
        </Link>
        
        {(isExpanded || isMobileMenuOpen) && (
          <div className="pt-5 pb-2">
            <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Features</p>
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
              className={`flex items-center py-2.5 rounded-lg transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'px-3 text-sm' : 'justify-center px-0'} ${isActive ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              title={!isExpanded && !isMobileMenuOpen ? link.name : ""}
            >
              <Icon className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-3' : ''}`} /> 
              {(isExpanded || isMobileMenuOpen) && <span className="font-medium whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-gray-100 ${(!isExpanded && !isMobileMenuOpen) ? 'flex flex-col items-center' : ''}`}>
        {role === "user" && (
          <BecomeScholarModal>
            <button 
              className={`flex items-center py-2.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200 mb-2 ${isExpanded || isMobileMenuOpen ? 'w-full px-3 text-sm font-semibold' : 'justify-center w-10 h-10'}`}
              title={!isExpanded && !isMobileMenuOpen ? "Become a Scholar" : ""}
            >
              <MdSchool className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-3' : ''}`} /> 
              {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Become Scholar</span>}
            </button>
          </BecomeScholarModal>
        )}
        <Link 
          href="/dashboard/settings"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center py-2.5 rounded-lg transition-all duration-200 mb-1 ${isExpanded || isMobileMenuOpen ? 'px-3 text-sm font-medium w-full' : 'justify-center w-10 h-10 px-0'} ${pathname === "/dashboard/settings" ? "bg-purple-50 text-purple-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          title={!isExpanded && !isMobileMenuOpen ? "Settings" : ""}
        >
          <MdSettings className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-3' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Settings</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className={`flex items-center py-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 ${isExpanded || isMobileMenuOpen ? 'w-full px-3 text-sm font-medium' : 'justify-center w-10 h-10 px-0'}`}
          title={!isExpanded && !isMobileMenuOpen ? "Logout" : ""}
        >
          <MdLogout className={`text-lg ${isExpanded || isMobileMenuOpen ? 'mr-3' : ''}`} /> 
          {(isExpanded || isMobileMenuOpen) && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
    </>
  );
}

