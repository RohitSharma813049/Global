"use client";
import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

type Screen = "signin" | "signup" | "otp" | "forgot" | "reset-sent";
type Role = "scholar" | "reader";
type AuthMethod = "otp" | "password";

interface AuthUIProps {
  initialScreen: Screen;
}

export default function AuthUI({ initialScreen }: AuthUIProps) {
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState<Screen>(initialScreen);
  const [role, setRole] = useState<Role>("scholar");
  const [method, setMethod] = useState<AuthMethod>("otp");
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    country: "",
    institution: "",
    username: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [signinPw, setSigninPw] = useState("");
  const [showSigninPw, setShowSigninPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showSignupPw2, setShowSignupPw2] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timerCount, setTimerCount] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerCount]);

  useEffect(() => {
    // Auto-detect country based on mobile number prefix if country is empty
    if (!formData.country && formData.mobileNumber) {
      const num = formData.mobileNumber;
      if (num.startsWith("+91")) setFormData(prev => ({ ...prev, country: "India" }));
      else if (num.startsWith("+1")) setFormData(prev => ({ ...prev, country: "United States" }));
      else if (num.startsWith("+44")) setFormData(prev => ({ ...prev, country: "United Kingdom" }));
      else if (num.startsWith("+61")) setFormData(prev => ({ ...prev, country: "Australia" }));
      else if (num.startsWith("+86")) setFormData(prev => ({ ...prev, country: "China" }));
      else if (num.startsWith("+81")) setFormData(prev => ({ ...prev, country: "Japan" }));
      else if (num.startsWith("+49")) setFormData(prev => ({ ...prev, country: "Germany" }));
      else if (num.startsWith("+33")) setFormData(prev => ({ ...prev, country: "France" }));
      else if (num.startsWith("+971")) setFormData(prev => ({ ...prev, country: "United Arab Emirates" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.mobileNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignInPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !signinPw) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: signinPw,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (activeScreen === "signup") {
      if (!formData.firstName || !formData.lastName || !formData.password || !formData.confirmPassword || !formData.username) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (!formData.termsAccepted) {
        toast.error("You must accept the terms and privacy policy");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        toast.success("OTP sent to your email!");
        setActiveScreen("otp");
        setTimerCount(60);
        setTimerActive(true);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setLoading(true);

    if (activeScreen === "otp" && formData.firstName) {
      // This means we came from SignUp
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            role,
            otp: otpCode,
          }),
        });

        if (response.ok) {
          toast.success("Account created successfully!");
          setActiveScreen("signin");
          setMethod("password");
        } else {
          const data = await response.json();
          toast.error(data.message || "Signup failed");
        }
      } catch (err) {
        toast.error("Failed to create account.");
      }
    } else {
      // Login with OTP logic
      try {
        const result = await signIn("otp", {
          email: formData.email,
          otp: otpCode,
          redirect: false,
        });
        if (result?.error) {
          toast.error("Invalid or expired OTP");
        } else {
          toast.success("Successfully signed in");
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error("An error occurred during sign in.");
      }
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const pwScore = React.useMemo(() => {
    let score = 0;
    const pw = formData.password;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }, [formData.password]);

  return (
    <div className="auth-root">
      {/* ═══════════════════════════════
           LEFT — Auth Panel
      ═══════════════════════════════ */}
      <div className="auth-left">
        {/* Top bar */}
        <div className="auth-topbar">
          <Link href="/" className="flex items-center gap-0">
            <Image
              src="/logo1.png"
              alt="Global Scholar Publications"
              width={140}
              height={50}
              className="h-auto w-auto"
              style={{ width: "auto" }}
            />
          </Link>
          <Link href="/" className="auth-topbar-link">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Form area */}
        <div className="auth-form-wrap">
          <div className="auth-form-inner">

            {/* ══════ SCREEN: SIGN IN ══════ */}
            {activeScreen === "signin" && (
              <div className="animate-fade-in-up">
                <p className="form-eyebrow">Welcome back</p>
                <h2 className="form-title">Sign <em>In</em></h2>
                <p className="form-sub">Access your GSP account to read, publish and connect with scholars worldwide.</p>

                {/* Role tabs */}
                <div className="role-tabs">
                  <button className={`role-tab ${role === "scholar" ? "active" : ""}`} onClick={() => setRole("scholar")}>
                    <span className="role-tab-icon" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </span>
                    <span className="role-tab-name">Scholar</span>
                    <span className="role-tab-desc">Publish & manage research</span>
                    <span className="role-check"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                  <button className={`role-tab ${role === "reader" ? "active" : ""}`} onClick={() => setRole("reader")}>
                    <span className="role-tab-icon" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </span>
                    <span className="role-tab-name">Reader</span>
                    <span className="role-tab-desc">Discover & bookmark research</span>
                    <span className="role-check"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                </div>

                {/* Auth method tabs */}
                <div className="method-tabs">
                  <button className={`method-tab ${method === "otp" ? "active" : ""}`} onClick={() => setMethod("otp")}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 6l6 3.5L13 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    Email OTP
                  </button>
                  <button className={`method-tab ${method === "password" ? "active" : ""}`} onClick={() => setMethod("password")}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="3" y="6" width="8" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5 6V4.5a2 2 0 014 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    Password
                  </button>
                </div>

                {/* Google */}
                <button className="google-btn" type="button" onClick={handleGoogleAuth} disabled={loading}>
                  <svg className="google-icon" width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="divider">or sign in with</div>

                {/* OTP method */}
                {method === "otp" && (
                  <form onSubmit={handleSendOTP}>
                    <div className="field">
                      <label className="field-label">Email address</label>
                      <div className="input-wrap">
                        <span className="input-icon">
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                        </span>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="field-input has-icon" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                      <span className="btn-text">Send OTP Code</span>
                      <div className="btn-spinner"></div>
                    </button>
                  </form>
                )}

                {/* Password method */}
                {method === "password" && (
                  <form onSubmit={handleSignInPassword}>
                    <div className="field">
                      <label className="field-label">Email address</label>
                      <div className="input-wrap">
                        <span className="input-icon">
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                        </span>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="field-input has-icon" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">
                        Password
                        <button type="button" onClick={() => setActiveScreen("forgot")} className="text-violet hover:opacity-75 bg-transparent border-none p-0 cursor-pointer text-2.875">Forgot password?</button>
                      </label>
                      <div className="input-wrap">
                        <span className="input-icon">
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                        </span>
                        <input type={showSigninPw ? "text" : "password"} value={signinPw} onChange={(e) => setSigninPw(e.target.value)} className="field-input has-icon" placeholder="Enter your password" required />
                        <button className="input-action" type="button" onClick={() => setShowSigninPw(!showSigninPw)}>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                            {!showSigninPw && <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
                          </svg>
                        </button>
                      </div>
                    </div>
                    <label className="check-row">
                      <input type="checkbox" />
                      <span className="check-box"></span>
                      <span className="check-text">Keep me signed in for 30 days</span>
                    </label>
                    <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                      <span className="btn-text">Sign In</span>
                      <div className="btn-spinner"></div>
                    </button>
                  </form>
                )}

                <div className="switch-row">
                  Don't have an account? <a onClick={() => setActiveScreen("signup")}>Create one</a>
                </div>
              </div>
            )}

            {/* ══════ SCREEN: SIGN UP ══════ */}
            {activeScreen === "signup" && (
              <div className="animate-fade-in-up">
                <button className="back-link" onClick={() => setActiveScreen("signin")}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back to Sign In
                </button>
                <div className="step-dots">
                  <div className="step-dot active"></div>
                  <div className="step-dot idle"></div>
                  <div className="step-dot idle"></div>
                </div>
                <p className="form-eyebrow">Create your account</p>
                <h2 className="form-title">Join <em>GSP</em></h2>
                <p className="form-sub">Become part of a global community of scholars and readers.</p>

                {/* Role tabs */}
                <div className="role-tabs" style={{ marginBottom: "20px" }}>
                  <button className={`role-tab ${role === "scholar" ? "active" : ""}`} onClick={() => setRole("scholar")}>
                    <span className="role-tab-icon" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </span>
                    <span className="role-tab-name">Scholar</span>
                    <span className="role-tab-desc">Publish your research</span>
                    <span className="role-check"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                  <button className={`role-tab ${role === "reader" ? "active" : ""}`} onClick={() => setRole("reader")}>
                    <span className="role-tab-icon" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </span>
                    <span className="role-tab-name">Reader</span>
                    <span className="role-tab-desc">Explore publications</span>
                    <span className="role-check"><svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </button>
                </div>

                <button className="google-btn" type="button" onClick={handleGoogleAuth} disabled={loading}>
                  <svg className="google-icon" width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Sign up with Google
                </button>

                <div className="divider">or sign up with email</div>

                <form onSubmit={handleSendOTP}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="field-label">First name</label>
                      <div className="input-wrap">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="field-input" placeholder="Amira" required />
                      </div>
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="field-label">Last name</label>
                      <div className="input-wrap">
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="field-input" placeholder="Al-Rashidi" required />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Username</label>
                    <div className="input-wrap">
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className="field-input" placeholder="amira_rashidi" required />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Email address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </span>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="field-input has-icon" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="field-label">Mobile Number</label>
                      <div className="input-wrap">
                        <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="field-input" placeholder="+1 234..." maxLength={15} required />
                      </div>
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <label className="field-label">Country</label>
                      <div className="input-wrap">
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="field-input" placeholder="USA" maxLength={50} required />
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Institution / University</label>
                    <div className="input-wrap">
                      <input type="text" name="institution" value={formData.institution} onChange={handleChange} className="field-input" placeholder="Harvard University" required />
                    </div>
                  </div>

                  <div className="field">
                    <label className="field-label">Password</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </span>
                      <input type={showSignupPw ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="field-input has-icon" placeholder="Min. 8 characters" required />
                      <button className="input-action" type="button" onClick={() => setShowSignupPw(!showSignupPw)}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                          {!showSignupPw && <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
                        </svg>
                      </button>
                    </div>
                    {formData.password && (
                      <div className="pw-strength" style={{ display: "block" }}>
                        <div className="pw-bars">
                          <div className={`pw-bar ${pwScore <= 1 ? "weak" : pwScore <= 3 ? "fair" : "strong"}`} style={{ background: pwScore >= 1 ? (pwScore <= 1 ? "var(--error)" : pwScore <= 3 ? "#F59E0B" : "var(--success)") : "var(--rule)" }}></div>
                          <div className={`pw-bar ${pwScore <= 1 ? "weak" : pwScore <= 3 ? "fair" : "strong"}`} style={{ background: pwScore >= 2 ? (pwScore <= 1 ? "var(--error)" : pwScore <= 3 ? "#F59E0B" : "var(--success)") : "var(--rule)" }}></div>
                          <div className={`pw-bar ${pwScore <= 1 ? "weak" : pwScore <= 3 ? "fair" : "strong"}`} style={{ background: pwScore >= 3 ? (pwScore <= 1 ? "var(--error)" : pwScore <= 3 ? "#F59E0B" : "var(--success)") : "var(--rule)" }}></div>
                          <div className={`pw-bar ${pwScore <= 1 ? "weak" : pwScore <= 3 ? "fair" : "strong"}`} style={{ background: pwScore >= 4 ? (pwScore <= 1 ? "var(--error)" : pwScore <= 3 ? "#F59E0B" : "var(--success)") : "var(--rule)" }}></div>
                        </div>
                        <span className="pw-label" style={{ color: pwScore <= 1 ? "var(--error)" : pwScore <= 3 ? "#F59E0B" : "var(--success)" }}>
                          {pwScore <= 1 ? "Weak" : pwScore <= 3 ? "Fair" : "Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="field">
                    <label className="field-label">Confirm password</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </span>
                      <input type={showSignupPw2 ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="field-input has-icon" placeholder="Repeat password" required />
                      <button className="input-action" type="button" onClick={() => setShowSignupPw2(!showSignupPw2)}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                          {!showSignupPw2 && <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <label className="check-row">
                    <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
                    <span className="check-box"></span>
                    <span className="check-text">I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link></span>
                  </label>

                  <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                    <span className="btn-text">Create Account</span>
                    <div className="btn-spinner"></div>
                  </button>
                </form>

                <div className="switch-row">Already have an account? <a onClick={() => setActiveScreen("signin")}>Sign in</a></div>
              </div>
            )}

            {/* ══════ SCREEN: OTP VERIFY ══════ */}
            {activeScreen === "otp" && (
              <div className="animate-fade-in-up">
                <button className="back-link" onClick={() => setActiveScreen(formData.firstName ? "signup" : "signin")}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
                <div className="step-dots">
                  <div className="step-dot done"></div>
                  <div className="step-dot active"></div>
                  <div className="step-dot idle"></div>
                </div>
                <p className="form-eyebrow"><span className="form-eyebrow-line"></span>Step 2 of 3</p>
                <h2 className="form-title">Check your <em>email</em></h2>
                <p className="form-sub">We sent a 6-digit code to <strong>{formData.email}</strong>. Enter it below to continue.</p>

                <form onSubmit={handleVerifyOTP}>
                  <div className="otp-row">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        className={`otp-cell ${digit ? "filled" : ""}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        required
                      />
                    ))}
                  </div>
                  
                  {timerActive ? (
                    <p className="otp-timer">Resend code in <strong>{timerCount}</strong>s</p>
                  ) : (
                    <div className="text-center mb-4">
                      <button type="button" className="otp-resend show" onClick={handleSendOTP}>Resend OTP</button>
                    </div>
                  )}

                  <button className={`submit-btn ${loading ? "loading" : ""}`} type="submit" disabled={loading}>
                    <span className="btn-text">Verify & Continue</span>
                    <div className="btn-spinner"></div>
                  </button>
                </form>
                
                <div className="switch-row">
                  Wrong email? <a onClick={() => setActiveScreen(formData.firstName ? "signup" : "signin")}>Change it</a>
                </div>
              </div>
            )}

            {/* ══════ SCREEN: FORGOT PASSWORD ══════ */}
            {activeScreen === "forgot" && (
              <div className="animate-fade-in-up">
                <button className="back-link" onClick={() => setActiveScreen("signin")}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back to Sign In
                </button>
                <p className="form-eyebrow"><span className="form-eyebrow-line"></span>Account recovery</p>
                <h2 className="form-title">Reset your <em>password</em></h2>
                <p className="form-sub">Enter the email associated with your GSP account and we'll send a reset link to your inbox.</p>

                <form onSubmit={(e) => { e.preventDefault(); setActiveScreen("reset-sent"); }}>
                  <div className="field">
                    <label className="field-label">Email address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="3.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 7l7 4 7-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </span>
                      <input type="email" className="field-input has-icon" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <button className="submit-btn" type="submit">
                    <span className="btn-text">Send Reset Link</span>
                  </button>
                </form>
                <div className="switch-row">Remembered it? <a onClick={() => setActiveScreen("signin")}>Back to Sign In</a></div>
              </div>
            )}

            {/* ══════ SCREEN: RESET SENT ══════ */}
            {activeScreen === "reset-sent" && (
              <div className="animate-fade-in-up" style={{ textAlign: "center", padding: "16px 0 28px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "16px", overflow: "hidden", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(47,17,93,0.15)", position: "relative" }}>
                  <Image src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=160&h=160&fit=crop&auto=format&q=80" alt="Email sent" fill className="object-cover" />
                </div>
                <h2 className="form-title" style={{ fontSize: "28px", marginBottom: "10px" }}>Check your <em>inbox</em></h2>
                <p className="form-sub" style={{ marginBottom: "28px" }}>We've sent a password reset link to your email address. The link expires in 15 minutes.</p>
                <button className="submit-btn" onClick={() => setActiveScreen("signin")}>
                  <span className="btn-text">Back to Sign In</span>
                </button>
                <div className="switch-row" style={{ marginTop: "14px" }}>Didn't get any password reset link? <a onClick={() => setActiveScreen("forgot")}>Try again</a></div>
              </div>
            )}

          </div>
        </div>
      </div>
      {/* /auth-left */}

      {/* ═══════════════════════════════
           RIGHT — Image Panel
      ═══════════════════════════════ */}
      <div className="auth-right" aria-hidden="true">
        <div className="auth-right-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=900&fit=crop&auto=format&q=85')", opacity: 1 }}></div>
        <div className="auth-right-overlay"></div>
        <div className="auth-right-texture"></div>

        <div className="auth-right-content">
          <blockquote className="ar-quote">
            Publishing with GSP transformed my career. My research on GCC economic policy reached scholars in 62 countries within a single week.
          </blockquote>
          <div className="ar-author">
            <div className="ar-avatar" style={{ position: "relative", overflow: "hidden" }}>
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80" alt="Prof. Khalid Al-Mansouri" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <div className="ar-name">Prof. Khalid Al-Mansouri</div>
              <div className="ar-cred">Hon. D.B.A. · Gulf Institute of Economic Research</div>
            </div>
          </div>
          <div className="ar-stats">
            <div className="ar-stat"><div className="ar-stat-n">12K+</div><div className="ar-stat-l">Publications</div></div>
            <div className="ar-stat"><div className="ar-stat-n">25K+</div><div className="ar-stat-l">Researchers</div></div>
            <div className="ar-stat"><div className="ar-stat-n">80+</div><div className="ar-stat-l">Countries</div></div>
          </div>
        </div>
      </div>

    </div>
  );
}
