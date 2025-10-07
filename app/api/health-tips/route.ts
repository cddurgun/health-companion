import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tips = await prisma.healthTip.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ tips })
  } catch (error) {
    console.error('Error fetching health tips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health tips' },
      { status: 500 }
    )
  }
}
