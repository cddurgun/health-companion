import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const symptomSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  severity: z.number().min(1).max(10),
  startDate: z.string(),
  notes: z.string().optional(),
})

export async function GET() {
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

    const symptoms = await prisma.symptom.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ symptoms })
  } catch (error) {
    console.error('Error fetching symptoms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symptoms' },
      { status: 500 }
    )
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
    const validatedData = symptomSchema.parse(body)

    const symptom = await prisma.symptom.create({
      data: {
        userId: user.id,
        location: validatedData.location,
        description: validatedData.description,
        severity: validatedData.severity,
        startDate: new Date(validatedData.startDate),
        notes: validatedData.notes,
      },
    })

    return NextResponse.json({ symptom }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating symptom:', error)
    return NextResponse.json(
      { error: 'Failed to create symptom' },
      { status: 500 }
    )
  }
}
