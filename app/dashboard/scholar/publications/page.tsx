import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { deletePublication } from "@/app/actions/publications"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export const revalidate = 0

export default async function ScholarPublications() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'scholar') {
    redirect("/dashboard")
  }

  // Get scholar id
  const { data: scholar } = await supabaseAdmin
    .from('scholars')
    .select('id')
    .eq('user_id', session.user.id)
    .single()

  if (!scholar) {
    return <div>Error loading profile.</div>
  }

  // Fetch publications
  const { data: publications } = await supabaseAdmin
    .from('publications')
    .select('*')
    .eq('scholar_id', scholar.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Publications</h1>
          <p className="text-gray-600 text-sm mt-1">Track the status of your submissions and download your publication certificates.</p>
        </div>
        <Link 
          href="/dashboard/scholar/upload" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700"
        >
          New Upload
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {publications && publications.length > 0 ? (
          <div className="max-h-[600px] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">DOI</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase bg-gray-50">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub: any) => (
                <tr key={pub.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {pub.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pub.status === 'published' ? 'bg-green-100 text-green-800' :
                      pub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pub.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pub.doi || 'Pending'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center gap-4">
                    {pub.status === 'published' ? (
                      <Link 
                        href={`/dashboard/scholar/certificate/${pub.id}`}
                        className="text-emerald-600 hover:text-emerald-900 font-semibold"
                        target="_blank"
                      >
                        Download Certificate
                      </Link>
                    ) : (
                      <span className="text-gray-400">Not Available</span>
                    )}
                    
                    <form action={async () => {
                      "use server"
                      await deletePublication(pub.id)
                    }}>
                      <button type="submit" className="text-red-600 hover:text-red-800 font-semibold bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            You haven't uploaded any publications yet.
          </div>
        )}
      </div>
    </div>
  )
}
