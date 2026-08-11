'use server'

import { createClient } from "@supabase/supabase-js"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    throw new Error('Unauthorized')
  }
}

// --- Categories ---

export async function getCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')
  if (error) {
    if (error.code === '42P01') return []; // Table doesn't exist
    throw new Error(error.message)
  }
  return data
}

export async function createCategory(name: string, slug: string, parent_id?: string, content_types?: string[], image_url?: string) {
  await checkAdmin()
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug, parent_id: parent_id || null, content_types: content_types || [], image_url: image_url || null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/categories')
  revalidatePath('/explore')
  return data
}

export async function updateCategory(id: string, name: string, slug: string, parent_id?: string, content_types?: string[], image_url?: string) {
  await checkAdmin()
  const { error } = await supabaseAdmin
    .from('categories')
    .update({ name, slug, parent_id: parent_id || null, content_types: content_types || [], image_url: image_url || null })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/categories')
  revalidatePath('/explore')
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !['admin', 'super_admin'].includes(session.user?.role as string)) {
    return { error: 'Unauthorized.' }
  }

  try {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/categories')
    revalidatePath('/explore')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function createCustomCategory(name: string, parent_id?: string) {
  const session = await getServerSession(authOptions)
  
  // Allow scholars to create custom categories too
  if (!session) {
    return { error: 'Unauthorized.' }
  }

  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    // Check if it already exists
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()
      
    if (existing) {
      return { category: existing }
    }

    const insertData: any = { name, slug }
    if (parent_id) {
      insertData.parent_id = parent_id
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/admin/categories')
    revalidatePath('/explore')
    return { category: data }
  } catch (error: any) {
    return { error: error.message }
  }
}

// --- Content Types ---

export async function getContentTypes() {
  const { data, error } = await supabaseAdmin
    .from('content_types')
    .select('*')
    .order('name')
  if (error) {
    if (error.code === '42P01') return []; // Table doesn't exist
    throw new Error(error.message)
  }
  return data
}

export async function createContentType(name: string, slug: string, icon_name: string, image_url?: string) {
  await checkAdmin()
  const { data, error } = await supabaseAdmin
    .from('content_types')
    .insert({ name, slug, icon_name, image_url: image_url || null })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/content-types')
  revalidatePath('/explore')
  return data
}

export async function updateContentType(id: string, name: string, slug: string, icon_name: string, image_url?: string) {
  await checkAdmin()
  const { error } = await supabaseAdmin
    .from('content_types')
    .update({ name, slug, icon_name, image_url: image_url || null })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/content-types')
  revalidatePath('/explore')
}

export async function deleteContentType(id: string) {
  await checkAdmin()
  const { error } = await supabaseAdmin
    .from('content_types')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/admin/content-types')
  revalidatePath('/explore')
}

