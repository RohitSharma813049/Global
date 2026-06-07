import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { redis } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to Redis with a 5-minute expiration (300 seconds)
    await redis.set(`otp:${email}`, otp, 'EX', 300);

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Gmail,
        pass: process.env.Gmail_password,
      },
    });

    // Send the email
    const mailOptions = {
      from: process.env.Gmail,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`,
      html: `<p>Your OTP for login is: <b>${otp}</b></p><p>It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
