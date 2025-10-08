import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const emergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  isPrimary: z.boolean().optional(),
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

    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: user.id },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ contacts })
  } catch (error) {
    console.error('Error fetching emergency contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch emergency contacts' }, { status: 500 })
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
    const validatedData = emergencyContactSchema.parse(body)

    // If setting as primary, unset other primary contacts
    if (validatedData.isPrimary) {
      await prisma.emergencyContact.updateMany({
        where: { userId: user.id, isPrimary: true },
        data: { isPrimary: false },
      })
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        userId: user.id,
        name: validatedData.name,
        relationship: validatedData.relationship,
        phone: validatedData.phone,
        email: validatedData.email || null,
        isPrimary: validatedData.isPrimary || false,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error: any) {
    console.error('Error creating emergency contact:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create emergency contact' }, { status: 500 })
  }
}
