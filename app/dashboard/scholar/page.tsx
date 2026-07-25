import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ScholarProfileForm from "./ScholarProfileForm"
import { BecomeScholarModal } from "@/components/become-scholar-modal"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0 // Opt out of caching

export default async function ScholarDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/dashboard")
  }

  // If they are a regular user or reader, show the application form or their application status
  if (session.user.role === 'user' || session.user.role === 'reader') {
    const { data: applicationState } = await supabaseAdmin
      .from('scholar_applications')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Scholar Application</h1>
          <p className="text-(--color-gsp-text-secondary)">Apply to become a verified scholar to publish your research.</p>
        </div>

        {applicationState?.status === 'rejected' && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-(--shadow-1)">
            <h3 className="text-sm font-medium text-red-800">Your Scholar Application was not approved</h3>
            <p className="mt-2 text-sm text-red-700"><strong>Reason:</strong> {applicationState.admin_notes}</p>
          </div>
        )}

        {applicationState?.status === 'pending' && (
          <div className="bg-violet-soft border-l-4 border-blue-500 p-4 rounded-r-lg shadow-(--shadow-1)">
            <h3 className="text-sm font-medium text-blue-800">Scholar Application Pending Review</h3>
            <p className="mt-2 text-sm text-blue-700">Your application is currently being reviewed by our team. We'll let you know once a decision has been made.</p>
          </div>
        )}

        {(!applicationState || (applicationState.status !== 'pending' && applicationState.status !== 'approved')) && (
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-(--color-gsp-text-primary) mb-2">
              {applicationState?.status === 'rejected' ? 'Update your application' : 'Ready to share your research?'}
            </h2>
            <p className="text-(--color-gsp-text-secondary) mb-6">Fill out our scholar application form to get verified.</p>
            <BecomeScholarModal initialData={applicationState}>
              <button className="px-6 py-3 bg-violet text-white font-semibold rounded-(--radius-lg) hover:bg-[#3d167a] transition-colors">
                {applicationState?.status === 'rejected' ? 'Resubmit Application' : 'Open Application Form'}
              </button>
            </BecomeScholarModal>
          </div>
        )}
      </div>
    )
  }

  // Fetch the scholar's profile data
  // eslint-disable-next-line prefer-const
  let { data: scholar, error } = await supabaseAdmin
    .from('scholars')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  // Auto-initialize profile if they have the role but no profile (e.g. manual role change or seed)
  if (!scholar) {
    const { data: newScholar, error: insertError } = await supabaseAdmin
      .from('scholars')
      .insert({
        user_id: session.user.id,
        bio: 'Scholar profile generated.',
        institution: 'Not Specified',
        qualification: 'Not Specified',
        specialization: 'Not Specified',
        verified: false // Require manual verification by admin
      })
      .select('*')
      .single()

    if (insertError || !newScholar) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Profile Not Found</h1>
          <p className="text-(--color-gsp-text-secondary)">Your scholar profile could not be initialized. Please contact an administrator.</p>
        </div>
      )
    }
    scholar = newScholar;
  }

  return (
    <div className="p-3 md:p-6 max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Scholar Profile</h1>
        <p className="text-(--color-gsp-text-secondary)">Manage your public profile information, qualifications, and biography.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-(--color-gsp-surface-muted) p-4 md:p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex flex-col items-center justify-center">
          <span className="text-xs md:text-sm font-medium text-(--color-gsp-text-secondary) uppercase">Total Views</span>
          <span className="text-3xl md:text-4xl font-bold text-violet mt-2">{scholar.total_views}</span>
        </div>
        <div className="bg-(--color-gsp-surface-muted) p-4 md:p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex flex-col items-center justify-center">
          <span className="text-xs md:text-sm font-medium text-(--color-gsp-text-secondary) uppercase">Total Downloads</span>
          <span className="text-3xl md:text-4xl font-bold text-(--color-gsp-text-inverse) mt-2">{scholar.total_downloads}</span>
        </div>
        <div className="bg-(--color-gsp-surface-muted) p-4 md:p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex flex-col items-center justify-center">
          <span className="text-xs md:text-sm font-medium text-(--color-gsp-text-secondary) uppercase">Status</span>
          <span className={`text-lg md:text-xl font-bold mt-2 ${scholar.verified ? 'text-green-600' : 'text-yellow-600'}`}>
            {scholar.verified ? 'Verified Scholar' : 'Pending Verification'}
          </span>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
        <div className="px-4 py-4 md:px-6 md:py-4 border-b border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)">
          <h2 className="text-base md:text-lg font-semibold text-(--color-gsp-text-primary)">Public Profile Information</h2>
          <p className="text-xs md:text-sm text-(--color-gsp-text-secondary)">This information will be visible on your public Wikipedia-style scholar page.</p>
        </div>
        <div className="p-4 md:p-6">
          <ScholarProfileForm scholar={scholar} />
        </div>
      </div>
    </div>
  )
}
