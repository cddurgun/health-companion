import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const painLogSchema = z.object({
  bodyPart: z.string().min(1),
  intensity: z.number().min(1).max(10),
  quality: z.string().optional(),
  triggers: z.string().optional(),
  relievedBy: z.string().optional(),
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

    const painLogs = await prisma.painLog.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(painLogs)
  } catch (error) {
    console.error('Error fetching pain logs:', error)
    return NextResponse.json({ error: 'Failed to fetch pain logs' }, { status: 500 })
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
    const validatedData = painLogSchema.parse(body)

    const painLog = await prisma.painLog.create({
      data: {
        userId: user.id,
        bodyPart: validatedData.bodyPart,
        intensity: validatedData.intensity,
        quality: validatedData.quality,
        triggers: validatedData.triggers,
        relievedBy: validatedData.relievedBy,
        notes: validatedData.notes,
        loggedAt: new Date(validatedData.loggedAt),
      },
    })

    return NextResponse.json(painLog, { status: 201 })
  } catch (error: any) {
    console.error('Error creating pain log:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create pain log' }, { status: 500 })
  }
}
