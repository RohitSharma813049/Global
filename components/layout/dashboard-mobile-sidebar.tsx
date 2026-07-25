"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  MdDashboard, 
  MdLibraryBooks, 
  MdBookmark, 
  MdExplore, 
  MdDescription, 
  MdPeople, 
  MdSettings, 
  MdLogout,
  MdPendingActions,
  MdSchool,
  MdMenu
} from "react-icons/md";
import { BecomeScholarModal } from "@/components/become-scholar-modal";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

export default function DashboardMobileSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "user";
  const [open, setOpen] = useState(false);

  const readerLinks = [
    { name: "Explore", href: "/explore", icon: MdExplore },
    { name: "My Library", href: "/library/saved", icon: MdLibraryBooks },
    { name: "Saved Papers", href: "/library/saved", icon: MdBookmark },
  ];

  const scholarLinks = [
    ...readerLinks,
    { name: "Scholar Profile", href: "/dashboard/scholar", icon: MdDescription },
    { name: "Upload Publication", href: "/dashboard/scholar/upload", icon: MdLibraryBooks },
  ];

  const adminLinks = [
    { name: "Scholar Applications", href: "/dashboard/admin/scholar-applications", icon: MdPeople },
    { name: "Review Publications", href: "/dashboard/admin/publications", icon: MdPendingActions },
    { name: "Categories", href: "/dashboard/admin/categories", icon: MdBookmark },
    { name: "Content Types", href: "/dashboard/admin/content-types", icon: MdSettings },
  ];

  const links = role === "super_admin" || role === "admin" 
    ? adminLinks 
    : role === "scholar" 
      ? scholarLinks 
      : readerLinks;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-md md:hidden">
          <MdMenu className="text-2xl" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-white flex flex-col">
        <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="whitespace-nowrap flex flex-col justify-center w-full px-1">
            <img src="/logo1.png" alt="Global Scholar" className="h-10 w-auto object-contain object-left mb-1" />
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider ml-1">{role.replace('_', ' ')} Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <SheetClose asChild>
            <Link 
              href="/dashboard"
              className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${pathname === "/dashboard" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <MdDashboard className="text-xl mr-3 text-lg" /> 
              <span className="whitespace-nowrap">Overview</span>
            </Link>
          </SheetClose>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Features</p>
          </div>
          
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <SheetClose asChild key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <Icon className="text-xl mr-3 text-lg" /> 
                  <span className="whitespace-nowrap">{link.name}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          {role === "user" && (
            <SheetClose asChild>
              <BecomeScholarModal>
                <button className="flex items-center w-full py-3 px-4 rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 mb-2 text-sm font-medium">
                  <MdSchool className="text-xl mr-3 text-lg" /> 
                  <span className="whitespace-nowrap">Become Scholar</span>
                </button>
              </BecomeScholarModal>
            </SheetClose>
          )}
          <SheetClose asChild>
            <Link 
              href={role === 'admin' || role === 'super_admin' ? '/dashboard/admin/settings' : '/dashboard/settings'}
              className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 mb-2 w-full text-sm font-medium ${(pathname === "/dashboard/settings" || pathname === "/dashboard/admin/settings") ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <MdSettings className="text-xl mr-3 text-lg" /> 
              <span className="whitespace-nowrap">Settings</span>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center w-full py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-2 text-sm font-medium"
            >
              <MdLogout className="text-xl mr-3 text-lg" /> 
              <span className="whitespace-nowrap">Logout</span>
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

