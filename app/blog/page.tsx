import React from "react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Blog & News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder posts */}
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <p className="text-sm text-indigo-600 font-semibold mb-2">Research Update</p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">The Future of AI in Academia</h2>
                <p className="text-gray-600 mb-4">A brief exploration of how machine learning is transforming peer review...</p>
                <a href="#" className="text-indigo-600 font-medium hover:text-indigo-500">Read more →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
