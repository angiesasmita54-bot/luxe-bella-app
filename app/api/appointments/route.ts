import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const appointmentSchema = z.object({
  serviceId: z.string(),
  dateTime: z.string().datetime(),
  notes: z.string().optional(),
})

// GET /api/appointments - Get user's appointments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.dateTime = {}
      if (startDate) where.dateTime.gte = new Date(startDate)
      if (endDate) where.dateTime.lte = new Date(endDate)
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        payment: true,
        review: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = appointmentSchema.parse(body)

    // Check if slot is available
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        dateTime: new Date(data.dateTime),
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        serviceId: data.serviceId,
        dateTime: new Date(data.dateTime),
        notes: data.notes,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    })

    // Schedule notification reminders
    const appointmentDate = new Date(data.dateTime)
    const reminders = [
      {
        appointmentId: appointment.id,
        scheduledFor: new Date(appointmentDate.getTime() - 48 * 60 * 60 * 1000),
        type: 'REMINDER_48H',
      },
      {
        appointmentId: appointment.id,
        scheduledFor: new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000),
        type: 'REMINDER_24H',
      },
      {
        appointmentId: appointment.id,
        scheduledFor: new Date(appointmentDate.getTime() - 60 * 60 * 1000),
        type: 'REMINDER_1H',
      },
    ]

    await prisma.notificationSchedule.createMany({
      data: reminders,
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

