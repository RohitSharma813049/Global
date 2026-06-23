import { supabase } from "@/lib/superbaseconfig"
import GSPDistinguishedScholars from "@/components/GSPDistinguishedScholars"
import Footer from "@/components/footer"

export default async function ScholarsListingPage() {
  // Fetch all scholars
  const { data: scholars } = await supabase
    .from('scholars')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <main className="min-h-screen bg-gray-50 pt-20">
        <GSPDistinguishedScholars 
          allScholars={scholars || []}
        />
      </main>
      <Footer />
    </>
  )
}
