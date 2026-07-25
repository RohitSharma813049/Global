"use client";
import React, { useState } from "react";
import Footer from "@/components/layout/footer";
import { MdUploadFile, MdTitle, MdPerson, MdDomain, MdEmail } from "react-icons/md";
import toast from "react-hot-toast";

export default function SubmissionPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
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

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const input = document.getElementById('main_document') as HTMLInputElement;
    if (input) input.value = '';
    setFileName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.originalityDeclaration || !formData.copyrightDeclaration || !formData.termsAcceptance) {
      toast.error("Please accept all declarations and terms to proceed.");
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const remaining = 95 - prev;
        return prev + Math.max(1, remaining * 0.1);
      });
    }, 500);
    
    // Mocking API call to submit publication
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        toast.success("Publication submitted successfully!");
      }, 500);
    }, 2000);
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
                  <label htmlFor="main_document" className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative">
                    <input 
                      id="main_document"
                      type="file" 
                      required 
                      accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.epub,application/epub+zip" 
                      className="sr-only" 
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    />
                    
                    {fileName ? (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-emerald-600 font-medium flex items-center gap-2">
                          {fileName}
                          <button type="button" onClick={clearFile} className="text-gray-400 hover:text-red-500 p-1" title="Remove file">✕</button>
                        </span>
                      </div>
                    ) : (
                      <>
                        <MdUploadFile className="text-4xl text-gray-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum file size: 50MB</p>
                      </>
                    )}
                  </label>
                </div>

                {/* Declarations */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Declarations & Agreements</h4>
                  
                  <label className="flex items-start gap-3 cursor-pointer pb-3 border-b border-gray-200">
                    <input 
                      type="checkbox" 
                      checked={formData.originalityDeclaration && formData.copyrightDeclaration && formData.termsAcceptance} 
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData({ 
                          ...formData, 
                          originalityDeclaration: checked, 
                          copyrightDeclaration: checked, 
                          termsAcceptance: checked 
                        });
                      }} 
                      className="mt-1 w-4 h-4 text-indigo-800 rounded border-gray-300 focus:ring-indigo-800" 
                    />
                    <span className="text-sm font-bold text-gray-900">Agree to all terms & conditions</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-1">
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
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : "Submit Publication"}
                  </button>
                </div>
              </form>
            )}
            
            {/* Upload Progress Overlay */}
            {loading && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Uploading Files...</h3>
                  <p className="text-sm text-gray-500 mb-6">Please keep this window open until the upload completes.</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500 mb-4">
                    <span>{uploadProgress < 100 ? 'Processing...' : 'Finalizing...'}</span>
                    <span>{Math.round(Math.min(uploadProgress, 100))}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
