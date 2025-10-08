import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the latest health score
    const latestScore = await prisma.healthScore.findFirst({
      where: { userId: user.id },
      orderBy: { calculatedAt: 'desc' },
    })

    return NextResponse.json({ latestScore })
  } catch (error) {
    console.error('Error fetching health score:', error)
    return NextResponse.json({ error: 'Failed to fetch health score' }, { status: 500 })
  }
}
