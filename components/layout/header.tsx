'use client'
import { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MdDashboard, MdSwapHoriz, MdLogout, MdSettings, MdAdminPanelSettings } from 'react-icons/md'
import { Menu, BookMarked } from 'lucide-react'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import GlobalSearch from '@/components/global-search'

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [localAvatar, setLocalAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.image) {
      setLocalAvatar(session.user.image)
    }
  }, [session?.user?.image])

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

  // Hide header on auth pages because they use a full screen 50/50 split layout
  if (pathname === '/signin' || pathname === '/signup') {
    return null;
  }

  // Define role checking safely
  const role = session?.user?.role || 'user';

  // Hide the main header completely if the user is inside the dashboard or library, because they use the dashboard layout header.
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/library')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 py-4">
        <Link href="/" className="flex items-center justify-start mr-auto bg-background">
          <Image
            src="/logo1.png"
            alt="Global Scholar Publications"
            width={240}
            height={70}
            className="w-40 sm:w-48 md:w-56 max-w-full h-auto object-contain object-left shrink-0"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-[#1E3A8A] font-semibold transition hover:text-blue-600">
            Home
          </Link>
          <Link href="/explore" className="text-sm text-[#1E3A8A] font-semibold transition hover:text-blue-600">
            Explore
          </Link>
          <Link href="/updates" className="text-sm text-[#1E3A8A] font-semibold transition hover:text-blue-600">
            Blogs & News
          </Link>
          {/* Removed My Library link to save space */}
          <Link href="/scholars" className="text-sm text-[#1E3A8A] font-semibold transition hover:text-blue-600">
            Scholars
          </Link>
          <Link href="/about" className="text-sm text-[#1E3A8A] font-semibold transition hover:text-blue-600">
            About
          </Link>

          <div className="flex gap-3">
            {status === 'loading' ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            ) : session ? (
              <>
                <div className="flex items-center">
                  <NotificationsDropdown />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 bg-indigo-100 text-indigo-700">
                        <AvatarImage src={localAvatar || undefined} alt={session.user.name || "User avatar"} />
                        <AvatarFallback className="font-bold">
                          {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email ? session.user.email.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center cursor-pointer">
                        <MdDashboard className="mr-2 h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    {(role === 'admin' || role === 'super_admin') && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin/users" className="flex items-center cursor-pointer text-indigo-600 font-medium">
                          <MdAdminPanelSettings className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {role !== 'admin' && role !== 'super_admin' && (
                      <DropdownMenuItem asChild>
                          <Link href="/library/saved" className="flex items-center cursor-pointer">
                            <BookMarked className="mr-2 h-4 w-4" />
                            <span>My Library</span>
                          </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={role === 'admin' || role === 'super_admin' ? '/dashboard/admin/settings' : '/dashboard/settings'} className="flex items-center cursor-pointer">
                        <MdSettings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/signin' })} className="cursor-pointer">
                      <MdSwapHoriz className="mr-2 h-4 w-4" />
                      <span>Switch Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-red-600 focus:text-red-600">
                      <MdLogout className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/signin" className="hidden sm:block">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Sidebar (Desktop header right side is hidden) */}
        <div className="md:hidden flex items-center gap-2">
          {session && (
            <NotificationsDropdown />
          )}
          {!session && (
            <Link href="/signin">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 px-2 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors ${pathname === '/' ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"}`}
          >
            <div className={`p-1 rounded-full ${pathname === '/' ? "bg-indigo-100/50" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${pathname === '/' ? 'scale-110' : ''}`}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center ${pathname === '/' ? "text-indigo-700" : ""}`}>Home</span>
          </Link>

          <Link
            href="/explore"
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors ${pathname === '/explore' ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"}`}
          >
            <div className={`p-1 rounded-full ${pathname === '/explore' ? "bg-indigo-100/50" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${pathname === '/explore' ? 'scale-110' : ''}`}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
            </div>
            <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center ${pathname === '/explore' ? "text-indigo-700" : ""}`}>Explore</span>
          </Link>

          {session && (
            <Link
              href="/library"
              className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors ${pathname === '/library' ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"}`}
            >
              <div className={`p-1 rounded-full ${pathname === '/library' ? "bg-indigo-100/50" : ""}`}>
                <BookMarked className={`h-6 w-6 ${pathname === '/library' ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center ${pathname === '/library' ? "text-indigo-700" : ""}`}>Library</span>
            </Link>
          )}

          {session ? (
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors ${pathname === '/dashboard' ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"}`}
            >
              <div className={`p-1 rounded-full ${pathname === '/dashboard' ? "bg-indigo-100/50" : ""}`}>
                <MdDashboard className={`h-6 w-6 ${pathname === '/dashboard' ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center ${pathname === '/dashboard' ? "text-indigo-700" : ""}`}>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className={`flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors ${pathname === '/signin' ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50"}`}
            >
              <div className={`p-1 rounded-full ${pathname === '/signin' ? "bg-indigo-100/50" : ""}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${pathname === '/signin' ? 'scale-110' : ''}`}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
              </div>
              <span className={`text-[10px] mt-0.5 font-medium truncate w-full text-center ${pathname === '/signin' ? "text-indigo-700" : ""}`}>Sign In</span>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center flex-1 h-12 rounded-lg transition-colors text-gray-500 hover:text-indigo-500 hover:bg-indigo-50/50">
                <div className="p-1 rounded-full">
                  <Menu className="h-6 w-6" />
                </div>
                <span className="text-[10px] mt-0.5 font-medium truncate w-full text-center">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-100 flex flex-col pt-16 z-100 font-sans antialiased">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 h-full overflow-y-auto pb-20">
                <div className="flex flex-col space-y-1">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider px-2 mb-2">Main</h4>
                  <SheetClose asChild><Link href="/" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Home</Link></SheetClose>
                  <SheetClose asChild><Link href="/explore" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Explore</Link></SheetClose>
                  <SheetClose asChild><Link href="/updates" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Blogs & News</Link></SheetClose>
                  <SheetClose asChild><Link href="/scholars" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Scholars</Link></SheetClose>
                  {session && (
                    <>
                      <SheetClose asChild><Link href="/library" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">My Library</Link></SheetClose>
                    </>
                  )}
                  <SheetClose asChild>
                    <Link href={session ? '/dashboard' : '/signin'} className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">
                      {session ? 'Dashboard' : 'Scholars Portal'}
                    </Link>
                  </SheetClose>
                  {(role === 'admin' || role === 'super_admin') && (
                    <SheetClose asChild>
                      <Link href="/dashboard/admin/users" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:bg-indigo-50 transition-colors">
                        Admin Panel
                      </Link>
                    </SheetClose>
                  )}
                </div>

                <div className="flex flex-col space-y-1 mt-6">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider px-2 mb-2">Platform</h4>
                  <SheetClose asChild><Link href="/about" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">About Us</Link></SheetClose>
                  <SheetClose asChild><Link href="/features" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Features</Link></SheetClose>
                </div>

                <div className="flex flex-col space-y-1 mt-6">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider px-2 mb-2">Support</h4>
                  <SheetClose asChild><Link href="/help" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Help Center</Link></SheetClose>
                  <SheetClose asChild><Link href="/contact" className="text-base font-semibold px-2 py-2 rounded-md text-[#1E3A8A] hover:text-blue-700 hover:bg-blue-50 transition-colors">Contact Us</Link></SheetClose>
                </div>

                <div className="mt-auto pt-8 px-4 pb-4">
                  {!session ? (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Link href="/signup">
                          <Button className="w-full rounded-md bg-indigo-600 text-white">Create Account</Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signin">
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <SheetClose asChild>
                        <Link href="/dashboard/settings">
                          <Button variant="outline" className="w-full border-gray-200">Settings</Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => signOut({ callbackUrl: '/' })}>
                          Log Out
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

