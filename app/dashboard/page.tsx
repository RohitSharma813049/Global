"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLibraryBooks, MdMenuBook, MdPublish, MdAnalytics, MdGroup, MdVerified, MdWarning } from "react-icons/md";
import { getMyApplicationStatus } from "@/app/actions/scholar-applications";
import { BecomeScholarModal } from "@/components/become-scholar-modal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

import { getReadingHistory } from "@/app/actions/history";
import { getAdminStats, getScholarStats, getRecommendations } from "@/app/actions/dashboard";
import { getSuperAdminStats, getPlatformSettings } from "@/app/actions/super-admin";
import { getScholarProfile } from "@/app/actions/settings";
import MaintenanceToggle from "./super-admin/MaintenanceToggle";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [applicationState, setApplicationState] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [superAdminStats, setSuperAdminStats] = useState<any>(null);
  const [platformConfig, setPlatformConfig] = useState<any>(null);
  const [scholarStats, setScholarStats] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

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
            if (appData.status === 'approved' && session?.user?.role === 'user') {
              update({ role: 'scholar' });
            }
          }

          const historyData = await getReadingHistory();
          if (historyData) {
            setHistory((prev) => JSON.stringify(prev) !== JSON.stringify(historyData) ? historyData : prev);
          }

          const profileData = await getScholarProfile();
          if (profileData) {
            setUserProfile((prev: any) => JSON.stringify(prev) !== JSON.stringify(profileData) ? profileData : prev);
          }

          const recsData = await getRecommendations();
          if (recsData) {
            setRecommendations((prev) => JSON.stringify(prev) !== JSON.stringify(recsData) ? recsData : prev);
          }

          const role = session?.user?.role;
          if (role === 'admin' || role === 'super_admin') {
            const stats = await getAdminStats();
            setAdminStats((prev: any) => JSON.stringify(prev) !== JSON.stringify(stats) ? stats : prev);
            
            if (role === 'super_admin') {
              const [saStats, settings] = await Promise.all([
                getSuperAdminStats(),
                getPlatformSettings()
              ]);
              setSuperAdminStats((prev: any) => JSON.stringify(prev) !== JSON.stringify(saStats) ? saStats : prev);
              setPlatformConfig((prev: any) => JSON.stringify(prev) !== JSON.stringify(settings.config) ? settings.config : prev);
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-(--shadow-1)">
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
                <BecomeScholarModal initialData={applicationState} userProfile={userProfile}>
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
        <div className="bg-violet-soft border-l-4 border-blue-500 p-4 rounded-r-lg shadow-(--shadow-1)">
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

      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-(--radius-2xl) p-8 text-white shadow-(--shadow-2)">
        <h1 className="text-3xl font-bold mb-2 min-h-9">Welcome back, {session?.user?.name}!</h1>
        <p className="text-blue-100 text-lg">Continue your learning journey today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-(--color-gsp-text-primary) flex items-center">
              <MdMenuBook className="text-(--color-gsp-text-inverse) mr-2" /> Continue Reading
            </h2>
            <button className="text-sm text-(--color-gsp-text-inverse) font-semibold hover:underline">View All</button>
          </div>
          {history.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {history.map((item, index) => {
                const pub = item.publications;
                if (!pub) return null;
                return (
                  <Link href={`/publications/${pub.id}`} key={index} className="block">
                    <div className="p-4 border rounded-(--radius-xl) hover:shadow-(--shadow-2) transition-shadow cursor-pointer bg-(--color-gsp-surface-raised) hover:bg-(--color-gsp-surface-muted)">
                      <h3 className="font-semibold text-(--color-gsp-text-primary)">{pub.title}</h3>
                      <p className="text-sm text-(--color-gsp-text-secondary) mt-1">
                        {pub.scholars?.users?.raw_user_meta_data?.full_name || "Unknown Author"} • {pub.categories?.name || "General"}
                      </p>
                      <p className="text-xs text-(--color-gsp-text-secondary) mt-1">
                        Viewed on {new Date(item.last_read_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-(--color-gsp-text-secondary)">
              You haven't viewed any publications yet.
            </div>
          )}
        </div>

        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-(--color-gsp-text-primary) flex items-center">
              <MdLibraryBooks className="text-(--color-gsp-text-inverse) mr-2" /> Recommended for You
            </h2>
            <Link href="/explore" className="text-sm text-(--color-gsp-text-inverse) font-semibold hover:underline">
              Explore All
            </Link>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {recommendations.map((item, index) => (
                <Link href={`/publications/${item.id}`} key={index} className="block">
                  <div className="p-4 border rounded-(--radius-xl) hover:shadow-(--shadow-2) transition-shadow cursor-pointer bg-(--color-gsp-surface-raised) hover:bg-(--color-gsp-surface-muted)">
                    <h3 className="font-semibold text-(--color-gsp-text-primary)">{item.title}</h3>
                    <p className="text-sm text-(--color-gsp-text-secondary) mt-1">
                      {item.scholars?.users?.raw_user_meta_data?.full_name || item.author_name || "Unknown Author"} • {item.categories?.name || "General"}
                    </p>
                    <p className="text-xs text-(--color-gsp-text-secondary) mt-2 flex items-center gap-2">
                      <span className="font-semibold">{item.views}</span> Views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-(--color-gsp-surface-raised) rounded-(--radius-xl) border border-dashed border-(--color-gsp-border-default)">
              <p className="text-(--color-gsp-text-secondary)">Read more papers to get personalized recommendations!</p>
              <Link href="/explore">
                <button className="mt-4 px-6 py-2 bg-violet-soft text-indigo-700 font-semibold rounded-full hover:bg-indigo-100 transition-colors">
                  Explore Categories
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {(!applicationState || (applicationState.status !== 'pending' && applicationState.status !== 'approved')) && (
        <div className="bg-violet-soft border border-indigo-100 rounded-(--radius-2xl) p-6 md:p-8 flex flex-col md:flex-row items-center justify-between mt-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-indigo-900 mb-2">Want to contribute?</h2>
            <p className="text-indigo-700">Apply to become a verified scholar and share your research with the world.</p>
          </div>
          <BecomeScholarModal initialData={applicationState} userProfile={userProfile} />
        </div>
      )}
    </div>
  );

  const renderScholarDashboard = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Banner */}
      <div className="bg-[#5c1c9b] rounded-(--radius-2xl) p-8 flex flex-col md:flex-row justify-between items-start md:items-center text-white shadow-(--shadow-2) relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-violet to-[#6a29ab] opacity-90"></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">Scholar Dashboard</h1>
          <p className="text-purple-200">Manage your publications and track your impact.</p>
        </div>
        <Link 
          href="/dashboard/scholar/upload"
          className="relative z-10 flex items-center gap-2 bg-(--color-gsp-surface-muted) text-violet px-6 py-3 rounded-(--radius-lg) font-semibold hover:bg-(--color-gsp-surface-raised) transition-colors shadow-(--shadow-1)"
        >
          <MdPublish className="w-5 h-5" />
          Submit Paper
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--color-gsp-surface-muted) p-6 rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-violet">
              <MdLibraryBooks className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--color-gsp-text-secondary) uppercase tracking-wide">Published</p>
              <p className="text-3xl font-bold text-(--color-gsp-text-primary) mt-1 min-h-9">{scholarStats?.published || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-(--color-gsp-surface-muted) p-6 rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <MdAnalytics className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--color-gsp-text-secondary) uppercase tracking-wide">Total Views</p>
              <p className="text-3xl font-bold text-(--color-gsp-text-primary) mt-1 min-h-9">{scholarStats?.views || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-(--color-gsp-surface-muted) p-6 rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-soft flex items-center justify-center text-[#8e44ad]">
              <MdVerified className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-(--color-gsp-text-secondary) uppercase tracking-wide">Downloads</p>
              <p className="text-3xl font-bold text-(--color-gsp-text-primary) mt-1 min-h-9">{scholarStats?.downloads || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
          <div className="px-6 py-5 border-b border-(--color-gsp-border-muted)">
            <h2 className="text-lg font-bold text-(--color-gsp-text-primary)">Recent Drafts</h2>
          </div>
          <div className="p-6">
            {scholarStats?.drafts?.length > 0 ? (
              <div className="space-y-4">
                {scholarStats.drafts.map((draft: any) => (
                  <div key={draft.id} className="p-4 border rounded-(--radius-xl) flex justify-between items-center">
                    <span className="font-semibold">{draft.title}</span>
                    <Link href={`/dashboard/scholar/upload?id=${draft.id}`} className="text-(--color-gsp-text-inverse) hover:underline">Edit</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-(--color-gsp-border-muted) rounded-(--radius-xl) p-12 flex items-center justify-center text-center">
                <p className="text-(--color-gsp-text-secondary)">You don't have any drafts right now.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-(--color-gsp-border-muted)">
            <h2 className="text-lg font-bold text-(--color-gsp-text-primary)">Analytics Overview</h2>
          </div>
          <div className="p-6 flex-1 min-h-75">
            {scholarStats?.publications && scholarStats.publications.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scholarStats.publications}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="title" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="views" name="Views" fill="#2F115D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="downloads" name="Downloads" fill="#8e44ad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full border-2 border-dashed border-(--color-gsp-border-muted) rounded-(--radius-xl) p-12 flex items-center justify-center text-center">
                <p className="text-(--color-gsp-text-secondary)">No analytics data available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-linear-to-r from-gray-800 to-gray-900 rounded-(--radius-2xl) p-8 text-white shadow-(--shadow-2)">
        <h1 className="text-3xl font-bold mb-2">
          {role === 'super_admin' ? 'Super Admin Control Center' : 'Admin Control Center'}
        </h1>
        <p className="text-gray-300 text-lg">
          {role === 'super_admin' 
            ? 'High-level platform metrics, global controls, and moderation queue.' 
            : 'Overview of platform health and moderation queue.'}
        </p>
      </div>

      {role === 'super_admin' && platformConfig?.maintenance_mode && (
        <div className="bg-red-50 border border-red-200 rounded-(--radius-2xl) p-6 flex items-start gap-4 shadow-(--shadow-1)">
          <MdWarning className="text-3xl text-red-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-1">MAINTENANCE MODE ACTIVE</h3>
            <p className="text-red-700 text-sm">The platform is currently locked down for all regular users. Only Admins and Super Admins can log in.</p>
          </div>
        </div>
      )}

      {role === 'super_admin' && superAdminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-(--color-gsp-text-inverse) flex items-center justify-center text-xl mr-4 shrink-0">
              <MdGroup />
            </div>
            <div>
              <p className="text-xs text-(--color-gsp-text-secondary) font-semibold uppercase">Total Users</p>
              <p className="text-2xl font-extrabold text-(--color-gsp-text-primary)">{superAdminStats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-(--color-gsp-text-inverse) flex items-center justify-center text-xl mr-4 shrink-0">
              <MdVerified />
            </div>
            <div>
              <p className="text-xs text-(--color-gsp-text-secondary) font-semibold uppercase">Total Scholars</p>
              <p className="text-2xl font-extrabold text-(--color-gsp-text-primary)">{superAdminStats.totalScholars.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-(--color-gsp-text-inverse) flex items-center justify-center text-xl mr-4 shrink-0">
              <MdLibraryBooks />
            </div>
            <div>
              <p className="text-xs text-(--color-gsp-text-secondary) font-semibold uppercase">Publications</p>
              <p className="text-2xl font-extrabold text-(--color-gsp-text-primary)">{superAdminStats.totalPublications.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted) flex items-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mr-4 shrink-0">
              <MdAnalytics />
            </div>
            <div>
              <p className="text-xs text-(--color-gsp-text-secondary) font-semibold uppercase">Audit Logs</p>
              <p className="text-2xl font-extrabold text-(--color-gsp-text-primary)">{superAdminStats.totalLogs.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
          <h2 className="text-xl font-bold text-(--color-gsp-text-primary) flex items-center mb-6">
            <MdGroup className="text-(--color-gsp-text-inverse) mr-2" /> User Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-(--color-gsp-surface-raised) rounded-(--radius-xl)">
              <span className="text-(--color-gsp-text-secondary) font-semibold">Total Scholars</span>
              <span className="text-xl font-bold text-(--color-gsp-text-inverse)">{adminStats?.totalScholars || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-(--color-gsp-surface-raised) rounded-(--radius-xl)">
              <span className="text-(--color-gsp-text-secondary) font-semibold">Total Readers</span>
              <span className="text-xl font-bold text-green-600">{adminStats?.totalReaders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
          <h2 className="text-xl font-bold text-(--color-gsp-text-primary) flex items-center mb-6">
            <MdLibraryBooks className="text-(--color-gsp-text-inverse) mr-2" /> Pending Approvals
          </h2>
          {adminStats?.pendingPublications > 0 ? (
            <div className="p-8 text-center bg-orange-50 rounded-(--radius-xl) border border-orange-200">
              <p className="text-orange-800 font-semibold text-lg">{adminStats.pendingPublications} publications pending review</p>
              <Link href="/dashboard/admin/publications">
                <button className="mt-4 px-6 py-2 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-colors">
                  Review Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center bg-(--color-gsp-surface-raised) rounded-(--radius-xl) border border-dashed border-(--color-gsp-border-default)">
              <p className="text-(--color-gsp-text-secondary)">All caught up! No pending publications.</p>
            </div>
          )}
        </div>
      </div>

      {role === 'super_admin' && (
        <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) p-6 shadow-(--shadow-1) border border-(--color-gsp-border-muted)">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-lg font-bold text-(--color-gsp-text-primary) mb-2">Maintenance Mode</h3>
              <p className="text-(--color-gsp-text-secondary) text-sm">
                When activated, non-admin users will be unable to access the site and will see a maintenance screen. 
                Use this during critical database migrations or severe security incidents.
              </p>
            </div>
            
            <MaintenanceToggle initialState={platformConfig?.maintenance_mode === true} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {role === "super_admin" || role === "admin" 
        ? renderAdminDashboard() 
        : (role === "scholar" || applicationState?.status === 'approved')
          ? renderScholarDashboard() 
          : renderReaderDashboard()}
    </div>
  );
}
