import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 });
    }

    // 1. Verify OTP from Redis
    const storedOtp = await redis.get(`reset_otp:${email}`);

    if (!storedOtp || String(storedOtp) !== String(otp)) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    // 2. Look up the user in Supabase Admin API
    // To update a user's password securely via admin API, we first need their user ID
    // or we can just use admin.updateUserById if we have it. 
    // Wait, Supabase provides admin.updateUserById but requires the UID.
    // The easiest way is to use admin.listUsers or we can just use the standard API if they are logged in,
    // but they are NOT logged in! 
    // We can list users to find their ID.
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
        throw listError;
    }

    const user = usersData.users.find(u => u.email === email);

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Update the password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
    });

    if (updateError) {
        throw updateError;
    }

    // 4. Delete the OTP from Redis
    await redis.del(`reset_otp:${email}`);

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
