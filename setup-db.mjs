import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Attempt to select from homepage_settings
    await prisma.$queryRaw`SELECT 1 FROM homepage_settings LIMIT 1`
    console.log("Table homepage_settings exists!")
  } catch (e) {
    console.error("Table homepage_settings doesn't exist or error:", e.message)
    console.log("Attempting to create it directly...")
    
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS public.homepage_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          settings JSONB NOT NULL,
          created_at TIMESTAMPTZ(6) DEFAULT now(),
          updated_at TIMESTAMPTZ(6) DEFAULT now()
        );
      `
      console.log("Table homepage_settings created successfully.")
    } catch (createErr) {
      console.error("Error creating table:", createErr.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()
