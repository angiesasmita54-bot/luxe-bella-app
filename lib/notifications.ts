import { prisma } from './prisma'
import twilio from 'twilio'

let twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (!twilioClient) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured')
    }
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }
  return twilioClient
}

export async function sendSMS(to: string, message: string) {
  if (!process.env.TWILIO_PHONE_NUMBER || !process.env.TWILIO_ACCOUNT_SID) {
    console.warn('Twilio not configured, skipping SMS')
    return
  }

  try {
    const client = getTwilioClient()
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    })
  } catch (error) {
    console.error('Error sending SMS:', error)
  }
}

export async function sendWhatsApp(to: string, message: string) {
  if (!process.env.TWILIO_WHATSAPP_NUMBER || !process.env.TWILIO_ACCOUNT_SID) {
    console.warn('Twilio WhatsApp not configured, skipping WhatsApp')
    return
  }

  try {
    const client = getTwilioClient()
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    })
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
  }
}

export async function sendPushNotification(userId: string, title: string, message: string) {
  // Implementation depends on your push notification service (OneSignal, Firebase, etc.)
  // This is a placeholder
  await prisma.notification.create({
    data: {
      userId,
      type: 'PUSH',
      title,
      message,
    },
  })
}

export async function sendAppointmentReminder(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      user: true,
      service: true,
    },
  })

  if (!appointment) return

  const message = `Reminder: You have an appointment for ${appointment.service.name} on ${new Date(appointment.dateTime).toLocaleString()}`

  if (appointment.user.phone) {
    await sendSMS(appointment.user.phone, message)
    // Optionally send WhatsApp too
    // await sendWhatsApp(appointment.user.phone, message)
  }

  await sendPushNotification(
    appointment.userId,
    'Appointment Reminder',
    message
  )

  await prisma.notification.create({
    data: {
      userId: appointment.userId,
      type: 'SMS',
      title: 'Appointment Reminder',
      message,
    },
  })
}

export async function sendBirthdayMessage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { customerProfile: true },
  })

  if (!user || !user.birthday) return

  const message = `Happy birthday ${user.name}! 🎉 As a special gift, enjoy a 10% discount on your next treatment this month.`

  if (user.phone) {
    await sendSMS(user.phone, message)
  }

  await sendPushNotification(userId, 'Happy Birthday! 🎂', message)

  // Create a birthday coupon
  await prisma.coupon.create({
    data: {
      code: `BDAY${user.id.slice(0, 6).toUpperCase()}`,
      title: 'Birthday Special',
      description: '10% off your next treatment',
      discount: 10,
      discountType: 'PERCENTAGE',
      validFrom: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      users: { connect: { id: userId } },
    },
  })
}

