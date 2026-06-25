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
import { useSidebar } from "./sidebar-context";

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const { isPinned, setIsPinned, setIsHovered, isExpanded } = useSidebar();

  const readerLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/library", icon: MdLibraryBooks },
    { name: "Saved Papers", href: "/library/saved", icon: MdBookmark },
    { name: "Become a Scholar", href: "/dashboard/scholar", icon: MdDescription },
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

  const links = role === "super_admin" || role === "admin" 
    ? adminLinks 
    : role === "scholar" 
      ? scholarLinks 
      : readerLinks;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col h-full bg-white border-r border-gray-200 shadow-sm fixed top-0 left-0 transition-all duration-300 ease-in-out z-50 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <div className={`p-6 border-b border-gray-100 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} overflow-hidden h-24`}>
        {isExpanded ? (
          <div className="whitespace-nowrap transition-opacity duration-300">
            <h2 className="text-2xl font-extrabold text-indigo-700 tracking-tight">Global Scholar</h2>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{role}</span>
          </div>
        ) : (
          <div className="w-10 h-10 bg-indigo-600 rounded-xl text-white flex items-center justify-center font-bold text-xl shrink-0">
            GS
          </div>
        )}
        
        {isExpanded && (
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-400 transition-colors ${isPinned ? 'text-indigo-600 bg-indigo-50' : ''}`}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <MdPushPin className={`text-lg transition-transform ${isPinned ? 'rotate-45' : 'rotate-0'}`} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 overflow-x-hidden">
        <Link 
          href="/dashboard"
          className={`flex items-center py-3 rounded-xl transition-all duration-200 ${isExpanded ? 'px-4' : 'justify-center px-0'} ${pathname === "/dashboard" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          title={!isExpanded ? "Overview" : ""}
        >
          <MdDashboard className={`text-xl ${isExpanded ? 'mr-3 text-lg' : ''}`} /> 
          {isExpanded && <span className="whitespace-nowrap">Overview</span>}
        </Link>
        
        {isExpanded && (
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Features</p>
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
              className={`flex items-center py-3 rounded-xl transition-all duration-200 ${isExpanded ? 'px-4' : 'justify-center px-0'} ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              title={!isExpanded ? link.name : ""}
            >
              <Icon className={`text-xl ${isExpanded ? 'mr-3 text-lg' : ''}`} /> 
              {isExpanded && <span className="whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-gray-100 ${!isExpanded ? 'flex flex-col items-center' : ''}`}>
        {role === "user" && (
          <BecomeScholarModal>
            <button 
              className={`flex items-center py-3 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 mb-2 ${isExpanded ? 'w-full px-4 text-sm font-medium' : 'justify-center w-12 h-12'}`}
              title={!isExpanded ? "Become a Scholar" : ""}
            >
              <MdSchool className={`text-xl ${isExpanded ? 'mr-3 text-lg' : ''}`} /> 
              {isExpanded && <span className="whitespace-nowrap">Become Scholar</span>}
            </button>
          </BecomeScholarModal>
        )}
        <Link 
          href="/dashboard/settings"
          className={`flex items-center py-3 rounded-xl transition-all duration-200 mb-2 ${isExpanded ? 'px-4 text-sm font-medium w-full' : 'justify-center w-12 h-12 px-0'} ${pathname === "/dashboard/settings" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          title={!isExpanded ? "Settings" : ""}
        >
          <MdSettings className={`text-xl ${isExpanded ? 'mr-3 text-lg' : ''}`} /> 
          {isExpanded && <span className="whitespace-nowrap">Settings</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className={`flex items-center py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-2 ${isExpanded ? 'w-full px-4 text-sm font-medium' : 'justify-center w-12 h-12 px-0'}`}
          title={!isExpanded ? "Logout" : ""}
        >
          <MdLogout className={`text-xl ${isExpanded ? 'mr-3 text-lg' : ''}`} /> 
          {isExpanded && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
}

