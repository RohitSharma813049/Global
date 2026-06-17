'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function getAllUsers() {
  await checkAdmin()
  const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (error) throw new Error(error.message)
  return users.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    role: u.user_metadata?.role || 'user',
    name: u.user_metadata?.name || 'Unknown',
    banned_until: u.banned_until,
    is_blocked: !!u.banned_until && new Date(u.banned_until) > new Date()
  }))
}

export async function blockUser(userId: string, isBlocked: boolean) {
  await checkAdmin()
  const banDuration = isBlocked ? '87600h' : 'none' // 10 years or none
  
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: banDuration,
  })
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/users')
  return data
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await checkAdmin()
  
  if (session.user.role === 'admin') {
    if (newRole === 'admin' || newRole === 'super_admin') {
      throw new Error('Unauthorized. Admins cannot assign admin or super_admin roles.')
    }
  } else if (session.user.role !== 'super_admin') {
    throw new Error('Unauthorized.')
  }
  
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { role: newRole }
  })
  
  // Update the profiles table as well if it exists
  await supabaseAdmin.from('profiles').update({ role: newRole }).eq('id', userId)
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/users')
  return data
}

export async function createAdminUser(email: string, name: string) {
  const session = await checkAdmin()
  if (session.user.role !== 'super_admin') {
    throw new Error('Only Super Admins can create new administrators.')
  }

  // Generate a random secure password for the new admin (they will need to reset it via "forgot password")
  const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "1!Aa"

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { name, role: 'admin' }
  })

  if (error) throw new Error(error.message)

  // Add to profiles
  if (data.user) {
    await supabaseAdmin.from('profiles').insert({
      id: data.user.id,
      role: 'admin'
    })
  }

  revalidatePath('/dashboard/admin/users')
  return data.user
}

export async function deleteUser(userId: string, targetRole: string) {
  const session = await checkAdmin()
  
  if (session.user.role === 'admin') {
    if (targetRole === 'admin' || targetRole === 'super_admin') {
      throw new Error('Unauthorized. Admins cannot delete admins or super admins.')
    }
  } else if (session.user.role !== 'super_admin') {
    throw new Error('Unauthorized.')
  }

  if (session.user.id === userId) {
    throw new Error('You cannot delete your own account.')
  }

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)

  // Clean up profile as well just in case there's no cascade deletion
  await supabaseAdmin.from('profiles').delete().eq('id', userId)
  
  revalidatePath('/dashboard/admin/users')
  return data
}
