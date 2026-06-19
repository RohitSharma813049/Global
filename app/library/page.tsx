import Footer from "@/components/footer"
import { BookMarked, Search } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackButton />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <BookMarked className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">My Library</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10">
          Your personal collection of saved papers, thesis, and eBooks will appear here. Start exploring to build your library.
        </p>
        <Link href="/category" className="inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
          <Search className="w-5 h-5 mr-2" /> Explore Papers
        </Link>
      </main>
      <Footer />
    </div>
  )
}
