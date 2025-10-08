import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const moodEntrySchema = z.object({
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']),
  energy: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  anxiety: z.number().min(1).max(10).optional(),
  sleep: z.number().min(0).max(24).optional(),
  notes: z.string().optional(),
  loggedAt: z.string().datetime(),
})

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

    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(moodEntries)
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 })
  }
}

export async function POST(req: Request) {
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

    const body = await req.json()
    const validatedData = moodEntrySchema.parse(body)

    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: user.id,
        mood: validatedData.mood,
        energy: validatedData.energy,
        stress: validatedData.stress,
        anxiety: validatedData.anxiety,
        sleep: validatedData.sleep,
        notes: validatedData.notes,
        loggedAt: new Date(validatedData.loggedAt),
      },
    })

    return NextResponse.json(moodEntry, { status: 201 })
  } catch (error: any) {
    console.error('Error creating mood entry:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create mood entry' }, { status: 500 })
  }
}
