import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, 'Code must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

// POST /api/auth/reset-password - Reset password with code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = resetPasswordSchema.parse(body)

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `password-reset:${data.email}`,
          token: data.code,
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      )
    }

    // Check if code is expired
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: `password-reset:${data.email}`,
            token: data.code,
          },
        },
      })
      return NextResponse.json(
        { error: 'Reset code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Find credentials account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: 'credentials',
      },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Password reset not available for this account type' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    // Update password in account
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: hashedPassword, // Store hashed password in access_token field
      },
    })

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `password-reset:${data.email}`,
          token: data.code,
        },
      },
    })

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

