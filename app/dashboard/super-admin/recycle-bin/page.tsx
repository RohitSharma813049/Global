import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getRecycleBinItems } from "@/app/actions/recycle-bin"
import RecycleBinClient from "@/components/dashboard/RecycleBinClient"

export const revalidate = 0

export default async function SuperAdminRecycleBinPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.role !== 'super_admin') {
    redirect("/dashboard")
  }

  const { items, counts } = await getRecycleBinItems()

  return (
    <div className="w-full">
      <RecycleBinClient initialItems={items} initialCounts={counts} />
    </div>
  )
}
