import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#2F115D] py-16 lg:py-4 mb-5 mt-5">
      {/* Curved Background Shape (Bottom Right) */}
      <div 
        className="absolute bottom-0 right-0 h-full w-[60%] bg-[#4A1F8C]/40"
        style={{ borderTopLeftRadius: '100% 120%' }}
      ></div>
      
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row md:items-center">
        {/* Left Content */}
        <div className="max-w-2xl text-left">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/90">
            Ready to publish?
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl tracking-tight">
            Publish and <em className="font-serif italic font-medium opacity-90">Discover</em> Peer-Reviewed Research.
          </h2>
        </div>

        {/* Right Content (Buttons) */}
        <div className="shrink-0">
          <Link 
            href="/signin" 
            className="flex items-center gap-2 rounded-md bg-white px-8 py-4 text-sm font-bold text-[#2F115D] shadow-lg transition hover:bg-white/90"
          >
            Become a Scholar
          </Link>
        </div>
      </div>
    </section>
  )
}
