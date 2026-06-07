import React from "react";
import { MdScience, MdComputer, MdLocalHospital, MdGavel } from "react-icons/md";

export default function Category() {
  const categories = [
    { name: "Science & Nature", icon: <MdScience className="text-4xl" />, color: "bg-blue-100 text-blue-600" },
    { name: "Computer Science", icon: <MdComputer className="text-4xl" />, color: "bg-indigo-100 text-indigo-600" },
    { name: "Medicine", icon: <MdLocalHospital className="text-4xl" />, color: "bg-red-100 text-red-600" },
    { name: "Law & Ethics", icon: <MdGavel className="text-4xl" />, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-lg text-gray-600">Discover papers and articles across disciplines.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1">
              <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 ${cat.color}`}>
                {cat.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
              <p className="mt-2 text-sm text-gray-500">Explore collection →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
