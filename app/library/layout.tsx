import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { SidebarProvider } from "@/components/sidebar-context"
import { DashboardLayoutWrapper } from "@/components/layout/dashboard-layout-wrapper"

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin?callbackUrl=/library/saved')
  }

  return (
    <SidebarProvider>
      <DashboardLayoutWrapper>
        {children}
      </DashboardLayoutWrapper>
    </SidebarProvider>
  )
}
