"use client";
import Link from 'next/link';
import { MdErrorOutline, MdHome, MdSearch } from 'react-icons/md';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12 border border-slate-100">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <MdErrorOutline className="text-5xl" />
        </div>
        <h1 className="text-9xl font-extrabold text-slate-900 tracking-tighter mb-4">404</h1>
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Page Not Found</h2>
        <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
              <MdHome className="text-xl" /> Back to Home
            </button>
          </Link>
          <Link href="/explore">
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <MdSearch className="text-xl" /> Explore Research
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
