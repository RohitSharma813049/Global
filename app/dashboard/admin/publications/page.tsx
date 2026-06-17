import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PublicationActionButtons from "./PublicationActionButtons"
import Link from "next/link"
import LiveRefresher from "@/components/live-refresher"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
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
      scholars (
        id,
        user_id,
        institution
      ),
      categories (
        name
      )
    `)
    .in('status', ['submitted', 'under_review', 'changes_requested'])
    .order('created_at', { ascending: false })

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
          <p className="text-gray-600 text-sm mt-1">Review scholar submissions, assign DOIs, and publish content.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {publications && publications.length > 0 ? (
          <div className="max-h-[600px] overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Publication</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Scholar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Document</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub: any) => (
                <tr key={pub.id}>
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{pub.abstract}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {pub.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pub.categories?.name || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ID: {pub.scholar_id.substring(0,8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pub.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 
                      pub.status === 'under_review' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {pub.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      View PDF
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/admin/publications/${pub.id}/edit`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded">
                        Edit
                      </Link>
                      <PublicationActionButtons publicationId={pub.id} currentStatus={pub.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No publications pending review.
          </div>
        )}
      </div>
    </div>
    </>
  )
}
