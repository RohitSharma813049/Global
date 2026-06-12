import { supabase } from "@/lib/superbaseconfig"
import GSPDistinguishedScholars from "@/components/GSPDistinguishedScholars"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Props {
  params: {
    id: string
  }
}

export default async function ScholarProfilePage({ params }: Props) {
  // Wait for params in Next.js 15+ if needed, but in standard Next.js 14 it's fine.
  const { id } = await params

  // Fetch scholar
  const { data: scholar, error: scholarError } = await supabase
    .from('scholars')
    .select('*')
    .eq('id', id)
    .single()

  if (scholarError || !scholar) {
    return notFound()
  }

  // Fetch videos
  const { data: videos } = await supabase
    .from('scholar_videos')
    .select('*')
    .eq('scholar_id', id)

  // Fetch publications
  const { data: publications } = await supabase
    .from('scholar_publications')
    .select('*')
    .eq('scholar_id', id)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20">
        <GSPDistinguishedScholars 
          scholar={scholar}
          videos={videos || []}
          publications={publications || []}
        />
      </main>
      <Footer />
    </>
  )
}
