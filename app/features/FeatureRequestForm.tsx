"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { submitFeatureRequest } from "@/app/actions/features"; // We will create this action

export default function FeatureRequestForm() {
  const { data: session, status } = useSession();
  const [requestText, setRequestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl mt-12 max-w-2xl mx-auto"></div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mt-16 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 font-['Cormorant_Garamond']">Have a Feature Idea?</h3>
        <p className="text-gray-600 mb-6">Sign in to request a new feature directly to our admin team.</p>
        <Link href="/signin">
          <button className="px-6 py-2.5 bg-violet text-white font-semibold rounded-full hover:bg-indigo-700 transition">
            Sign In to Request
          </button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await submitFeatureRequest(requestText);
      if (res.success) {
        setIsSuccess(true);
        setRequestText("");
      } else {
        setError(res.error || "Failed to submit request.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left">
      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Cormorant_Garamond']">Request a Feature</h3>
      <p className="text-gray-600 mb-6">Tell us what you'd like to see next on the platform.</p>
      
      {isSuccess ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          Thank you! Your feature request has been sent to the admin team.
          <button 
            onClick={() => setIsSuccess(false)}
            className="block mt-4 text-sm font-semibold underline hover:text-green-800"
          >
            Submit another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="Describe the feature in detail..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet min-h-30"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !requestText.trim()}
            className="self-end px-6 py-2.5 bg-violet text-white font-semibold rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}
