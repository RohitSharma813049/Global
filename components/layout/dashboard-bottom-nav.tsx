"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  MdDashboard, 
  MdLibraryBooks, 
  MdBookmark, 
  MdExplore, 
  MdDescription, 
  MdPeople, 
  MdPendingActions,
  MdSettings,
  MdPerson
} from "react-icons/md";

export default function DashboardBottomNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";

  const readerLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "Library", href: "/library", icon: MdLibraryBooks },
    { name: "Apply", href: "/dashboard/scholar", icon: MdDescription },
  ];

  const scholarLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "Upload", href: "/dashboard/scholar/upload", icon: MdLibraryBooks },
    { name: "Profile", href: "/dashboard/scholar", icon: MdDescription },
  ];

  const adminLinks = [
    { name: "Applicants", href: "/dashboard/admin/scholar-applications", icon: MdPeople },
    { name: "Reviews", href: "/dashboard/admin/publications", icon: MdPendingActions },
  ];

  const specificLinks = role === "super_admin" || role === "admin" 
    ? adminLinks 
    : role === "scholar" 
      ? scholarLinks 
      : readerLinks;

  const links = [
    { name: "Overview", href: "/dashboard", icon: MdDashboard },
    ...specificLinks,
    { name: "Settings", href: "/dashboard/settings", icon: MdSettings },
  ];

  const displayLinks = links.slice(0, 5);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center">
        {displayLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-colors ${
                isActive ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? "bg-indigo-100/50" : ""}`}>
                <Icon className={`text-2xl ${isActive ? "scale-110" : ""}`} />
              </div>
              <span className={`text-2.5 mt-0.5 font-medium truncate w-full text-center ${isActive ? "text-indigo-700" : ""}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

