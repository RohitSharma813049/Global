"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/signin");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <button
                            onClick={() => signOut({ callbackUrl: "/signin" })}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-blue-700 font-medium">
                            Welcome back, {session?.user?.name || session?.user?.email}!
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                            Your current role is: <span className="font-bold uppercase">{session?.user?.role || "USER"}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Details</h2>
                            <p className="text-gray-600"><strong>Email:</strong> {session?.user?.email}</p>
                            <p className="text-gray-600"><strong>ID:</strong> {session?.user?.id}</p>
                        </div>
                        
                        {(session?.user?.role === "admin" || session?.user?.role === "super_admin") && (
                            <div className="p-6 border rounded-lg shadow-sm bg-indigo-50 border-indigo-200">
                                <h2 className="text-xl font-semibold text-indigo-900 mb-2">Admin Controls</h2>
                                <p className="text-indigo-700 mb-4">You have elevated access.</p>
                                
                                {session?.user?.role === "super_admin" && (
                                    <button 
                                        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                        onClick={() => router.push('/admin/create')}
                                    >
                                        Create New Admin
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
