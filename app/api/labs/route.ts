import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const labResultSchema = z.object({
  testName: z.string().min(1),
  testDate: z.string().datetime(),
  result: z.string(),
  fileUrl: z.string().optional(),
  provider: z.string().optional(),
  notes: z.string().optional(),
  flagged: z.boolean().optional(),
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

    const labResults = await prisma.labResult.findMany({
      where: { userId: user.id },
      orderBy: { testDate: 'desc' },
    })

    return NextResponse.json(labResults)
  } catch (error) {
    console.error('Error fetching lab results:', error)
    return NextResponse.json({ error: 'Failed to fetch lab results' }, { status: 500 })
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
    const validatedData = labResultSchema.parse(body)

    const labResult = await prisma.labResult.create({
      data: {
        userId: user.id,
        testName: validatedData.testName,
        testDate: new Date(validatedData.testDate),
        result: validatedData.result,
        fileUrl: validatedData.fileUrl,
        provider: validatedData.provider,
        notes: validatedData.notes,
        flagged: validatedData.flagged || false,
      },
    })

    return NextResponse.json(labResult, { status: 201 })
  } catch (error: any) {
    console.error('Error creating lab result:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create lab result' }, { status: 500 })
  }
}
