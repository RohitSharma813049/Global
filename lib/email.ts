import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.Gmail,
    pass: process.env.Gmail_password,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Global Scholar Publications" <${process.env.Gmail}>`,
      to,
      subject,
      html,
    })
    console.log('Message sent: %s', info.messageId)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
