"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MdSettings, MdPerson, MdNotifications, MdSecurity, MdColorLens, MdLogout } from "react-icons/md";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/sidebar-context";
import { updateProfile, updatePassword, getScholarProfile, uploadVideoFile, uploadImageFile } from "@/app/actions/settings";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const { isPinned, setIsPinned } = useSidebar();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form State
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [qualification, setQualification] = useState("");
  const [institution, setInstitution] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryVideos, setGalleryVideos] = useState<string[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await getScholarProfile();
      if (data) {
        setName(data.name || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
        setCountry(data.country || "");
        setQualification(data.qualification || "");
        setInstitution(data.institution || "");
        setSpecialization(data.specialization || "");
        setVideoUrl(data.video_url || "");
        setAvatarUrl(data.avatar_url || "");
        setGalleryImages(data.gallery_images || []);
        setGalleryVideos(data.gallery_videos || []);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const res = await updateProfile(name, bio, country, avatarUrl, { institution, qualification, specialization, video_url: videoUrl, gallery_images: galleryImages, gallery_videos: galleryVideos });
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
          <div className="w-full md:w-64 shrink-0">
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
                    <Icon className="mr-3 text-lg shrink-0" /> {tab.label}
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <MdLogout className="mr-3 text-lg shrink-0" /> Log Out
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
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700 shrink-0 overflow-hidden">
                      {avatarUrl ? (
                        <img 
                          key={avatarUrl}
                          src={avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex items-center justify-center" 
                        style={{ display: avatarUrl ? 'none' : 'flex' }}
                      >
                        {name ? name.charAt(0).toUpperCase() : "U"}
                      </div>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/png,image/jpeg,image/gif,image/webp" 
                        id="avatar-upload" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              toast.error("Avatar must be less than 10MB");
                              return;
                            }
                            const toastId = toast.loading("Uploading avatar...");
                            try {
                              const formData = new FormData();
                              formData.append("image", file);
                              const res = await uploadImageFile(formData);
                              if (res.error) {
                                toast.error(res.error, { id: toastId });
                              } else if (res.url) {
                                setAvatarUrl(res.url);
                                updateSession({ image: res.url });
                                window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: res.url }));
                                toast.success("Avatar uploaded! Don't forget to save changes.", { id: toastId });
                              }
                            } catch (err: any) {
                              toast.error(err.message || "Upload failed", { id: toastId });
                            }
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => document.getElementById("avatar-upload")?.click()}>Change Avatar</Button>
                        {avatarUrl && (
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {
                            setAvatarUrl("");
                            updateSession({ image: "" });
                            window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: "" }));
                          }}>Remove Avatar</Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Full Name</label>
                      <input aria-label="Input field" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-700">Email Address</label>
                      <input aria-label="Input field" 
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
                      <textarea aria-label="Input field" 
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                        placeholder="Write a few sentences about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Country</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. United Kingdom"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {session?.user?.role === 'scholar' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Scholar Information</h3>
                          <label className="text-xs sm:text-sm font-medium text-gray-700">Professional Role / Qualification</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          placeholder="e.g. Senior Financial Economist"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Institution / Company</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="e.g. Central Bank of Kuwait"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Specialization / Domain</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="e.g. Islamic Finance & Sustainable Investments"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Featured Video</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input aria-label="Input field" 
                            type="url" 
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="e.g. https://www.youtube.com/embed/... OR Upload a file"
                            className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                          />
                          <input 
                            type="file" 
                            accept="video/mp4,video/webm,video/ogg" 
                            id="video-upload" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 100 * 1024 * 1024) {
                                  toast.error("Video must be less than 100MB");
                                  return;
                                }
                                const toastId = toast.loading("Uploading video...");
                                try {
                                  const formData = new FormData();
                                  formData.append("video", file);
                                  const res = await uploadVideoFile(formData);
                                  if (res.error) {
                                    toast.error(res.error, { id: toastId });
                                  } else if (res.url) {
                                    setVideoUrl(res.url);
                                    toast.success("Video uploaded! Don't forget to save changes.", { id: toastId });
                                  }
                                } catch (err: any) {
                                  toast.error(err.message || "Upload failed", { id: toastId });
                                }
                              }
                            }}
                          />
                          <Button 
                            variant="outline" 
                            className="shrink-0"
                            onClick={() => document.getElementById("video-upload")?.click()}
                          >
                            Upload Video File
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">Provide a YouTube embed URL, or upload a standard video file (.mp4, .webm) up to 100MB.</p>
                      </div>

                      {/* Media Gallery Section */}
                      <div className="space-y-4 md:col-span-2 pt-4 border-t border-gray-100">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">Scholar Media Gallery</h3>
                        <p className="text-xs text-gray-500">Upload multiple photos and additional videos to showcase on your profile.</p>
                        
                        {/* Gallery Images */}
                        <div className="space-y-2">
                          <label className="text-xs sm:text-sm font-medium text-gray-700">Gallery Photos</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                              type="file" 
                              accept="image/png,image/jpeg,image/gif,image/webp" 
                              id="gallery-images-upload" 
                              className="hidden" 
                              multiple
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  const toastId = toast.loading(`Uploading ${files.length} photos...`);
                                  try {
                                    const newUrls: string[] = [];
                                    let hasError = false;
                                    for (const file of files) {
                                      if (file.size > 10 * 1024 * 1024) {
                                        toast.error(`Photo must be less than 10MB`, { id: toastId });
                                        hasError = true;
                                        break;
                                      }
                                      const formData = new FormData();
                                      formData.append("image", file);
                                      const res = await uploadImageFile(formData);
                                      if (res.error) {
                                        toast.error(res.error, { id: toastId });
                                        hasError = true;
                                        break;
                                      } else if (res.url) {
                                        newUrls.push(res.url);
                                      }
                                    }
                                    if (newUrls.length > 0) {
                                      setGalleryImages(prev => [...prev, ...newUrls]);
                                    }
                                    if (!hasError) {
                                      toast.success("Photos uploaded!", { id: toastId });
                                    }
                                  } catch (err: any) {
                                    toast.error(err.message || "An error occurred during upload", { id: toastId });
                                  }
                                }
                              }}
                            />
                            <Button 
                              variant="outline" 
                              className="shrink-0"
                              onClick={() => document.getElementById("gallery-images-upload")?.click()}
                            >
                              + Add Photos
                            </Button>
                          </div>
                          {galleryImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {galleryImages.map((url, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                  <button 
                                    onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-white/80 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-red-500"
                                  >✕</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Gallery Videos */}
                        <div className="space-y-2 mt-4">
                          <label className="text-xs sm:text-sm font-medium text-gray-700">Gallery Videos</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                              type="file" 
                              accept="video/mp4,video/webm,video/ogg" 
                              id="gallery-videos-upload" 
                              className="hidden" 
                              multiple
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                  const toastId = toast.loading(`Uploading ${files.length} videos...`);
                                  try {
                                    const newUrls: string[] = [];
                                    let hasError = false;
                                    for (const file of files) {
                                      if (file.size > 100 * 1024 * 1024) {
                                        toast.error(`Video must be less than 100MB`, { id: toastId });
                                        hasError = true;
                                        break;
                                      }
                                      const formData = new FormData();
                                      formData.append("video", file);
                                      const res = await uploadVideoFile(formData);
                                      if (res.error) {
                                        toast.error(res.error, { id: toastId });
                                        hasError = true;
                                        break;
                                      } else if (res.url) {
                                        newUrls.push(res.url);
                                      }
                                    }
                                    if (newUrls.length > 0) {
                                      setGalleryVideos(prev => [...prev, ...newUrls]);
                                    }
                                    if (!hasError) {
                                      toast.success("Videos uploaded!", { id: toastId });
                                    }
                                  } catch (err: any) {
                                    toast.error(err.message || "An error occurred during upload", { id: toastId });
                                  }
                                }
                              }}
                            />
                            <Button 
                              variant="outline" 
                              className="shrink-0"
                              onClick={() => document.getElementById("gallery-videos-upload")?.click()}
                            >
                              + Add Videos
                            </Button>
                          </div>
                          {galleryVideos.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {galleryVideos.map((url, i) => (
                                <div key={i} className="relative w-24 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                                  <span className="text-[10px] text-gray-500 truncate px-1">{url.split('/').pop()}</span>
                                  <button 
                                    onClick={() => setGalleryVideos(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute top-1 right-1 bg-white/80 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-red-500"
                                  >✕</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                    <input aria-label="Input field" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input aria-label="Input field" 
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
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">In-App Notifications</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Show a badge when new content is published in your domain.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
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
                      <input aria-label="Input field" 
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
