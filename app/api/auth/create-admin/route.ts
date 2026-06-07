import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/lib/superbaseconfig";

export async function POST(req: Request) {
    try {
        // 1. Verify the requester is a super_admin
        const session = await getServerSession();
        
        if (!session || !session.user || (session.user as any).role !== "super_admin") {
            return NextResponse.json(
                { message: "Unauthorized. Only super admins can create admins." },
                { status: 403 }
            );
        }

        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // 2. Register the new admin with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: "admin", // Hardcoded to admin
                }
            }
        });

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Admin created successfully", user: { id: data.user?.id, email, name, role: "admin" } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create admin error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
