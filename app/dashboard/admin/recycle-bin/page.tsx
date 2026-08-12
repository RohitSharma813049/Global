import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRecycleBinItems } from "@/app/actions/recycle-bin"
import RecycleBinClient from "@/components/dashboard/RecycleBinClient"

export const revalidate = 0

export default async function AdminRecycleBinPage() {
  const session = await getServerSession(authOptions)

  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    redirect("/dashboard")
  }

  const { items, counts } = await getRecycleBinItems()

  return (
    <div className="w-full">
      <RecycleBinClient initialItems={items} initialCounts={counts} />
    </div>
  )
}
