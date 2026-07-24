'use server'

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"

const requireSuperAdmin = async () => {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'super_admin') {
    throw new Error("Unauthorized: Super Admin access required.")
  }
  return session
}

export async function getPlatformSettings() {
  await requireSuperAdmin()
  const settings = await prisma.platform_settings.findMany({
    orderBy: { key: 'asc' }
  })
  
  // Transform to key-value record for easy UI consumption
  const config: Record<string, any> = {}
  settings.forEach(s => { config[s.key] = s.value })
  
  return {
    raw: settings,
    config
  }
}

export async function updatePlatformSetting(key: string, value: any, description?: string) {
  const session = await requireSuperAdmin()
  
  await prisma.platform_settings.upsert({
    where: { key },
    update: { 
      value, 
      updated_by: session.user.id,
      ...(description ? { description } : {}) 
    },
    create: { 
      key, 
      value, 
      description: description || "Platform setting",
      updated_by: session.user.id 
    }
  })
  
  // Create an audit log
  await logAdminAction(session.user.id, `Updated setting: ${key}`, "platform_settings", key, { newValue: value })
  
  revalidatePath("/dashboard/super-admin")
  return { success: true }
}

export async function getAuditLogs(limit = 50) {
  await requireSuperAdmin()
  return await prisma.audit_logs.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      users: { select: { raw_user_meta_data: true, email: true } }
    }
  })
}

export async function getSuperAdminStats() {
  await requireSuperAdmin()
  
  const [totalUsers, totalScholars, totalPublications, totalLogs] = await Promise.all([
    prisma.users.count(),
    prisma.scholars.count(),
    prisma.publications.count(),
    prisma.audit_logs.count()
  ])
  
  return {
    totalUsers,
    totalScholars,
    totalPublications,
    totalLogs
  }
}

export async function logAdminAction(userId: string, action: string, entity?: string, entity_id?: string, details?: any) {
  try {
    await prisma.audit_logs.create({
      data: {
        user_id: userId,
        action,
        entity,
        entity_id,
        details
      }
    })
  } catch (err) {
    console.error("Failed to write audit log:", err)
  }
}
