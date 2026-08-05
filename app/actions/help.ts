'use server'

import { checkSuperAdmin } from './auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'

export async function submitHelpRequest(data: { name: string, email: string, subject: string, message: string }) {
  const { name, email, subject, message } = data

  if (!name || !email || !subject || !message) {
    throw new Error('All fields are required')
  }

  // 1. Save to DB
  await prisma.help_messages.create({
    data: { name, email, subject, message }
  })

  // 2. Send Email
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
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Admin address
      subject: `Help Request: ${subject}`,
      text: `You have received a new help request from ${name} (${email}).\n\nMessage:\n${message}`,
    })
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
