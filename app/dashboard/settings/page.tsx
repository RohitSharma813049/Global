"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MdSettings, MdPerson, MdNotifications, MdSecurity, MdColorLens, MdLogout } from "react-icons/md";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/sidebar-context";
import { updateProfile, updatePassword } from "@/app/actions/settings";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { isPinned, setIsPinned } = useSidebar();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form State
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const res = await updateProfile(name, bio);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile updated successfully!");
      updateSession();
    }
    setIsSaving(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsSaving(true);
    const res = await updatePassword(newPassword);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: MdPerson },
    { id: "security", label: "Security", icon: MdSecurity },
    { id: "notifications", label: "Notifications", icon: MdNotifications },
    { id: "appearance", label: "Appearance", icon: MdColorLens },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in-up">
      <div className="max-w-4xl mx-auto">
        <div className="-ml-2 sm:-ml-6 mt-[-10px]">
          <BackButton />
        </div>
        
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <MdSettings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-500 text-sm sm:text-base">Manage your account preferences and profile settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="mr-3 text-lg flex-shrink-0" /> {tab.label}
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <MdLogout className="mr-3 text-lg flex-shrink-0" /> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Profile Information</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your personal details and public profile.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700 flex-shrink-0">
                      {name ? name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2 w-full sm:w-auto">Change Avatar</Button>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400">Email cannot be changed.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Bio</label>
                    <textarea 
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                      placeholder="Write a few sentences about yourself..."
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your password and secure your account.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Choose how you want to be notified about updates.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Receive an email when your application status changes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">In-App Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Show a badge when new content is published in your domain.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                  <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">Save Preferences</Button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Appearance & Layout</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Customize the look and feel of your dashboard.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Pin Dashboard Sidebar</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Keep the sidebar expanded by default on large screens.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
