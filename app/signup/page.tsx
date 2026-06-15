"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff, MdCheckCircle, MdSchool, MdMenuBook } from "react-icons/md";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Signup() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Role, 2: Form, 3: OTP
    const [role, setRole] = useState<"reader" | "scholar" | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (selectedRole: "reader" | "scholar") => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            // Call the send-otp API
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("OTP sent to your email!");
                setStep(3);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First verify OTP by using the NextAuth credentials provider we set up for OTP
            // Wait, we set up OTP as a separate credentials provider in nextauth. 
            // Actually, we need to register the user FIRST via Supabase signup API
            // But wait, our API doesn't verify OTP directly. It sends OTP to Redis.
            // Let's create a quick verify API inside the signup route, or we can just send the OTP to a dedicated verification endpoint, or do it inside NextAuth.
            // For now, let's assume we use NextAuth OTP provider to verify. But that logs them in! We want to register them.
            // Let's send the OTP along with signup data to our signup API. We'll need to update our signup API to verify it!
            
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                    otp: otp
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account created successfully! Redirecting...");
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
            } else {
                toast.error(data.message || "Invalid OTP or Signup Failed");
            }
        } catch (err) {
            toast.error("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">
                
                {/* STEP 1: Role Selection */}
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                Join Global Scholar Publication
                            </h2>
                            <p className="mt-4 text-xl text-gray-600">
                                How would you like to use our platform?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                            {/* Reader Card */}
                            <div 
                                onClick={() => handleRoleSelect("reader")}
                                className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 cursor-pointer hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl"></div>
                                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MdMenuBook className="text-3xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Reader</h3>
                                <p className="text-gray-600">
                                    Discover groundbreaking research, read published papers, and stay updated with the latest in global academia.
                                </p>
                            </div>

                            {/* Scholar Card */}
                            <div 
                                onClick={() => handleRoleSelect("scholar")}
                                className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 cursor-pointer hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl"></div>
                                <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MdSchool className="text-3xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Scholar</h3>
                                <p className="text-gray-600">
                                    Publish your research, peer-review articles, and collaborate with academics worldwide.
                                </p>
                            </div>
                        </div>

                        <p className="text-center mt-8 text-gray-600">
                            Already have an account? <Link href="/signin" className="font-semibold text-indigo-600 hover:underline">Log in</Link>
                        </p>
                    </div>
                )}

                {/* STEP 2: Form Input */}
                {step === 2 && (
                    <div className="max-w-md mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-2xl animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
                                Create an Account
                            </h2>
                            <p className="text-gray-500 mt-2">Join Global Scholar to access research.</p>
                        </div>

                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                                    <input 
                                        type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                                    <input 
                                        type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                            >
                                {loading ? "Sending OTP..." : "Continue"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or sign up with
                                </span>
                            </div>
                        </div>

                        {/* Social Signup Buttons */}
                        <div className="mt-6">
                            <button
                                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                <FcGoogle className="text-xl" />
                                <span>Google</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: OTP Verification */}
                {step === 3 && (
                    <div className="max-w-md mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-2xl animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900">Verify Email</h2>
                            <p className="text-sm text-gray-600 mt-2">We sent a 6-digit code to <strong>{formData.email}</strong></p>
                        </div>

                        <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                <input 
                                    type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
                                    maxLength={6}
                                    className="w-full p-4 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                    placeholder="------"
                                />
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
                            >
                                {loading ? "Verifying..." : "Verify & Create Account"}
                            </button>
                            
                            <button type="button" onClick={() => setStep(2)} className="w-full text-sm text-gray-500 hover:text-gray-800">
                                ← Back to Form
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
