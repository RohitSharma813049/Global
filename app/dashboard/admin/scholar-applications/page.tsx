import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ScholarApplicationsTable from "./ScholarApplicationsTable"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0 // Opt out of caching

export default async function ScholarApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    redirect("/dashboard")
  }

  const { data: applications, error } = await supabaseAdmin
    .from('scholar_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Review Scholar Applications</h1>

      <ScholarApplicationsTable initialApplications={applications || []} />
    </div>
  )
}
