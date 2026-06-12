import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PrintButton from "../PrintButton"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'scholar') {
    redirect("/dashboard")
  }

  // Fetch publication and joined scholar data
  const { data: pub, error } = await supabaseAdmin
    .from('publications')
    .select(`
      *,
      scholars (
        id,
        user_id,
        auth_users:users (
          email,
          raw_user_meta_data
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !pub || pub.status !== 'published') {
    return <div className="p-10 text-center text-red-600">Certificate not found or publication is not yet published.</div>
  }

  // Verify the scholar requesting this actually owns it
  if (pub.scholars.user_id !== session.user.id) {
    return <div className="p-10 text-center text-red-600">Unauthorized access.</div>
  }

  const scholarName = pub.scholars.auth_users.raw_user_meta_data?.name || "Scholar"
  const dateStr = new Date(pub.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 print:p-0 print:bg-white">
      <PrintButton />

      {/* The Certificate Wrapper */}
      <div className="w-[1100px] aspect-[1.414] bg-white shadow-2xl relative overflow-hidden border-[16px] border-emerald-900 flex flex-col items-center print:shadow-none print:border-none print:w-full print:h-screen">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23059669\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        {/* Certificate Content */}
        <div className="flex flex-col items-center text-center px-24 py-16 w-full h-full justify-between z-10">
          
          <div className="space-y-4">
            <h2 className="text-emerald-800 font-bold tracking-widest uppercase text-lg">Global Scholar Publications</h2>
            <h1 className="text-6xl font-serif text-gray-900 mt-2 mb-8">Certificate of Publication</h1>
          </div>

          <div className="space-y-6 w-full">
            <p className="text-xl text-gray-600 italic">This is to proudly certify that</p>
            <p className="text-5xl font-bold text-gray-900 pb-2 border-b-2 border-gray-200 inline-block px-12">{scholarName}</p>
            <p className="text-lg text-gray-600">has successfully published their academic {pub.content_type} titled</p>
            <h3 className="text-2xl font-bold text-emerald-800 leading-snug px-12 max-w-4xl mx-auto">"{pub.title}"</h3>
          </div>

          <div className="grid grid-cols-2 w-full mt-12 gap-12 text-left">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Publication Details</p>
              <p className="text-sm text-gray-800 font-medium"><span className="text-gray-500">Date:</span> {dateStr}</p>
              <p className="text-sm text-gray-800 font-medium"><span className="text-gray-500">Content Type:</span> <span className="capitalize">{pub.content_type}</span></p>
              <p className="text-sm text-gray-800 font-medium"><span className="text-gray-500">Platform ID:</span> GSP-{pub.id.substring(0,8).toUpperCase()}</p>
              {pub.doi && <p className="text-sm text-gray-800 font-medium"><span className="text-gray-500">DOI:</span> {pub.doi}</p>}
            </div>

            <div className="flex items-end justify-end flex-col pt-8">
              <div className="w-48 border-b-2 border-gray-800 mb-2"></div>
              <p className="text-sm font-bold text-gray-800">Editorial Board</p>
              <p className="text-xs text-gray-500">Global Scholar Publications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
