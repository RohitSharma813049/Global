import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { createClient } from "@supabase/supabase-js";
import { authRateLimit } from "@/lib/rate-limit";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await authRateLimit.limit(ip);
        
        if (!success) {
            return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });
        }

        const { firstName, lastName, email, mobileNumber, country, institution, username, password, role, otp } = await req.json();
        
        const fullName = `${firstName} ${lastName}`.trim();

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

        // Security check: Force all new public signups to be 'reader'. 
        // Scholars must go through the application process and be approved by an admin.
        const finalRole = "reader";

        // Register user with Supabase Admin API to bypass rate limits
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: fullName,
                first_name: firstName,
                last_name: lastName,
                mobile_number: mobileNumber,
                country: country,
                institution: institution,
                username: username,
                role: finalRole,
            }
        });

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "User created successfully", user: { id: data.user?.id, email, name: fullName } },
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
