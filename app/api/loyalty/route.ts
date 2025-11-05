import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/loyalty - Get user's loyalty points
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!loyaltyPoints) {
      // Create if doesn't exist
      const newLoyaltyPoints = await prisma.loyaltyPoints.create({
        data: {
          userId: session.user.id,
        },
      })
      return NextResponse.json(newLoyaltyPoints)
    }

    return NextResponse.json(loyaltyPoints)
  } catch (error) {
    console.error('Error fetching loyalty points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty points' },
      { status: 500 }
    )
  }
}

