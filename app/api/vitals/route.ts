import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const vitalSignSchema = z.object({
  type: z.enum(['blood_pressure', 'heart_rate', 'spo2', 'temperature', 'glucose', 'weight']),
  systolic: z.number().optional(),
  diastolic: z.number().optional(),
  value: z.number().optional(),
  measuredAt: z.string().datetime(),
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

    const vitals = await prisma.vitalSign.findMany({
      where: { userId: user.id },
      orderBy: { measuredAt: 'desc' },
    })

    return NextResponse.json(vitals)
  } catch (error) {
    console.error('Error fetching vital signs:', error)
    return NextResponse.json({ error: 'Failed to fetch vital signs' }, { status: 500 })
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

    const validatedData = vitalSignSchema.parse(body)

    // Determine unit based on type
    let unit = ''
    switch (validatedData.type) {
      case 'blood_pressure':
        unit = 'mmHg'
        break
      case 'heart_rate':
        unit = 'bpm'
        break
      case 'spo2':
        unit = '%'
        break
      case 'temperature':
        unit = '°F'
        break
      case 'glucose':
        unit = 'mg/dL'
        break
      case 'weight':
        unit = 'kg'
        break
    }

    const vitalSign = await prisma.vitalSign.create({
      data: {
        userId: user.id,
        type: validatedData.type,
        systolic: validatedData.systolic,
        diastolic: validatedData.diastolic,
        value: validatedData.value,
        unit,
        measuredAt: new Date(validatedData.measuredAt),
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(vitalSign, { status: 201 })
  } catch (error: any) {
    console.error('Error creating vital sign:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create vital sign' }, { status: 500 })
  }
}
