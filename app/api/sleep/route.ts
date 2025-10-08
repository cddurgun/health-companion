import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sleepLogSchema = z.object({
  bedTime: z.string().datetime(),
  wakeTime: z.string().datetime(),
  totalHours: z.number(),
  quality: z.number().min(1).max(10),
  deepSleep: z.number().optional(),
  remSleep: z.number().optional(),
  awakenings: z.number().optional(),
  notes: z.string().optional(),
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

    const sleepLogs = await prisma.sleepLog.findMany({
      where: { userId: user.id },
      orderBy: { wakeTime: 'desc' },
      take: 30,
    })

    return NextResponse.json(sleepLogs)
  } catch (error) {
    console.error('Error fetching sleep logs:', error)
    return NextResponse.json({ error: 'Failed to fetch sleep logs' }, { status: 500 })
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
    const validatedData = sleepLogSchema.parse(body)

    const sleepLog = await prisma.sleepLog.create({
      data: {
        userId: user.id,
        bedTime: new Date(validatedData.bedTime),
        wakeTime: new Date(validatedData.wakeTime),
        totalHours: validatedData.totalHours,
        quality: validatedData.quality,
        deepSleep: validatedData.deepSleep,
        remSleep: validatedData.remSleep,
        awakenings: validatedData.awakenings,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(sleepLog, { status: 201 })
  } catch (error: any) {
    console.error('Error creating sleep log:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create sleep log' }, { status: 500 })
  }
}
