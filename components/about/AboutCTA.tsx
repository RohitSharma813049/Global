import React from 'react'
import Link from 'next/link'

export default function AboutCTA() {
  return (
    <section className="py-20 bg-violet text-white text-center px-4">
      <div className="max-w-4xl mx-auto reveal">
        <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] font-bold mb-6">
          Ready to Join the Global Scholar Community?
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Become a part of a vibrant ecosystem where your research reaches a wider audience, and connect with distinguished minds worldwide.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/signup" className="px-8 py-3 bg-white text-violet font-semibold rounded-full hover:bg-gray-100 transition shadow-lg w-full sm:w-auto">
            Get Started
          </Link>
          <Link href="/contact" className="px-8 py-3 border border-white text-white font-semibold rounded-full hover:bg-white/10 transition w-full sm:w-auto">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
