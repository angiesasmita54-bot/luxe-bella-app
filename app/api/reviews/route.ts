import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  serviceId: z.string(),
  appointmentId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
})

// GET /api/reviews - Get reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (serviceId) where.serviceId = serviceId
    if (userId) where.userId = userId

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = reviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        serviceId: data.serviceId,
        appointmentId: data.appointmentId,
        rating: data.rating,
        comment: data.comment,
        images: data.images || [],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Award badge for leaving reviews
    const reviewCount = await prisma.review.count({
      where: { userId: session.user.id },
    })

    if (reviewCount === 1) {
      await prisma.badge.create({
        data: {
          userId: session.user.id,
          name: 'First Review',
          description: 'Left your first review',
          icon: '⭐',
        },
      })
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

