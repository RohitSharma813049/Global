'use client'

export default function PrintButton() {
  return (
    <div className="fixed top-8 right-8 print:hidden z-50">
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') window.print()
        }} 
        className="bg-emerald-600 text-white px-6 py-3 rounded-[var(--radius-lg)] shadow-[var(--shadow-2)] font-bold hover:bg-emerald-700 transition"
      >
        Print / Save as PDF
      </button>
    </div>
  )
}
