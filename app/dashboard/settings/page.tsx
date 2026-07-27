"use client";
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MdSettings, MdPerson, MdNotifications, MdSecurity, MdColorLens, MdLogout, MdCameraAlt } from "react-icons/md";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [bio, setBio] = useState("");
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

  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Gallery States
  const [showGallery, setShowGallery] = useState(false);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  const openGallery = async () => {
    setShowGallery(true);
    setLoadingGallery(true);
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      if (data.success) {
        setLibraryImages(data.images);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraOpen(true);
      // We need a small timeout to ensure videoRef is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast.error("Camera access denied or not available");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          stopCamera();
          
          const toastId = toast.loading("Uploading photo...");
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
              toast.success("Photo uploaded! Don't forget to save changes.", { id: toastId });
            }
          } catch (err: any) {
            toast.error(err.message || "Upload failed", { id: toastId });
          }
        }
      }, 'image/jpeg');
    }
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await getScholarProfile();
      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setUsername(data.username || "");
        setDesignation(data.designation || "");
        setEmail(data.email || "");
        setBio(data.bio || "");
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
    const res = await updateProfile(firstName, lastName, designation, bio, avatarUrl, { institution, qualification, specialization, video_url: videoUrl, gallery_images: galleryImages, gallery_videos: galleryVideos });
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
    <>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <div className="-ml-2 sm:-ml-6 mt-[-10px]">
          <BackButton />
        </div>
        
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-(--radius-lg)">
              <MdSettings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--color-gsp-text-primary)">Settings</h1>
          </div>
          <p className="text-(--color-gsp-text-secondary) text-sm sm:text-base">Manage your account preferences and profile settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Tabs Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-(--radius-xl) transition-all duration-200 ${
                      isActive
                        ? "bg-violet-soft text-purple-700 shadow-(--shadow-1)"
                        : "text-(--color-gsp-text-secondary) hover:bg-(--color-gsp-surface-raised) hover:text-(--color-gsp-text-primary)"
                    }`}
                  >
                    <Icon className="mr-3 text-lg shrink-0" /> {tab.label}
                  </button>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-(--color-gsp-border-muted)">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-(--radius-xl) transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <MdLogout className="mr-3 text-lg shrink-0" /> Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === "profile" && (
              <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-(--color-gsp-border-muted)">
                  <h2 className="text-lg sm:text-xl font-bold text-(--color-gsp-text-primary)">Profile Information</h2>
                  <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary) mt-1">Update your personal details and public profile.</p>
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
                        {firstName ? firstName.charAt(0).toUpperCase() : "U"}
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
                      <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 mb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Button variant="outline" size="sm" className="w-auto h-9 bg-white" onClick={() => document.getElementById("avatar-upload")?.click()}>Upload Photo</Button>
                          <Button variant="outline" size="sm" className="w-auto h-9 bg-white flex items-center gap-1.5" onClick={startCamera}>
                            <MdCameraAlt className="text-lg" /> Take Photo
                          </Button>
                          <Button variant="outline" size="sm" className="w-auto h-9 bg-white flex items-center gap-1.5" onClick={openGallery}>
                            Choose from Library
                          </Button>
                        </div>
                        {avatarUrl && (
                          <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors" onClick={() => {
                            setAvatarUrl("");
                            updateSession({ image: "" });
                            window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: "" }));
                          }}>Remove Avatar</button>
                        )}
                      </div>
                      <p className="text-xs text-(--color-gsp-text-secondary)">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">First Name</label>
                      <input aria-label="Input field" 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Last Name</label>
                      <input aria-label="Input field" 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Username</label>
                      <input aria-label="Input field" 
                        type="text" 
                        value={username}
                        disabled
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-raised) text-(--color-gsp-text-secondary) cursor-not-allowed"
                      />
                      <p className="text-xs text-(--color-gsp-text-secondary)">Username cannot be changed.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Email Address</label>
                      <input aria-label="Input field" 
                        type="email" 
                        value={email}
                        disabled
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-raised) text-(--color-gsp-text-secondary) cursor-not-allowed"
                      />
                      <p className="text-xs text-(--color-gsp-text-secondary)">Email cannot be changed.</p>
                    </div>
                  </div>

                    <div className="space-y-2">
                      <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Bio</label>
                      <textarea aria-label="Input field" 
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
                        placeholder="Write a few sentences about yourself..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
                      <div className="space-y-2">
                        <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Designation</label>
                        <input aria-label="Input field" 
                          type="text" 
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Ph.D. AI Ethics"
                          className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {session?.user?.role === 'scholar' ? (
                      <div className="mt-8 pt-8 border-t border-(--color-gsp-border-muted)">
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-(--color-gsp-text-primary)">Scholar Information</h3>
                          <p className="text-sm text-(--color-gsp-text-secondary)">Manage your professional credentials and media gallery to display on your public profile.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-violet-soft/50 p-6 rounded-(--radius-xl) border border-purple-100/50">
                          <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Professional Role / Qualification</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={qualification}
                              onChange={(e) => setQualification(e.target.value)}
                              placeholder="e.g. Senior Financial Economist"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-muted)"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Institution / Company</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={institution}
                              onChange={(e) => setInstitution(e.target.value)}
                              placeholder="e.g. Central Bank of Kuwait"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-muted)"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Specialization / Domain</label>
                            <input aria-label="Input field" 
                              type="text" 
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              placeholder="e.g. Islamic Finance & Sustainable Investments"
                              className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-muted)"
                            />
                          </div>
                          
                          <div className="space-y-2 md:col-span-2 mt-2 pt-6 border-t border-purple-100">
                            <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Featured Video</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input aria-label="Input field" 
                                type="url" 
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="e.g. https://www.youtube.com/embed/... OR Upload a file"
                                className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-(--color-gsp-surface-muted)"
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
                                className="shrink-0 bg-(--color-gsp-surface-muted)"
                                onClick={() => document.getElementById("video-upload")?.click()}
                              >
                                Upload Video File
                              </Button>
                            </div>
                            <p className="text-xs text-(--color-gsp-text-secondary)">Provide a YouTube embed URL, or upload a standard video file (.mp4, .webm) up to 100MB.</p>
                          </div>

                          {/* Media Gallery Section */}
                          <div className="space-y-6 md:col-span-2 pt-6 border-t border-purple-100">
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-(--color-gsp-text-primary)">Scholar Media Gallery</h3>
                              <p className="text-xs text-(--color-gsp-text-secondary)">Upload multiple photos and additional videos to showcase on your profile.</p>
                            </div>
                            
                            {/* Gallery Images */}
                            <div className="space-y-3 bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-lg) border border-(--color-gsp-border-muted)">
                              <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Gallery Photos</label>
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
                                  className="shrink-0 w-full sm:w-auto border-dashed border-2 hover:border-purple-500 hover:text-(--color-gsp-text-inverse) transition-colors"
                                  onClick={() => document.getElementById("gallery-images-upload")?.click()}
                                >
                                  + Add Photos
                                </Button>
                              </div>
                              {galleryImages.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                  {galleryImages.map((url, i) => (
                                    <div key={i} className="relative w-20 h-20 rounded-(--radius-lg) overflow-hidden border-2 border-(--color-gsp-border-muted) shadow-(--shadow-1) group">
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
                            <div className="space-y-3 bg-(--color-gsp-surface-muted) p-4 rounded-(--radius-lg) border border-(--color-gsp-border-muted)">
                              <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Gallery Videos</label>
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
                                  className="shrink-0 w-full sm:w-auto border-dashed border-2 hover:border-purple-500 hover:text-(--color-gsp-text-inverse) transition-colors"
                                  onClick={() => document.getElementById("gallery-videos-upload")?.click()}
                                >
                                  + Add Videos
                                </Button>
                              </div>
                              {galleryVideos.length > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4">
                                  {galleryVideos.map((url, i) => (
                                    <div key={i} className="relative w-28 h-20 bg-gray-900 rounded-(--radius-lg) overflow-hidden border border-(--color-gsp-border-muted) flex flex-col items-center justify-center group">
                                      <svg className="w-8 h-8 text-white/50 mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5h1v2H5V5zm0 4h1v2H5V9zm0 4h1v2H5v-2z"/></svg>
                                      <span className="text-2.5 text-(--color-gsp-text-secondary) truncate px-2 max-w-full">{url.split('/').pop()}</span>
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
                    ) : session?.user?.role === 'user' ? (
                      <div className="mt-8 pt-8 border-t border-(--color-gsp-border-muted)">
                        <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-(--radius-2xl) p-6 sm:p-8 border border-indigo-100/50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <svg className="w-32 h-32 text-(--color-gsp-text-inverse)" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z"/></svg>
                          </div>
                          
                          <div className="relative z-10 max-w-xl">
                            <h3 className="text-xl font-bold text-(--color-gsp-text-primary) mb-2">Become a Scholar</h3>
                            <p className="text-(--color-gsp-text-secondary) text-sm sm:text-base mb-6 leading-relaxed">
                              You are currently on a standard account. Upgrade to a Scholar Profile to publish research papers, showcase your professional credentials, and build your academic portfolio.
                            </p>
                            
                            <a 
                              href="/scholar-registration" 
                              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-(--radius-xl) shadow-(--shadow-1) text-white bg-(--color-gsp-text-inverse) hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02]"
                            >
                              Apply for Scholar Profile
                              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : null}
                </div>
                <div className="p-4 sm:p-6 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)/50 flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-(--color-gsp-text-inverse) hover:bg-purple-700"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-(--color-gsp-border-muted)">
                  <h2 className="text-lg sm:text-xl font-bold text-(--color-gsp-text-primary)">Security Settings</h2>
                  <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary) mt-1">Update your password and secure your account.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Current Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">New Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-(--color-gsp-text-primary)">Confirm New Password</label>
                    <input aria-label="Input field" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full max-w-md px-3 py-2 sm:px-4 text-sm sm:text-base border border-(--color-gsp-border-muted) rounded-(--radius-lg) focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)/50 flex justify-end">
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-(--color-gsp-text-inverse) hover:bg-purple-700"
                  >
                    {isSaving ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-(--color-gsp-border-muted)">
                  <h2 className="text-lg sm:text-xl font-bold text-(--color-gsp-text-primary)">Notification Preferences</h2>
                  <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary) mt-1">Choose how you want to be notified about updates.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-(--color-gsp-text-primary)">Email Notifications</h3>
                      <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary)">Receive an email when your application status changes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-gsp-surface-muted) after:border-(--color-gsp-border-default) after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-gsp-text-inverse)"></div>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-(--color-gsp-text-primary)">In-App Notifications</h3>
                      <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary)">Show a badge when new content is published in your domain.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-gsp-surface-muted) after:border-(--color-gsp-border-default) after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-gsp-text-inverse)"></div>
                    </label>
                  </div>
                </div>
                <div className="p-4 sm:p-6 border-t border-(--color-gsp-border-muted) bg-(--color-gsp-surface-raised)/50 flex justify-end">
                  <Button className="w-full sm:w-auto bg-(--color-gsp-text-inverse) hover:bg-purple-700">Save Preferences</Button>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-2xl) shadow-(--shadow-1) border border-(--color-gsp-border-muted) overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-(--color-gsp-border-muted)">
                  <h2 className="text-lg sm:text-xl font-bold text-(--color-gsp-text-primary)">Appearance & Layout</h2>
                  <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary) mt-1">Customize the look and feel of your dashboard.</p>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-(--color-gsp-text-primary)">Pin Dashboard Sidebar</h3>
                      <p className="text-xs sm:text-sm text-(--color-gsp-text-secondary)">Keep the sidebar expanded by default on large screens.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input aria-label="Input field" 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-(--color-gsp-surface-muted) after:border-(--color-gsp-border-default) after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--color-gsp-text-inverse)"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

        </div>
      </div>
    </div>
    </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <div className="relative w-full h-full flex flex-col">
            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
            
            <div className="absolute top-0 left-0 w-full p-6 bg-gradient-to-b from-black/60 to-transparent z-10 flex justify-between items-center">
               <h3 className="text-xl font-bold text-white drop-shadow-md">Take a Photo</h3>
               <button onClick={stopCamera} className="text-white hover:text-gray-300 transition">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-center items-center gap-6">
              <Button variant="outline" onClick={stopCamera} className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md rounded-full px-8 h-14">
                Cancel
              </Button>
              <Button onClick={capturePhoto} className="bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-3 rounded-full px-10 h-16 shadow-xl shadow-purple-900/50 text-lg transition-transform hover:scale-105">
                <MdCameraAlt className="text-3xl" /> Capture Photo
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Media Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg text-gray-900">Media Library</h3>
              <button onClick={() => setShowGallery(false)} className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingGallery ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : libraryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryImages.map((img) => (
                    <div 
                      key={img} 
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                      onClick={() => {
                        setAvatarUrl(img);
                        updateSession({ image: img });
                        window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: img }));
                        setShowGallery(false);
                      }}
                    >
                      <img src={img} alt="Library photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No images uploaded yet.
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end rounded-b-xl">
              <button onClick={() => setShowGallery(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </>
    
  );
}
