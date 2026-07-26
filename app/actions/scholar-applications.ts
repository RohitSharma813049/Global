'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { createNotification } from "./notifications"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)


export async function submitScholarApplication(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return { error: 'You must be logged in to apply.' }
  }

  try {
    let userId = session.user.id;
    
    // Check if the user ID from the session is a valid UUID
    // If it's a Google ID (numeric string), we need to fetch the real Supabase UUID using the user's email
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId) && session.user.email) {
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
      const realUser = users.find(u => u.email === session.user.email);
      
      if (realUser) {
        userId = realUser.id;
      } else {
        // Auto-create the user in Supabase if they logged in with Google but don't exist yet!
        const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: session.user.email,
          email_confirm: true,
          user_metadata: {
            name: session.user.name || "Google User",
            role: "user",
          }
        });
        
        if (createError || !newUserData?.user) {
          return { error: 'Could not create a linked database account. Please log out and try again.' }
        }
        userId = newUserData.user.id;
      }
    }

    const full_name = formData.get('full_name')
    const qualification = formData.get('qualification')
    const institution = formData.get('institution')
    const specialization = formData.get('specialization')
    const additional_link = formData.get('additional_link')

    // Handle file upload
    const documentFile = formData.get('document_file') as File | null;
    let document_link = null;

    if (documentFile && documentFile.size > 0) {
      // Create a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${documentFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const buffer = Buffer.from(await documentFile.arrayBuffer());

      // Ensure bucket exists
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      if (!buckets?.find(b => b.name === 'scholar_applications')) {
        await supabaseAdmin.storage.createBucket('scholar_applications', { public: true });
      }

      const { error: uploadError } = await supabaseAdmin.storage
        .from('scholar_applications')
        .upload(filename, buffer, {
          contentType: documentFile.type,
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload document");
      }
      
      // The public URL path
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('scholar_applications')
        .getPublicUrl(filename);
        
      document_link = publicUrl;
    }

    // Check if user already has an application
    const { data: existingApp } = await supabaseAdmin
      .from('scholar_applications')
      .select('id, documents')
      .eq('user_id', userId)
      .limit(1)
      .single()

    // If no new document was uploaded, keep the old one (if it exists)
    if (!document_link && existingApp?.documents?.document_link) {
      document_link = existingApp.documents.document_link;
    }

    const applicationData = {
      user_id: userId,
      full_name,
      qualification,
      institution,
      specialization,
      documents: { document_link, additional_link },
      status: 'pending',
      admin_notes: null // clear any previous rejection notes
    }

    let error;
    if (existingApp) {
      const { error: updateError } = await supabaseAdmin
        .from('scholar_applications')
        .update(applicationData)
        .eq('id', existingApp.id)
      error = updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from('scholar_applications')
        .insert(applicationData)
      error = insertError;
    }

    if (error) throw error

    revalidatePath('/dashboard/admin/scholar-applications')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error submitting application:', error)
    return { error: error.message || 'Failed to submit application' }
  }
}

export async function getMyApplicationStatus() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const { data, error } = await supabaseAdmin
    .from('scholar_applications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data
}

export async function updateApplicationStatus(id: string, status: string, admin_notes?: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized.' }
  }

  try {
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('scholar_applications')
      .update({ status, admin_notes })
      .eq('id', id)
      .select()
      .single()

    if (fetchError) throw fetchError

    // If approved, create the Scholar profile
    if (status === 'approved' && application) {
      // Check if scholar already exists
      const { data: existing } = await supabaseAdmin
        .from('scholars')
        .select('id')
        .eq('user_id', application.user_id)
        .single()

      if (!existing) {
        await supabaseAdmin
          .from('scholars')
          .insert({
            user_id: application.user_id,
            institution: application.institution,
            qualification: application.qualification,
            specialization: application.specialization,
            verified: true
          })
        
        // Update user role in profiles table
        await supabaseAdmin
          .from('profiles')
          .upsert({ id: application.user_id, role: 'scholar' })

        // Update user metadata in Supabase Auth to ensure NextAuth session gets the role
        await supabaseAdmin.auth.admin.updateUserById(application.user_id, {
          user_metadata: { role: 'scholar' }
        })
      }
      
      // Send an email to the user
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email, name')
        .eq('id', application.user_id)
        .single()
        
      if (userData?.email) {
        await sendEmail({
          to: userData.email,
          subject: 'Congratulations! Your Scholar Application is Approved',
          html: `
            <h2>Application Approved</h2>
            <p>Dear ${userData.name || application.full_name},</p>
            <p>We are thrilled to inform you that your scholar application has been verified and approved.</p>
            <p>You can now log in to the Scholar Portal and start publishing your research.</p>
            <p>Welcome to Global Scholar Publications!</p>
          `
        })
      }
    }
    
    // Create a notification for the user
    if (application) {
      if (status === 'approved') {
        await createNotification(
          application.user_id,
          'Application Approved!',
          'Congratulations! Your scholar application has been approved. You can now publish research.',
          'application_approved',
          '/dashboard'
        )
      } else if (status === 'rejected') {
        await createNotification(
          application.user_id,
          'Application Update',
          `Your scholar application was not approved. Reason: ${admin_notes || 'Not specified'}`,
          'application_rejected',
          '/dashboard'
        )
      }
    }

    revalidatePath('/dashboard/admin/scholar-applications')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating status:', error)
    return { error: error.message || 'Failed to update status' }
  }
}

export async function updateScholarApplication(applicationId: string, data: any) {
  const session = await getServerSession(authOptions)
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabaseAdmin
    .from('scholar_applications')
    .update(data)
    .eq('id', applicationId)

  if (error) {
    console.error('Error updating application:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/admin/scholar-applications')
  return { success: true }
}
