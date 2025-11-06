import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      const appointmentId = paymentIntent.metadata?.appointmentId

      if (appointmentId) {
        await prisma.payment.updateMany({
          where: {
            transactionId: paymentIntent.id,
          },
          data: {
            status: 'COMPLETED',
          },
        })

        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: 'CONFIRMED' },
        })
      }
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      await prisma.payment.updateMany({
        where: {
          transactionId: failedPayment.id,
        },
        data: {
          status: 'FAILED',
        },
      })
      break

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

