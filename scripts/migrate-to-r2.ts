import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const r2Bucket = process.env.R2_BUCKET!
const r2PublicUrl = process.env.R2_PUBLIC_URL || `${process.env.R2_ENDPOINT}/${r2Bucket}`

async function uploadToR2(localPath: string, contentType: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), 'public', localPath.replace(/^\//, ''))
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found locally, skipping: ${fullPath}`)
    return null
  }

  const buffer = fs.readFileSync(fullPath)
  const originalName = path.basename(fullPath)
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '')
  const key = `migrated/${uniqueSuffix}-${sanitizedName}`

  const command = new PutObjectCommand({
    Bucket: r2Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await s3Client.send(command)
  return `${r2PublicUrl.replace(/\/$/, '')}/${key}`
}

function getContentType(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'gif') return 'image/gif'
  if (ext === 'mp4') return 'video/mp4'
  if (ext === 'pdf') return 'application/pdf'
  return 'application/octet-stream'
}

async function migrateUrl(url: string | null): Promise<string | null> {
  if (!url || !url.startsWith('/uploads/')) return url
  console.log(`Migrating ${url}...`)
  const newUrl = await uploadToR2(url, getContentType(url))
  return newUrl || url
}

async function migrateUrlArray(urls: string[] | null): Promise<string[]> {
  if (!urls || !Array.isArray(urls)) return []
  const newUrls: string[] = []
  for (const url of urls) {
    if (url && url.startsWith('/uploads/')) {
      console.log(`Migrating ${url}...`)
      const newUrl = await uploadToR2(url, getContentType(url))
      newUrls.push(newUrl || url)
    } else {
      newUrls.push(url)
    }
  }
  return newUrls
}

async function main() {
  console.log('Starting Cloudflare R2 Migration...')

  // 1. Migrate Users in Supabase
  console.log('\n--- Migrating Auth Users ---')
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  if (usersError) console.error('Error fetching users:', usersError)
  else {
    for (const user of usersData.users) {
      const meta = user.user_metadata || {}
      let updated = false

      if (meta.avatar_url?.startsWith('/uploads/')) {
        meta.avatar_url = await migrateUrl(meta.avatar_url)
        updated = true
      }
      if (meta.video_url?.startsWith('/uploads/')) {
        meta.video_url = await migrateUrl(meta.video_url)
        updated = true
      }

      if (updated) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, { user_metadata: meta })
        console.log(`Updated user ${user.id}`)
      }
    }
  }

  // 2. Migrate Scholars in Prisma
  console.log('\n--- Migrating Scholars ---')
  const scholars = await prisma.scholars.findMany()
  for (const scholar of scholars) {
    let updated = false
    const updateData: any = {}

    if (scholar.video_url?.startsWith('/uploads/')) {
      updateData.video_url = await migrateUrl(scholar.video_url)
      updated = true
    }
    
    // Process gallery arrays
    const oldGalleryImages = scholar.gallery_images as string[] || []
    if (oldGalleryImages.some(u => u.startsWith('/uploads/'))) {
      updateData.gallery_images = await migrateUrlArray(oldGalleryImages)
      updated = true
    }
    
    const oldGalleryVideos = scholar.gallery_videos as string[] || []
    if (oldGalleryVideos.some(u => u.startsWith('/uploads/'))) {
      updateData.gallery_videos = await migrateUrlArray(oldGalleryVideos)
      updated = true
    }

    if (updated) {
      await prisma.scholars.update({ where: { id: scholar.id }, data: updateData })
      console.log(`Updated scholar ${scholar.id}`)
    }
  }

  // 3. Migrate Publications in Prisma
  console.log('\n--- Migrating Publications ---')
  const publications = await prisma.publications.findMany()
  for (const pub of publications) {
    let updated = false
    const updateData: any = {}

    if (pub.file_url?.startsWith('/uploads/')) {
      updateData.file_url = await migrateUrl(pub.file_url)
      updated = true
    }
    if (pub.cover_image?.startsWith('/uploads/')) {
      updateData.cover_image = await migrateUrl(pub.cover_image)
      updated = true
    }
    if (pub.banner_image?.startsWith('/uploads/')) {
      updateData.banner_image = await migrateUrl(pub.banner_image)
      updated = true
    }
    if (pub.video_url?.startsWith('/uploads/')) {
      updateData.video_url = await migrateUrl(pub.video_url)
      updated = true
    }

    const oldPubGalleryImages = pub.gallery_images as string[] || []
    if (oldPubGalleryImages.some(u => u.startsWith('/uploads/'))) {
      updateData.gallery_images = await migrateUrlArray(oldPubGalleryImages)
      updated = true
    }

    const oldPubGalleryVideos = pub.gallery_videos as string[] || []
    if (oldPubGalleryVideos.some(u => u.startsWith('/uploads/'))) {
      updateData.gallery_videos = await migrateUrlArray(oldPubGalleryVideos)
      updated = true
    }

    if (updated) {
      await prisma.publications.update({ where: { id: pub.id }, data: updateData })
      console.log(`Updated publication ${pub.id}`)
    }
  }

  // 4. Delete local files
  console.log('\n--- Deleting Local Uploads ---')
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (fs.existsSync(uploadsDir)) {
    try {
      fs.rmSync(uploadsDir, { recursive: true, force: true })
      console.log(`Deleted ${uploadsDir}`)
    } catch (e) {
      console.error(`Failed to delete local uploads folder:`, e)
    }
  }

  console.log('\nMigration Complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
