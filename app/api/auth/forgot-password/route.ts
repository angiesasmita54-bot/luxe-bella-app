import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetCode } from '@/lib/email'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

// Generate a 6-digit code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/auth/forgot-password - Request password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    // Don't reveal if email exists or not (security best practice)
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { message: 'If an account exists with this email, a reset code has been sent.' },
        { status: 200 }
      )
    }

    // Check if user has credentials account (not OAuth only)
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: 'credentials',
      },
    })

    if (!account) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a reset code has been sent.' },
        { status: 200 }
      )
    }

    // Generate 6-digit code
    const code = generateCode()

    // Store code in VerificationToken (expires in 15 minutes)
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    // Delete any existing reset codes for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `password-reset:${data.email}`,
      },
    })

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${data.email}`,
        token: code,
        expires,
      },
    })

    // Send email with code
    try {
      await sendPasswordResetCode(data.email, code)
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // In development, if email is not configured, return the code
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            message: 'Reset code generated (email not configured)',
            code: code, // Only in development
          },
          { status: 200 }
        )
      }
      throw new Error('Failed to send email')
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, a reset code has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}

