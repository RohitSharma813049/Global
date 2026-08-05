import Footer from "@/components/layout/footer"
import { BackButton } from "@/components/back-button"
import FeatureRequestForm from "./FeatureRequestForm"
import Header from "@/components/layout/header"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Platform Features</h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Discover the powerful tools we offer to scholars and academic institutions. Or request a new feature you'd like to see!
        </p>
        
        <FeatureRequestForm />
      </main>
      <Footer />
    </div>
  )
}
