import Footer from "@/components/layout/footer"
import { BackButton } from "@/components/back-button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BackButton />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 text-center">
        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-medium text-indigo-800 shadow-sm mb-8">
          Coming Soon
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          We take your privacy seriously. Our comprehensive privacy policy will be published here shortly.
        </p>
      </main>
      <Footer />
    </div>
  )
}
