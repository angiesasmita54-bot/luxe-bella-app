import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/staff - Get staff dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { staffProfile: true },
    })

    if (!user || !user.staffProfile) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    // Get today's appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customerProfile: true,
          },
        },
        payment: true,
      },
      orderBy: {
        dateTime: 'asc',
      },
    })

    // Get today's sales
    const sales = await prisma.payment.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    })

    return NextResponse.json({
      appointments,
      sales: {
        total: sales._sum.amount || 0,
        count: sales._count.id || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching staff data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch staff data' },
      { status: 500 }
    )
  }
}

