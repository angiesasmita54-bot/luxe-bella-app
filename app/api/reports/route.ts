import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/reports - Generate reports
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin/staff
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'billing'
    const period = searchParams.get('period') || 'monthly'

    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (period) {
      case 'daily':
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'weekly':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    let reportData: any

    switch (type) {
      case 'billing':
        const payments = await prisma.payment.findMany({
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: 'COMPLETED',
          },
        })

        reportData = {
          totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
          transactionCount: payments.length,
          byMethod: payments.reduce((acc, p) => {
            acc[p.method] = (acc[p.method] || 0) + p.amount
            return acc
          }, {} as Record<string, number>),
        }
        break

      case 'missed_appointments':
        const missed = await prisma.appointment.findMany({
          where: {
            dateTime: { gte: startDate, lte: endDate },
            status: 'NO_SHOW',
          },
          include: {
            service: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        })

        reportData = {
          count: missed.length,
          appointments: missed,
        }
        break

      case 'best_selling_services':
        const serviceStats = await prisma.appointment.groupBy({
          by: ['serviceId'],
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: 'COMPLETED',
          },
          _count: {
            id: true,
          },
        })

        const services = await prisma.service.findMany({
          where: {
            id: { in: serviceStats.map((s) => s.serviceId) },
          },
        })

        reportData = serviceStats
          .map((stat) => {
            const service = services.find((s) => s.id === stat.serviceId)
            return {
              service: service?.name || 'Unknown',
              count: stat._count.id,
              revenue: 0, // Calculate from payments if needed
            }
          })
          .sort((a, b) => b.count - a.count)
        break

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Save report
    await prisma.report.create({
      data: {
        type,
        period,
        data: reportData,
      },
    })

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

