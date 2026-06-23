"use client";
import React, { useState } from "react";
import Footer from "@/components/footer";
import { MdSchool, MdPerson, MdDomain, MdUploadFile } from "react-icons/md";
import toast from "react-hot-toast";

export default function ScholarRegistration() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    qualification: "",
    institution: "",
    specialization: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mocking API call to submit scholar application
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Scholar application submitted successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdSchool className="text-3xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Scholar Registration</h1>
              <p className="text-gray-600">Submit your academic credentials to get verified and start publishing.</p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-fade-in-up">
                <h3 className="text-xl font-bold text-emerald-800 mb-2">Application Received!</h3>
                <p className="text-emerald-700">
                  Your profile has been submitted and is currently under review by our administrators. 
                  You will receive an email notification once your profile goes live.
                </p>
                <button 
                  onClick={() => window.location.href = "/dashboard"}
                  className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Legal Name</label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input aria-label="Input field" 
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                      className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Dr. Jane Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Highest Qualification</label>
                    <div className="relative">
                      <MdSchool className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input aria-label="Input field" 
                        type="text" name="qualification" value={formData.qualification} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. Ph.D. in Physics"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution/University</label>
                    <div className="relative">
                      <MdDomain className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input aria-label="Input field" 
                        type="text" name="institution" value={formData.institution} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. Harvard University"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization / Domain</label>
                  <input aria-label="Input field" 
                    type="text" name="specialization" value={formData.specialization} onChange={handleChange} required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="e.g. Quantum Mechanics, Machine Learning"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Verification Documents (PDF)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <MdUploadFile className="text-4xl text-gray-400 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">Upload ID and degree certificate</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-amber-800 font-medium">
                      Note: Your profile will be reviewed by our administrators before approval. False credentials will lead to a ban.
                    </p>
                  </div>
                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
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
