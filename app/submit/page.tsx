"use client";
import React, { useState } from "react";
import Footer from "@/components/layout/footer";
import { MdUploadFile, MdTitle, MdPerson, MdDomain, MdEmail } from "react-icons/md";
import toast from "react-hot-toast";

export default function SubmissionPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "Article",
    subjectCategory: "Computer Science & AI",
    authorName: "",
    institution: "",
    email: "",
    abstract: "",
    originalityDeclaration: false,
    copyrightDeclaration: false,
    termsAcceptance: false,
  });

  const contentTypes = ["Thesis", "Article", "Ebook", "Magazine"];
  const subjectCategories = [
    "Computer Science & AI",
    "Engineering & Technology",
    "Medical & Health Sciences",
    "Business & Management",
    "Social Sciences",
    "Education",
    "Humanities",
    "Law",
    "Agriculture",
    "Environmental Studies",
    "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const val = type === "checkbox" ? (target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.originalityDeclaration || !formData.copyrightDeclaration || !formData.termsAcceptance) {
      toast.error("Please accept all declarations and terms to proceed.");
      return;
    }
    setLoading(true);
    
    // Mocking API call to submit publication
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Publication submitted successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdUploadFile className="text-3xl" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Submit Your Work</h1>
              <p className="text-gray-600">Publish your thesis, article, ebook, or magazine with our global platform.</p>
            </div>

            {submitted ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 text-center animate-fade-in-up">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">Submission Received!</h3>
                <p className="text-indigo-700">
                  Your work has been submitted and is currently under peer review. 
                  You will receive an email notification once it is published.
                </p>
                <button 
                  onClick={() => window.location.href = "/"}
                  className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Return Home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title of Work</label>
                  <div className="relative">
                    <MdTitle className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required
                      className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Enter the full title of your submission"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
                    <select name="contentType" value={formData.contentType} onChange={handleChange} required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                    >
                      {contentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Category</label>
                    <select name="subjectCategory" value={formData.subjectCategory} onChange={handleChange} required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                    >
                      {subjectCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Author Name</label>
                    <div className="relative">
                      <MdPerson className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Dr. John Doe"
                      />
                    </div>
                  </div>

                  {/* Institution */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Institution / University</label>
                    <div className="relative">
                      <MdDomain className="absolute left-3 top-3 text-gray-400 text-xl" />
                      <input type="text" name="institution" value={formData.institution} onChange={handleChange} required
                        className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="e.g. Oxford University"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400 text-xl" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="author@university.edu"
                    />
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Abstract / Summary</label>
                  <textarea name="abstract" value={formData.abstract} onChange={handleChange} required rows={5}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Provide a brief summary or abstract of your work..."
                  ></textarea>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Main Document (PDF / DOCX / ePub)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative">
                    <input type="file" required accept=".pdf,.doc,.docx,.epub" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <MdUploadFile className="text-4xl text-gray-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">Maximum file size: 50MB</p>
                  </div>
                </div>

                {/* Declarations */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Declarations & Agreements</h4>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="originalityDeclaration" checked={formData.originalityDeclaration} onChange={handleChange} required className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700"><strong>Originality Declaration:</strong> I confirm that this submission is my own original work and does not infringe upon any existing copyright.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="copyrightDeclaration" checked={formData.copyrightDeclaration} onChange={handleChange} required className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700"><strong>Copyright Declaration:</strong> I grant this platform the right to publish and distribute this work under the agreed terms.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="termsAcceptance" checked={formData.termsAcceptance} onChange={handleChange} required className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300" />
                    <span className="text-sm text-gray-700"><strong>Terms & Conditions:</strong> I have read and agree to the Terms & Conditions and Privacy Policy.</span>
                  </label>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? "Submitting..." : "Submit Publication"}
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
