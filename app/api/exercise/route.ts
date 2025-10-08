import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const exerciseLogSchema = z.object({
  exerciseType: z.enum(['cardio', 'strength', 'flexibility', 'sports']),
  activity: z.string().min(1),
  duration: z.number().min(1),
  intensity: z.enum(['light', 'moderate', 'vigorous']),
  calories: z.number().optional(),
  distance: z.number().optional(),
  notes: z.string().optional(),
  performedAt: z.string().datetime(),
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

    const exerciseLogs = await prisma.exerciseLog.findMany({
      where: { userId: user.id },
      orderBy: { performedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(exerciseLogs)
  } catch (error) {
    console.error('Error fetching exercise logs:', error)
    return NextResponse.json({ error: 'Failed to fetch exercise logs' }, { status: 500 })
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
    const validatedData = exerciseLogSchema.parse(body)

    const exerciseLog = await prisma.exerciseLog.create({
      data: {
        userId: user.id,
        exerciseType: validatedData.exerciseType,
        activity: validatedData.activity,
        duration: validatedData.duration,
        intensity: validatedData.intensity,
        calories: validatedData.calories,
        distance: validatedData.distance,
        notes: validatedData.notes,
        performedAt: new Date(validatedData.performedAt),
      },
    })

    return NextResponse.json(exerciseLog, { status: 201 })
  } catch (error: any) {
    console.error('Error creating exercise log:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create exercise log' }, { status: 500 })
  }
}
