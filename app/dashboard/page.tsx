"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLibraryBooks, MdMenuBook, MdPublish, MdAnalytics, MdGroup, MdVerified, MdWarning } from "react-icons/md";
import { getMyApplicationStatus } from "@/app/actions/scholar-applications";
import { BecomeScholarModal } from "@/components/become-scholar-modal";

import { getReadingHistory } from "@/app/actions/history";
import { getAdminStats, getScholarStats } from "@/app/actions/dashboard";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applicationState, setApplicationState] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [scholarStats, setScholarStats] = useState<any>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const appData = await getMyApplicationStatus();
          if (appData) {
            setApplicationState((prev: any) => {
              if (JSON.stringify(prev) !== JSON.stringify(appData)) return appData;
              return prev;
            });
          }

          const historyData = await getReadingHistory();
          if (historyData) {
            setHistory((prev) => JSON.stringify(prev) !== JSON.stringify(historyData) ? historyData : prev);
          }

          const role = session?.user?.role;
          if (role === 'admin' || role === 'super_admin') {
            const stats = await getAdminStats();
            setAdminStats((prev: any) => JSON.stringify(prev) !== JSON.stringify(stats) ? stats : prev);
          } else if (role === 'scholar') {
            const stats = await getScholarStats();
            setScholarStats((prev: any) => JSON.stringify(prev) !== JSON.stringify(stats) ? stats : prev);
          }
        } catch (err) {
          console.error("Dashboard live update error:", err);
        }
      };

      fetchData(); // Initial fetch

      // Set up polling interval every 10 seconds for "live" updates
      const intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchData();
        }
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [status, session?.user?.role]);

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
            <div className="shrink-0">
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
            <div className="shrink-0">
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

      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
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
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Scholar Dashboard</h1>
            <p className="text-indigo-100 text-lg">Manage your publications and track your impact.</p>
          </div>
          <Link href="/dashboard/scholar/upload">
            <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center">
              <MdPublish className="mr-2" /> Submit Paper
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mr-4">
            <MdLibraryBooks />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Published</p>
            <p className="text-3xl font-extrabold text-gray-900">{scholarStats?.published || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl mr-4">
            <MdAnalytics />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Total Views</p>
            <p className="text-3xl font-extrabold text-gray-900">{scholarStats?.views || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mr-4">
            <MdVerified />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Downloads</p>
            <p className="text-3xl font-extrabold text-gray-900">{scholarStats?.downloads || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Drafts</h2>
        {scholarStats?.drafts?.length > 0 ? (
          <div className="space-y-4">
            {scholarStats.drafts.map((draft: any) => (
              <div key={draft.id} className="p-4 border rounded-xl flex justify-between items-center">
                <span className="font-semibold">{draft.title}</span>
                <Link href={`/dashboard/scholar/upload?id=${draft.id}`} className="text-indigo-600 hover:underline">Edit</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">You don't have any drafts right now.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-linear-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
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
              <span className="text-xl font-bold text-indigo-600">{adminStats?.totalScholars || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-semibold">Total Readers</span>
              <span className="text-xl font-bold text-green-600">{adminStats?.totalReaders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
            <MdLibraryBooks className="text-indigo-600 mr-2" /> Pending Approvals
          </h2>
          {adminStats?.pendingPublications > 0 ? (
            <div className="p-8 text-center bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-orange-800 font-semibold text-lg">{adminStats.pendingPublications} publications pending review</p>
              <Link href="/dashboard/admin/publications">
                <button className="mt-4 px-6 py-2 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors">
                  Review Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">All caught up! No pending publications.</p>
            </div>
          )}
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
