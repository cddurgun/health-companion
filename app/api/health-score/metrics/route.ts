import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const now = new Date()

    // Get counts for various metrics
    const [
      vitalsCount,
      symptomsActive,
      medicationsActive,
      appointmentsUpcoming,
      foodLogsWeek,
      exerciseLogsWeek,
      sleepLogsWeek,
      moodEntriesWeek,
    ] = await Promise.all([
      prisma.vitalSign.count({ where: { userId: user.id } }),
      prisma.symptom.count({ where: { userId: user.id, resolved: false } }),
      prisma.medication.count({ where: { userId: user.id, active: true } }),
      prisma.appointment.count({
        where: { userId: user.id, status: 'scheduled', date: { gte: now } },
      }),
      prisma.foodLog.count({ where: { userId: user.id, createdAt: { gte: sevenDaysAgo } } }),
      prisma.exerciseLog.count({ where: { userId: user.id, createdAt: { gte: sevenDaysAgo } } }),
      prisma.sleepLog.count({ where: { userId: user.id, createdAt: { gte: sevenDaysAgo } } }),
      prisma.moodEntry.count({ where: { userId: user.id, createdAt: { gte: sevenDaysAgo } } }),
    ])

    return NextResponse.json({
      vitalsCount,
      symptomsActive,
      medicationsActive,
      appointmentsUpcoming,
      foodLogsWeek,
      exerciseLogsWeek,
      sleepLogsWeek,
      moodEntriesWeek,
    })
  } catch (error) {
    console.error('Error fetching health metrics:', error)
    return NextResponse.json({ error: 'Failed to fetch health metrics' }, { status: 500 })
  }
}
