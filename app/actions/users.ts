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
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'Unknown',
    banned_until: u.banned_until,
    is_blocked: !!u.banned_until && new Date(u.banned_until) > new Date()
  }))
}

export async function getUsersPaginated(page: number = 1, perPage: number = 10, search: string = '') {
  await checkAdmin()
  
  if (search.trim()) {
    const { data: usersData, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })
    if (error) throw new Error(error.message)
    
    const query = search.trim().toLowerCase()
    const allFiltered = usersData.users.filter(u => {
      const name = u.user_metadata?.name || u.email?.split('@')[0] || ''
      const email = u.email || ''
      return name.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    })

    const total = allFiltered.length
    const totalPages = Math.ceil(total / perPage) || 1
    const startIndex = (page - 1) * perPage
    const paginatedUsers = allFiltered.slice(startIndex, startIndex + perPage)

    return {
      users: paginatedUsers.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        role: u.user_metadata?.role || 'user',
        name: u.user_metadata?.name || u.email?.split('@')[0] || 'Unknown',
        banned_until: u.banned_until,
        is_blocked: !!u.banned_until && new Date(u.banned_until) > new Date()
      })),
      total,
      totalPages,
      page
    }
  }

  const { data: usersData, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage
  })
  
  if (error) throw new Error(error.message)

  const users = usersData.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    role: u.user_metadata?.role || 'user',
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'Unknown',
    banned_until: u.banned_until,
    is_blocked: !!u.banned_until && new Date(u.banned_until) > new Date()
  }))

  const total = usersData.total ?? users.length
  const totalPages = Math.ceil(total / perPage) || 1

  return {
    users,
    total,
    totalPages,
    page
  }
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

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId)
  const existingMeta = userData?.user?.user_metadata || {}

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { ...existingMeta, role: newRole }
  })
  
  // Update the profiles table as well if it exists
  await supabaseAdmin.from('profiles').upsert({ id: userId, role: newRole })
  
  if (error) throw new Error(error.message)

  // Auto-provision scholar profile if needed
  if (newRole === 'scholar') {
    const { data: existingScholar } = await supabaseAdmin
      .from('scholars')
      .select('id')
      .eq('user_id', userId)
      .single()
      
    if (!existingScholar) {
      await supabaseAdmin.from('scholars').insert({
        user_id: userId,
        name: existingMeta.name || userData?.user?.email?.split('@')[0] || '',
        verified: true
      })
    }
  }

  revalidatePath('/dashboard/admin/users')
  return data
}

export async function createUserAccount(userDataParams: {
  email: string
  name: string
  password?: string
  role: string
}) {
  const session = await checkAdmin()
  const { email, name, password, role } = userDataParams

  if (session.user.role === 'admin') {
    if (role === 'admin' || role === 'super_admin') {
      throw new Error('Unauthorized. Admins cannot create admin or super_admin accounts.')
    }
  } else if (session.user.role !== 'super_admin') {
    throw new Error('Unauthorized.')
  }

  // Use provided password or generate a random secure one
  const finalPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "1!Aa"

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: finalPassword,
    email_confirm: true,
    user_metadata: { name, role }
  })

  if (error) throw new Error(error.message)
  if (!data.user) throw new Error('Failed to create user')

  const userId = data.user.id

  // Add to profiles
  await supabaseAdmin.from('profiles').upsert({
    id: userId,
    role: role
  })

  // If scholar, create scholars entry
  if (role === 'scholar') {
    const { data: existingScholar } = await supabaseAdmin
      .from('scholars')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!existingScholar) {
      await supabaseAdmin.from('scholars').insert({
        user_id: userId,
        name: name,
        verified: true
      })
    }
  }

  revalidatePath('/dashboard/admin/users')
  return data.user
}

export async function createAdminUser(email: string, name: string, password?: string) {
  return createUserAccount({ email, name, password, role: 'admin' })
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

  // Clean up references in the public schema that don't have ON DELETE CASCADE set
  await supabaseAdmin.from('scholar_applications').delete().eq('user_id', userId)
  await supabaseAdmin.from('scholars').delete().eq('user_id', userId)
  await supabaseAdmin.from('profiles').delete().eq('id', userId)

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) {
    throw new Error('Failed to delete user: ' + error.message)
  }
  
  revalidatePath('/dashboard/admin/users')
  return data
}

export async function updateUserDetails(userId: string, name: string, email: string) {
  await checkAdmin()
  
  // Fetch existing user metadata to preserve fields like role, avatar_url, etc.
  const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
  if (getUserError || !userData?.user) {
    throw new Error('User not found: ' + (getUserError?.message || ''))
  }

  const existingMeta = userData.user.user_metadata || {}

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    email: email,
    user_metadata: { ...existingMeta, name: name }
  })
  
  if (error) {
    throw new Error('Failed to update user: ' + error.message)
  }

  // Also sync scholar profile if it exists
  const { data: scholarRecord } = await supabaseAdmin.from('scholars').select('id').eq('user_id', userId).single()
  if (scholarRecord) {
    await supabaseAdmin.from('scholars').update({ name: name }).eq('user_id', userId)
  }
  
  revalidatePath('/dashboard/admin/users')
  return data
}
