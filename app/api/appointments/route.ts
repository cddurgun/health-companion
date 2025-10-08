import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateZoomLink, sendAppointmentEmail } from '@/lib/email'

const appointmentSchema = z.object({
  doctorName: z.string().optional(),
  date: z.string(),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().min(1, 'Reason is required'),
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

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
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
    const validatedData = appointmentSchema.parse(body)

    const appointmentDate = new Date(validatedData.date)
    const doctorName = validatedData.doctorName || 'Dr. Internist'

    // Generate Zoom meeting link
    const zoomMeeting = generateZoomLink(appointmentDate, validatedData.time)

    // Store Zoom info in notes field (or add dedicated fields to schema)
    const zoomInfo = `\nZoom Meeting ID: ${zoomMeeting.meetingId}\nPassword: ${zoomMeeting.password}\nJoin URL: ${zoomMeeting.joinUrl}`
    const notesWithZoom = validatedData.notes ? `${validatedData.notes}${zoomInfo}` : zoomInfo

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorName,
        date: appointmentDate,
        time: validatedData.time,
        reason: validatedData.reason,
        notes: notesWithZoom,
      },
    })

    // Send appointment confirmation email with Zoom link
    try {
      const emailResult = await sendAppointmentEmail({
        patientName: user.name || 'Patient',
        patientEmail: session.user.email,
        doctorName,
        appointmentDate,
        appointmentTime: validatedData.time,
        reason: validatedData.reason,
        zoomMeeting,
      })
      console.log('Email sent successfully:', emailResult)
    } catch (emailError) {
      console.error('Failed to send appointment email:', emailError)
      // Don't fail the appointment creation if email fails
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
