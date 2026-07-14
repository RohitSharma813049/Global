import Footer from "@/components/layout/footer"

export default function ScholarsLoading() {
  return (
    <>
      <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-12">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 md:w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto mb-8"></div>
            
            {/* Search Bar Skeleton */}
            <div className="max-w-md mx-auto relative h-12 bg-gray-200 rounded-full border border-[#ECEAF4]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#ECEAF4] shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
