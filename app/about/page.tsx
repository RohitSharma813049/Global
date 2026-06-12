import React from "react";
import { BackButton } from "@/components/back-button";

export default function About() {
  return (
    <div className="min-h-screen bg-white py-24">
      <BackButton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">About Us</h1>
        <p className="text-lg text-gray-600 mb-6">
          Global Scholar Publication is dedicated to advancing the frontier of human knowledge by connecting researchers, academics, and readers across the globe.
        </p>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
          <p className="text-indigo-800 font-medium">
            Our mission is to make high-quality academic research accessible to everyone, everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
