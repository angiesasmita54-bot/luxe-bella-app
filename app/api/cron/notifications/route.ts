import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentReminder, sendBirthdayMessage } from '@/lib/notifications'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

// This should be called by a cron job (Azure Functions or similar)
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  
  // Process appointment reminders
  const reminders = await prisma.notificationSchedule.findMany({
    where: {
      sent: false,
      scheduledFor: {
        lte: now,
      },
    },
  })
  
  // Get appointments for reminders
  const appointmentIds = reminders.map(r => r.appointmentId)
  
  const appointments = await prisma.appointment.findMany({
    where: {
      id: {
        in: appointmentIds,
      },
    },
    include: {
      user: true,
      service: true,
    },
  })
  
  const appointmentsMap = new Map(appointments.map(a => [a.id, a]))

  for (const reminder of reminders) {
    if (reminder.type.startsWith('REMINDER')) {
      await sendAppointmentReminder(reminder.appointmentId)
    }
    
    await prisma.notificationSchedule.update({
      where: { id: reminder.id },
      data: { sent: true, sentAt: now },
    })
  }

  // Process birthday messages
  const today = new Date()
  const usersWithBirthdays = await prisma.user.findMany({
    where: {
      birthday: {
        not: null,
      },
    },
  })

  for (const user of usersWithBirthdays) {
    if (user.birthday) {
      const birthday = new Date(user.birthday)
      if (
        birthday.getMonth() === today.getMonth() &&
        birthday.getDate() === today.getDate()
      ) {
        await sendBirthdayMessage(user.id)
      }
    }
  }

  return NextResponse.json({ processed: reminders.length })
}

