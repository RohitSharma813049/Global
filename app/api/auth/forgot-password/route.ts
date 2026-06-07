import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save to Redis with a 10-minute expiration
    await redis.setex(`reset_otp:${email}`, 600, otp);

    // 3. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Gmail,
        pass: process.env.Gmail_password,
      },
    });

    const mailOptions = {
      from: process.env.Gmail,
      to: email,
      subject: "Password Reset Code - Global Scholar Publication",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>You have requested to reset your password. Here is your 6-digit reset code:</p>
          <h1 style="background: #F3F4F6; padding: 15px; border-radius: 8px; letter-spacing: 5px; text-align: center;">${otp}</h1>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    // 4. Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Reset code sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Failed to send reset code" }, { status: 500 });
  }
}
