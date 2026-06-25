import Link from 'next/link';

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#2F115D] py-20 lg:py-24">
      {/* Abstract Background Shapes */}
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#4A1F8C]/40 blur-3xl"></div>
      
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-serif text-4xl font-bold text-white md:text-5xl lg:leading-tight">
          Ready to share your research with the world?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          Join thousands of scholars who are already publishing, collaborating, and making an impact on Global Scholar Publications.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/signin" 
            className="rounded-full bg-white px-8 py-4 text-base font-semibold text-[#2F115D] shadow-lg transition hover:bg-white/90"
          >
            Become a Scholar
          </Link>
          <Link 
            href="/explore" 
            className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Explore Publications
          </Link>
        </div>
      </div>
    </section>
  )
}
