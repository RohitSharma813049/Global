import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ReaderDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Reader Dashboard</h1>
      <p className="text-gray-600">Welcome to your dashboard. Here you can view your saved papers, reading history, and bookmarks.</p>
    </div>
  );
}
