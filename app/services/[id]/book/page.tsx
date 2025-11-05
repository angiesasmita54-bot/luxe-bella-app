import { prisma } from '@/lib/prisma'
import { BookingCalendar } from '@/components/BookingCalendar'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function BookServicePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const service = await prisma.service.findUnique({
    where: { id: params.id },
  })

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/services" className="text-primary-600 hover:underline mb-4 inline-block">
          ← Back to Services
        </Link>
        
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
          <p className="text-gray-600 mb-4">{service.description}</p>
          {service.benefits && (
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Benefits:</h3>
              <p>{service.benefits}</p>
            </div>
          )}
          <div className="mt-4 flex gap-4 text-lg">
            <span><strong>Duration:</strong> {service.duration} minutes</span>
            <span><strong>Price:</strong> ${service.price}</span>
          </div>
        </div>

        <BookingCalendar serviceId={service.id} />
      </div>
    </div>
  )
}

