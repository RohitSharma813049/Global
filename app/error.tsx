"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { MdWarning, MdRefresh, MdHome } from 'react-icons/md';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden text-center p-10 sm:p-12 border border-slate-100">
        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-rose-100">
          <MdWarning className="text-5xl" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Something went wrong!</h1>
        <p className="text-base sm:text-lg text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred while processing your request. 
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <MdRefresh className="text-xl" /> Try Again
          </button>
          <Link href="/">
            <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <MdHome className="text-xl" /> Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
