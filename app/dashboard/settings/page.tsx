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

  const [currentPassword, setCurrentPassword] = useState("");
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
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsSaving(true);
    const res = await updatePassword(currentPassword, newPassword);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
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
            <div className="p-2 bg-purple-100 text-purple-700 rounded-[var(--radius-lg)]">
              <MdSettings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-gsp-text-primary)]">Settings</h1>
          </div>
          <p className="text-[var(--color-gsp-text-secondary)] text-sm sm:text-base">Manage your account preferences and profile settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-[var(--radius-xl)] transition-all duration-200 ${
                      isActive
                        ? "bg-[#F4F1FA] text-purple-700 shadow-[var(--shadow-1)]"
                        : "text-[var(--color-gsp-text-secondary)] hover:bg-[var(--color-gsp-surface-raised)] hover:text-[var(--color-gsp-text-primary)]"
                    }`}
                  >
                    <Icon className="mr-3 text-lg shrink-0" /> {tab.label}
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-[var(--color-gsp-border-muted)]">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-[var(--radius-xl)] transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <MdLogout className="mr-3 text-lg shrink-0" /> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-[var(--color-gsp-border-muted)]">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gsp-text-primary)]">Profile Information</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)] mt-1">Update your personal details and public profile.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-3xl font-bold text-purple-700 shrink-0 overflow-hidden">
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
                      <p className="text-xs text-[var(--color-gsp-text-secondary)]">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Full Name</label>
                      <input aria-label="Input field" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Email Address</label>
                      <input aria-label="Input field" 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-[var(--color-gsp-surface-raised)] text-[var(--color-gsp-text-secondary)] cursor-not-allowed"
                      />
                      <p className="text-xs text-[var(--color-gsp-text-secondary)]">Email cannot be changed.</p>
                    </div>
                  </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Bio</label>
                      <textarea aria-label="Input field" 
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
                        placeholder="Write a few sentences about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Country</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. United Kingdom"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {session?.user?.role === 'scholar' ? (
                      <div className="mt-8 pt-8 border-t border-[var(--color-gsp-border-muted)]">
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-[var(--color-gsp-text-primary)]">Scholar Information</h3>
                          <p className="text-sm text-[var(--color-gsp-text-secondary)]">Manage your professional credentials and media gallery to display on your public profile.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-[#F4F1FA]/50 p-6 rounded-[var(--radius-xl)] border border-purple-100/50">
                          <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Professional Role / Qualification</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={qualification}
                              onChange={(e) => setQualification(e.target.value)}
                              placeholder="e.g. Senior Financial Economist"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-[var(--color-gsp-surface-muted)]"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Institution / Company</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={institution}
                              onChange={(e) => setInstitution(e.target.value)}
                              placeholder="e.g. Central Bank of Kuwait"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-[var(--color-gsp-surface-muted)]"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Specialization / Domain</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              placeholder="e.g. Islamic Finance & Sustainable Investments"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-[var(--color-gsp-surface-muted)]"
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2 mt-2 pt-6 border-t border-purple-100">
                            <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Featured Video</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input aria-label="Input field" 
                                type="url" 
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="e.g. https://www.youtube.com/embed/... OR Upload a file"
                                className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-[var(--color-gsp-surface-muted)]"
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
                                className="shrink-0 bg-[var(--color-gsp-surface-muted)]"
                                onClick={() => document.getElementById("video-upload")?.click()}
                              >
                                Upload Video File
                              </Button>
                            </div>
                            <p className="text-xs text-[var(--color-gsp-text-secondary)]">Provide a YouTube embed URL, or upload a standard video file (.mp4, .webm) up to 100MB.</p>
                          </div>

                          {/* Media Gallery Section */}
                          <div className="space-y-6 md:col-span-2 pt-6 border-t border-purple-100">
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[var(--color-gsp-text-primary)]">Scholar Media Gallery</h3>
                              <p className="text-xs text-[var(--color-gsp-text-secondary)]">Upload multiple photos and additional videos to showcase on your profile.</p>
                            </div>
                            
                            {/* Gallery Images */}
                            <div className="space-y-3 bg-[var(--color-gsp-surface-muted)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-gsp-border-muted)]">
                              <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Photos</label>
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
                                  className="shrink-0 w-full sm:w-auto border-dashed border-2 hover:border-purple-500 hover:text-[var(--color-gsp-text-inverse)] transition-colors"
                                  onClick={() => document.getElementById("gallery-images-upload")?.click()}
                                >
                                  + Add Photos
                                </Button>
                              </div>
                              {galleryImages.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                  {galleryImages.map((url, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-[var(--radius-lg)] overflow-hidden border-2 border-[var(--color-gsp-border-muted)] shadow-[var(--shadow-1)] group">
                                      <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                      <button 
                                        onClick={() => setGalleryImages(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                      >✕</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Gallery Videos */}
                            <div className="space-y-3 bg-[var(--color-gsp-surface-muted)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-gsp-border-muted)]">
                              <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Gallery Videos</label>
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
                                  className="shrink-0 w-full sm:w-auto border-dashed border-2 hover:border-purple-500 hover:text-[var(--color-gsp-text-inverse)] transition-colors"
                                  onClick={() => document.getElementById("gallery-videos-upload")?.click()}
                                >
                                  + Add Videos
                                </Button>
                              </div>
                              {galleryVideos.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                  {galleryVideos.map((url, i) => (
                                    <div key={i} className="relative w-28 h-20 bg-gray-900 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-gsp-border-muted)] flex flex-col items-center justify-center group">
                                      <svg className="w-8 h-8 text-white/50 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5h1v2H5V5zm0 4h1v2H5V9zm0 4h1v2H5v-2z"/></svg>
                                      <span className="text-[10px] text-[var(--color-gsp-text-secondary)] truncate px-2 max-w-full">{url.split('/').pop()}</span>
                                      <button 
                                        onClick={() => setGalleryVideos(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                      >✕</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8 pt-8 border-t border-[var(--color-gsp-border-muted)]">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[var(--radius-2xl)] p-6 sm:p-8 border border-indigo-100/50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <svg className="w-32 h-32 text-[var(--color-gsp-text-inverse)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
                          </div>
                          
                          <div className="relative z-10 max-w-xl">
                            <h3 className="text-xl font-bold text-[var(--color-gsp-text-primary)] mb-2">Become a Scholar</h3>
                            <p className="text-[var(--color-gsp-text-secondary)] text-sm sm:text-base mb-6 leading-relaxed">
                              You are currently on a standard account. Upgrade to a Scholar Profile to publish research papers, showcase your professional credentials, and build your academic portfolio.
                            </p>
                            
                            <a 
                              href="/scholar-registration" 
                              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] text-white bg-[var(--color-gsp-text-inverse)] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02]"
                            >
                              Apply for Scholar Profile
                              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className="p-4 sm:p-6 border-t border-[var(--color-gsp-border-muted)] bg-[var(--color-gsp-surface-raised)]/50 flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-[var(--color-gsp-border-muted)]">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gsp-text-primary)]">Security Settings</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)] mt-1">Update your password and secure your account.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Current Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">New Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-[var(--color-gsp-text-primary)]">Confirm New Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-[var(--color-gsp-border-muted)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-[var(--color-gsp-border-muted)] bg-[var(--color-gsp-surface-raised)]/50 flex justify-end">
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-[var(--color-gsp-border-muted)]">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gsp-text-primary)]">Notification Preferences</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)] mt-1">Choose how you want to be notified about updates.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--color-gsp-text-primary)]">Email Notifications</h3>
                      <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)]">Receive an email when your application status changes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-gsp-surface-muted)] after:border-[var(--color-gsp-border-default)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-gsp-text-inverse)]"></div>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--color-gsp-text-primary)]">In-App Notifications</h3>
                      <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)]">Show a badge when new content is published in your domain.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-gsp-surface-muted)] after:border-[var(--color-gsp-border-default)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-gsp-text-inverse)]"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-[var(--color-gsp-border-muted)] bg-[var(--color-gsp-surface-raised)]/50 flex justify-end">
                  <Button className="w-full sm:w-auto bg-[var(--color-gsp-text-inverse)] hover:bg-purple-700">Save Preferences</Button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-muted)] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-[var(--color-gsp-border-muted)]">
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--color-gsp-text-primary)]">Appearance & Layout</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)] mt-1">Customize the look and feel of your dashboard.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--color-gsp-text-primary)]">Pin Dashboard Sidebar</h3>
                      <p className="text-xs sm:text-sm text-[var(--color-gsp-text-secondary)]">Keep the sidebar expanded by default on large screens.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--color-gsp-surface-muted)] after:border-[var(--color-gsp-border-default)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-gsp-text-inverse)]"></div>
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
