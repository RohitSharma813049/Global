"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLibraryBooks, MdMenuBook, MdPublish, MdAnalytics, MdGroup, MdVerified, MdWarning } from "react-icons/md";
import { getMyApplicationStatus } from "@/app/actions/scholar-applications";
import { BecomeScholarModal } from "@/components/become-scholar-modal";

import { getReadingHistory } from "@/app/actions/history";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applicationState, setApplicationState] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      getMyApplicationStatus().then(data => {
        if (data) {
          setApplicationState((prev: any) => {
            if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
            return prev;
          });
        }
      });
      getReadingHistory().then(data => {
        setHistory(data || []);
      });
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const role = session?.user?.role || "user";

  const renderReaderDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      {applicationState?.status === 'rejected' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <MdWarning className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Your Scholar Application was not approved
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Reason:</strong> {applicationState.admin_notes}</p>
              </div>
              <div className="mt-4">
                <BecomeScholarModal initialData={applicationState}>
                  <button className="text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors">
                    Resubmit Application
                  </button>
                </BecomeScholarModal>
              </div>
            </div>
          </div>
        </div>
      )}

      {applicationState?.status === 'pending' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <MdVerified className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Scholar Application Pending Review
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Your application is currently being reviewed by our team. We'll let you know once a decision has been made.</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {history.length > 0 ? history.map((item, index) => {
            const pub = item.publications;
            if (!pub) return null;
            return (
              <Link href={`/category`} key={index}>
                <div className="p-4 mb-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-gray-50 hover:bg-white">
                  <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {pub.scholars?.users?.raw_user_meta_data?.full_name || "Unknown Author"} • {pub.categories?.name || "General"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Viewed on {new Date(item.last_read_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            )
          }) : (
            <div className="p-4 text-center text-gray-500">
              You haven't viewed any publications yet.
            </div>
          )}
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

      {(!applicationState || (applicationState.status !== 'pending' && applicationState.status !== 'approved')) && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mt-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Want to contribute?</h2>
            <p className="text-indigo-700">Apply to become a verified scholar and share your research with the world.</p>
          </div>
          <BecomeScholarModal initialData={applicationState} />
        </div>
      )}
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
