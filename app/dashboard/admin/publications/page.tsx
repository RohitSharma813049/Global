import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PublicationActionButtons from "./PublicationActionButtons"
import Link from "next/link"
import LiveRefresher from "@/components/live-refresher"
import AdminPublicationsClient from "./AdminPublicationsClient"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0

export default async function AdminPublications() {
  const session = await getServerSession(authOptions)

  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    redirect("/dashboard")
  }

  // Fetch pending publications
  const { data: publications, error } = await supabaseAdmin
    .from('publications')
    .select(`
      *,
      is_featured,
      is_hero,
      scholars (
        id,
        user_id,
        institution
      ),
      categories (
        name
      )
    `)
    .neq('status', 'draft')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching publications:", error)
  }

  return (
    <>
    <LiveRefresher />
    <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Publication Review Pipeline</h1>
          <p className="text-(--color-gsp-text-secondary) text-sm mt-1">Review scholar submissions, assign DOIs, and publish content.</p>
        </div>
      </div>

      <AdminPublicationsClient publications={publications || []} />
    </div>
    </>
  )
}
