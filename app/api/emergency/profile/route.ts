import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        bloodType: true,
        conditions: true,
        allergies: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate unique emergency ID if not exists
    // Using user ID as the emergency ID for simplicity (could use a separate field)
    const emergencyId = user.id

    return NextResponse.json({
      profile: {
        bloodType: user.bloodType,
        conditions: user.conditions,
        allergies: user.allergies,
      },
      emergencyId,
    })
  } catch (error) {
    console.error('Error fetching emergency profile:', error)
    return NextResponse.json({ error: 'Failed to fetch emergency profile' }, { status: 500 })
  }
}
