import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: {
      service: true,
      payment: true,
      review: true,
    },
    orderBy: {
      dateTime: 'desc',
    },
  })

  const upcoming = appointments.filter(
    (apt) => new Date(apt.dateTime) > new Date() && apt.status !== 'CANCELLED'
  )

  const past = appointments.filter(
    (apt) => new Date(apt.dateTime) <= new Date() || apt.status === 'CANCELLED'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upcoming</h2>
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{appointment.service.name}</h3>
                      <p className="text-gray-600 mt-1">
                        {format(new Date(appointment.dateTime), 'PPP p')}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Status: <span className="font-semibold">{appointment.status}</span>
                      </p>
                      {appointment.notes && (
                        <p className="text-gray-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/appointments/${appointment.id}`}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{appointment.service.name}</h3>
                      <p className="text-gray-600 mt-1">
                        {format(new Date(appointment.dateTime), 'PPP p')}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Status: <span className="font-semibold">{appointment.status}</span>
                      </p>
                      {!appointment.review && appointment.status === 'COMPLETED' && (
                        <Link
                          href={`/appointments/${appointment.id}/review`}
                          className="text-primary-600 hover:underline mt-2 inline-block"
                        >
                          Leave a Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No past appointments</p>
          )}
        </div>
      </div>
    </div>
  )
}

