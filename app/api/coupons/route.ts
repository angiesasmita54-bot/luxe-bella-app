import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/coupons - Get available coupons
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
      // Validate coupon code
      const coupon = await prisma.coupon.findUnique({
        where: { code },
        include: {
          users: session?.user ? { where: { id: session.user.id } } : false,
        },
      })

      if (!coupon) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }

      const now = new Date()
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
      }

      if (!coupon.active) {
        return NextResponse.json({ error: 'Coupon inactive' }, { status: 400 })
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ error: 'Coupon limit reached' }, { status: 400 })
      }

      return NextResponse.json(coupon)
    }

    // Get user's coupons
    if (session?.user) {
      const userCoupons = await prisma.coupon.findMany({
        where: {
          active: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      })

      return NextResponse.json(userCoupons)
    }

    // Get all active coupons (for public view)
    const coupons = await prisma.coupon.findMany({
      where: {
        active: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

