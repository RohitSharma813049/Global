import { NextResponse } from "next/server";
import { supabase } from "@/lib/superbaseconfig";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
    try {
        const { name, email, password, role, otp } = await req.json();

        if (!otp) {
            return NextResponse.json({ message: "OTP is required" }, { status: 400 });
        }

        // Verify OTP from Redis
        const storedOtp = await redis.get(`otp:${email}`);
        
        if (!storedOtp) {
            return NextResponse.json({ message: "OTP expired or invalid" }, { status: 400 });
        }

        if (String(storedOtp) !== String(otp)) {
            return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
        }

        // OTP is valid, delete it so it can't be reused
        await redis.del(`otp:${email}`);

        // Security check: Don't allow creating admins from public signup
        const finalRole = (role === "admin" || role === "super_admin") ? "reader" : (role || "reader");

        // Register user with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: finalRole,
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
            { message: "User created successfully", user: { id: data.user?.id, email, name } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}