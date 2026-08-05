'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

async function checkSuperAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'super_admin') {
    throw new Error("Unauthorized: Super Admin access required.")
  }
  return session
}
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as crypto from 'crypto'
import { generateDisplayId } from '@/lib/generate-id'

export async function submitHelpRequest(data: { name: string, email: string, subject: string, message: string }) {
  const { name, email, subject, message } = data

  if (!name || !email || !subject || !message) {
    throw new Error('All fields are required')
  }

  let generatedPassword = null

  // 1. Check if user exists
  const existingUser = await prisma.users.findFirst({ where: { email } })

  if (!existingUser) {
    // Auto-create user
    generatedPassword = crypto.randomBytes(8).toString('hex')
    const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: { name, role: 'reader' }
    })
    
    if (!error && authData.user) {
      try {
        await prisma.profiles.create({
          data: { 
            id: authData.user.id, 
            role: 'reader', 
            display_id: generateDisplayId('reader'),
            // Note: If profile has full_name, we add it, otherwise omit it based on schema
          }
        })
      } catch (err) {
        console.error('Failed to create profile for auto-signup:', err)
      }
    }
  }

  // 2. Save to DB
  await prisma.help_messages.create({
    data: { name, email, subject, message }
  })

  // 3. Send Email
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `Help Request: ${subject}`,
      text: `You have received a new help request from ${name} (${email}).\n\nMessage:\n${message}`,
    })

    if (generatedPassword) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome! Your new account details',
        text: `Hello ${name},\n\nWe received your help request. We have also automatically created an account for you!\n\nEmail: ${email}\nPassword: ${generatedPassword}\n\nYou can use these credentials to log in to our platform.\n\nBest,\nThe Team`,
      })
    }
  } catch (error) {
    console.error('Email sending failed, but message was saved to DB:', error)
  }

  return { success: true }
}

export async function getHelpMessages() {
  await checkSuperAdmin()
  const messages = await prisma.help_messages.findMany({
    orderBy: { created_at: 'desc' },
  })
  return messages
}

export async function updateMessageStatus(id: string, status: string) {
  await checkSuperAdmin()
  await prisma.help_messages.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/dashboard/super-admin/help-messages')
}
