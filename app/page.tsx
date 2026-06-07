import React from "react";
import Link from "next/link";
import { MdLibraryBooks, MdPeople, MdTrendingUp, MdSchool } from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-24 pb-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              Empowering Global <span className="text-indigo-600">Research</span> & Discovery
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Global Scholar Publication is the premier platform connecting brilliant minds. Whether you're here to read groundbreaking papers or publish your life's work, you belong here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Get Started Today
              </Link>
              <Link href="/about" className="px-8 py-4 text-lg font-bold rounded-full text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="mt-4 text-lg text-gray-600">Join thousands of researchers and readers worldwide.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <MdLibraryBooks className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vast Library</h3>
              <p className="text-gray-600">Access thousands of peer-reviewed journals and articles across various categories.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <MdPeople className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Community</h3>
              <p className="text-gray-600">Connect with scholars, researchers, and academic enthusiasts from around the globe.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <MdTrendingUp className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High Impact</h3>
              <p className="text-gray-600">Publish your work on a platform designed to maximize visibility and citations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join as a Scholar to publish your work, or join as a Reader to stay updated with the latest in academia.
          </p>
          <Link href="/signup" className="inline-block px-8 py-4 text-lg font-bold rounded-full text-gray-900 bg-white hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
            Join the Community
          </Link>
        </div>
      </section>
    </div>
  );
}
