import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const foodLogSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  foodName: z.string().min(1),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  notes: z.string().optional(),
  consumedAt: z.string().datetime(),
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

    const foodLogs = await prisma.foodLog.findMany({
      where: { userId: user.id },
      orderBy: { consumedAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(foodLogs)
  } catch (error) {
    console.error('Error fetching food logs:', error)
    return NextResponse.json({ error: 'Failed to fetch food logs' }, { status: 500 })
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
    const validatedData = foodLogSchema.parse(body)

    const foodLog = await prisma.foodLog.create({
      data: {
        userId: user.id,
        mealType: validatedData.mealType,
        foodName: validatedData.foodName,
        calories: validatedData.calories,
        protein: validatedData.protein,
        carbs: validatedData.carbs,
        fat: validatedData.fat,
        notes: validatedData.notes,
        consumedAt: new Date(validatedData.consumedAt),
      },
    })

    return NextResponse.json(foodLog, { status: 201 })
  } catch (error: any) {
    console.error('Error creating food log:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create food log' }, { status: 500 })
  }
}
