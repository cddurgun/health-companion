import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Verify ownership before deleting
    const symptom = await prisma.symptom.findUnique({
      where: { id },
    })

    if (!symptom || symptom.userId !== user.id) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 })
    }

    await prisma.symptom.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Symptom deleted successfully' })
  } catch (error) {
    console.error('Error deleting symptom:', error)
    return NextResponse.json(
      { error: 'Failed to delete symptom' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    const symptom = await prisma.symptom.findUnique({
      where: { id },
    })

    if (!symptom || symptom.userId !== user.id) {
      return NextResponse.json({ error: 'Symptom not found' }, { status: 404 })
    }

    const body = await req.json()

    const updated = await prisma.symptom.update({
      where: { id },
      data: {
        resolved: body.resolved ?? symptom.resolved,
        endDate: body.resolved ? new Date() : null,
        notes: body.notes ?? symptom.notes,
      },
    })

    return NextResponse.json({ symptom: updated })
  } catch (error) {
    console.error('Error updating symptom:', error)
    return NextResponse.json(
      { error: 'Failed to update symptom' },
      { status: 500 }
    )
  }
}
