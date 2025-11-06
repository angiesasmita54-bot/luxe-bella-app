import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/appointments/[id] - Get appointment details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        service: true,
        payment: true,
        review: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    // Check if user owns this appointment or is staff/admin
    if (appointment.userId !== session.user.id) {
      // In production, check if user is staff/admin
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

// PATCH /api/appointments/[id] - Update appointment (cancel/reschedule)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, dateTime } = body

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    if (appointment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (dateTime) {
      updateData.dateTime = new Date(dateTime)
      // Reschedule notifications
      await prisma.notificationSchedule.deleteMany({
        where: { appointmentId: params.id },
      })

      const newDate = new Date(dateTime)
      const reminders = [
        {
          appointmentId: params.id,
          scheduledFor: new Date(newDate.getTime() - 48 * 60 * 60 * 1000),
          type: 'REMINDER_48H',
        },
        {
          appointmentId: params.id,
          scheduledFor: new Date(newDate.getTime() - 24 * 60 * 60 * 1000),
          type: 'REMINDER_24H',
        },
        {
          appointmentId: params.id,
          scheduledFor: new Date(newDate.getTime() - 60 * 60 * 1000),
          type: 'REMINDER_1H',
        },
      ]

      await prisma.notificationSchedule.createMany({
        data: reminders,
      })
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        service: true,
      },
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

