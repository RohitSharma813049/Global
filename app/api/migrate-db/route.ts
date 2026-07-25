import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE publications ADD COLUMN IF NOT EXISTS serial_number text UNIQUE;`);
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
