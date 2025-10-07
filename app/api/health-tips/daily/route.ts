import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get a random health tip
    const count = await prisma.healthTip.count()
    const randomIndex = Math.floor(Math.random() * count)

    const tip = await prisma.healthTip.findFirst({
      skip: randomIndex,
    })

    return NextResponse.json({ tip })
  } catch (error) {
    console.error('Error fetching health tip:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health tip' },
      { status: 500 }
    )
  }
}
