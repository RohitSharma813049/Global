"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLibraryBooks, MdMenuBook, MdPublish, MdAnalytics, MdGroup, MdVerified } from "react-icons/md";

// Mock Data
const recentPapers = [
  { id: 1, title: "The Future of Quantum Computing in Cryptography", author: "Dr. Alice Smith", category: "Computer Science", date: "Oct 12, 2025" },
  { id: 2, title: "Advancements in CRISPR-Cas9 Targeted Therapies", author: "Dr. Robert Chen", category: "Biology", date: "Sep 28, 2025" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  const role = session?.user?.role || "user";

  const renderReaderDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name}!</h1>
        <p className="text-blue-100 text-lg">Continue your learning journey today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MdMenuBook className="text-indigo-600 mr-2" /> Continue Reading
            </h2>
            <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
          </div>
          {recentPapers.map((paper) => (
            <div key={paper.id} className="p-4 mb-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white">
              <h3 className="font-semibold text-gray-900">{paper.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{paper.author} • {paper.category}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
            <MdLibraryBooks className="text-indigo-600 mr-2" /> Recommended for You
          </h2>
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Read more papers to get personalized recommendations!</p>
            <button className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-full hover:bg-indigo-100 transition-colors">
              Explore Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScholarDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scholar Dashboard</h1>
            <p className="text-indigo-100 text-lg">Manage your publications and track your impact.</p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center">
            <MdPublish className="mr-2" /> Submit Paper
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mr-4">
            <MdLibraryBooks />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Published</p>
            <p className="text-3xl font-extrabold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl mr-4">
            <MdAnalytics />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Total Views</p>
            <p className="text-3xl font-extrabold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mr-4">
            <MdVerified />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Citations</p>
            <p className="text-3xl font-extrabold text-gray-900">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Drafts</h2>
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">You don't have any drafts right now.</p>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-gray-300 text-lg">Overview of platform health and moderation queue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
            <MdGroup className="text-indigo-600 mr-2" /> User Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-semibold">Total Scholars</span>
              <span className="text-xl font-bold text-indigo-600">42</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-semibold">Total Readers</span>
              <span className="text-xl font-bold text-green-600">128</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
            <MdLibraryBooks className="text-indigo-600 mr-2" /> Pending Approvals
          </h2>
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">All caught up! No pending publications.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {role === "super_admin" || role === "admin" 
        ? renderAdminDashboard() 
        : role === "scholar" 
          ? renderScholarDashboard() 
          : renderReaderDashboard()}
    </div>
  );
}
