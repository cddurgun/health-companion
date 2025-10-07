import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const medication = await prisma.medication.findUnique({
      where: { id: params.id },
    })

    if (!medication || medication.userId !== user.id) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    await prisma.medication.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Medication deleted successfully' })
  } catch (error) {
    console.error('Error deleting medication:', error)
    return NextResponse.json(
      { error: 'Failed to delete medication' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const medication = await prisma.medication.findUnique({
      where: { id: params.id },
    })

    if (!medication || medication.userId !== user.id) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 })
    }

    const body = await req.json()

    const updated = await prisma.medication.update({
      where: { id: params.id },
      data: {
        active: body.active ?? medication.active,
        endDate: body.active === false ? new Date() : null,
      },
    })

    return NextResponse.json({ medication: updated })
  } catch (error) {
    console.error('Error updating medication:', error)
    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    )
  }
}
