"use client";

import React, { useState } from 'react';
import { submitScholarApplication } from '@/app/actions/scholar-applications';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function BecomeScholarModal({ 
  children, 
  initialData 
}: { 
  children?: React.ReactNode, 
  initialData?: any 
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitScholarApplication(formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Application submitted successfully! Our team will review it.');
      setOpen(false); // Close the modal
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">Apply Now</button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Become a Scholar</DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-gray-600 text-center mb-4">
          Join our academic community to publish research.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              name="full_name"
              type="text" 
              defaultValue={initialData?.full_name || ''}
              required 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
            <input 
              name="qualification"
              type="text" 
              defaultValue={initialData?.qualification || ''}
              required 
              placeholder="e.g. Ph.D. in Computer Science"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Institution</label>
            <input 
              name="institution"
              type="text" 
              defaultValue={initialData?.institution || ''}
              required 
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input 
              name="specialization"
              type="text" 
              defaultValue={initialData?.specialization || ''}
              required 
              placeholder="e.g. Artificial Intelligence"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Supporting Document</label>
            <input 
              name="document_file"
              type="file" 
              accept=".pdf,.doc,.docx"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {initialData?.documents?.document_link && (
              <p className="text-xs text-gray-500 mt-1">
                You previously uploaded a document. Uploading a new one will replace it.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Links (Optional)</label>
            <input 
              name="additional_link"
              type="url" 
              defaultValue={initialData?.documents?.additional_link || ''}
              placeholder="e.g. ResearchGate or LinkedIn profile"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
