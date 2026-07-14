"use client";
import React, { useState } from "react";
import Footer from "@/components/layout/footer";
import { MdSchool, MdPerson, MdDomain, MdEmail, MdPhone, MdPublic, MdLock, MdCheckCircle } from "react-icons/md";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ScholarRegistration() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    country: "",
    institution: "",
    username: "",
    password: "",
    confirmPassword: "",
    termsAcceptance: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const val = type === "checkbox" ? (target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.termsAcceptance) {
      toast.error("Please accept the terms and privacy policy to register");
      return;
    }

    setLoading(true);
    
    // Mocking API call to register scholar
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Scholar registration successful!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdSchool className="text-3xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Scholar Registration</h1>
              <p className="text-gray-600">Join our global community of researchers and academics.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-fade-in-up">
                <MdCheckCircle className="text-5xl text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Registration Complete!</h3>
                <p className="text-emerald-700">
                  Welcome to the platform! Please check your email to verify your account before signing in.
                </p>
                <div className="mt-6 flex gap-4 justify-center">
                  <Link href="/signin" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/" className="bg-white text-emerald-600 border border-emerald-200 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                    Return Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Jane"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="jane@university.edu"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative">
                      <MdPhone className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <div className="relative">
                      <MdPublic className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <select name="country" value={formData.country} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                      >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution/University</label>
                    <div className="relative">
                      <MdDomain className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="text" name="institution" value={formData.institution} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. Harvard University"
                      />
                    </div>
                  </div>
                </div>

                {/* Account details */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Account Details</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400 font-medium">@</span>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required
                          className="pl-8 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="janedoe"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                          <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                          <input type="password" name="password" value={formData.password} onChange={handleChange} required
                            className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                          <MdLock className="absolute left-3 top-3 text-gray-400 text-xl" />
                          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                            className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="termsAcceptance" checked={formData.termsAcceptance} onChange={handleChange} required className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? "Registering..." : "Create Account"}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account? <Link href="/signin" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
