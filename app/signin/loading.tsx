export default function Loading() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 flex items-center justify-center animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-violet border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-ink/70 font-['Space_Grotesk']">Loading...</p>
      </div>
    </div>
  )
}
