"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function submitFeatureRequest(text: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Save feature request in audit_logs as we don't have a dedicated table yet
    await prisma.audit_logs.create({
      data: {
        user_id: session.user.id,
        action: "FEATURE_REQUEST",
        details: { text },
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting feature request:", error);
    return { success: false, error: "Internal server error" };
  }
}
