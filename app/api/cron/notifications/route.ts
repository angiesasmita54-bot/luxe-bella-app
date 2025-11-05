import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAppointmentReminder, sendBirthdayMessage } from '@/lib/notifications'

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
    include: {
      appointment: {
        include: {
          user: true,
          service: true,
        },
      },
    },
  })

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

