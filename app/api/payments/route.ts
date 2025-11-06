import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'
import { z } from 'zod'

const paymentSchema = z.object({
  appointmentId: z.string().optional(),
  amount: z.number().positive(),
  depositAmount: z.number().positive().optional(),
  method: z.enum(['CARD', 'ZELLE', 'APPLE_PAY', 'GOOGLE_PAY', 'CASH', 'DEPOSIT']),
  paymentIntentId: z.string().optional(), // For Stripe
})

// POST /api/payments - Create payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = paymentSchema.parse(body)

    let paymentIntentId = data.paymentIntentId

    // If card payment, create Stripe payment intent
    if (data.method === 'CARD' && !paymentIntentId) {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
      }
      const stripe = getStripe()
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: session.user.id,
          appointmentId: data.appointmentId || '',
        },
      })
      paymentIntentId = paymentIntent.id
      
      // Return client secret for frontend confirmation
      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        appointmentId: data.appointmentId,
        amount: data.amount,
        depositAmount: data.depositAmount,
        method: data.method,
        status: data.method === 'CASH' ? 'COMPLETED' : 'PENDING',
        transactionId: paymentIntentId,
      },
    })

    // If deposit, update appointment status
    if (data.appointmentId && data.depositAmount) {
      await prisma.appointment.update({
        where: { id: data.appointmentId },
        data: { status: 'CONFIRMED' },
      })
    }

    // Add loyalty points
    if (data.method !== 'DEPOSIT') {
      await prisma.loyaltyPoints.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          points: Math.floor(data.amount / 10), // 1 point per $10
          totalEarned: Math.floor(data.amount / 10),
        },
        update: {
          points: { increment: Math.floor(data.amount / 10) },
          totalEarned: { increment: Math.floor(data.amount / 10) },
        },
      })

      // Record transaction
      const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
        where: { userId: session.user.id },
      })

      if (loyaltyPoints) {
        await prisma.loyaltyTransaction.create({
          data: {
            loyaltyPointsId: loyaltyPoints.id,
            points: Math.floor(data.amount / 10),
            type: 'EARNED',
            description: `Payment for ${data.appointmentId ? 'appointment' : 'service'}`,
            appointmentId: data.appointmentId,
          },
        })
      }
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

