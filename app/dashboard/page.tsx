import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      appointments: {
        take: 5,
        orderBy: { dateTime: 'desc' },
        include: { service: true },
      },
      loyaltyPoints: true,
      customerProfile: true,
    },
  })

  const upcomingAppointments = user?.appointments.filter(
    (apt) => new Date(apt.dateTime) > new Date() && apt.status !== 'CANCELLED'
  ) || []

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="bg-primary-50 border-b border-primary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-primary-700 font-heading">Welcome to</h1>
              <h2 className="text-3xl font-bold text-primary font-heading">Luxe Bella</h2>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/services" className="text-primary hover:text-primary-600 font-medium transition-colors">
                Services
              </Link>
              <Link href="/appointments" className="text-primary hover:text-primary-600 font-medium transition-colors">
                Appointments
              </Link>
              <Link href="/profile" className="text-primary hover:text-primary-600 font-medium transition-colors">
                Profile
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-2 text-primary font-heading">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-primary-700 mb-8">Here's what's happening with your beauty journey</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Loyalty Points</h3>
            </div>
            <p className="text-4xl font-bold text-primary">
              {user?.loyaltyPoints?.points || 0}
            </p>
            <p className="text-sm text-primary-600 mt-2">
              {user?.loyaltyPoints?.visits || 0} visits
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Upcoming</h3>
            </div>
            <p className="text-4xl font-bold text-primary">
              {upcomingAppointments.length}
            </p>
            <p className="text-sm text-primary-600 mt-2">Appointments scheduled</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-primary font-heading">Loyalty Tier</h3>
            </div>
            <p className="text-2xl font-bold text-primary">
              {user?.customerProfile?.loyaltyTier || 'BRONZE'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-primary-200">
          <h3 className="text-2xl font-bold mb-6 text-primary font-heading">
            Upcoming Appointments
          </h3>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border-2 border-primary-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all bg-primary-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-primary mb-1">{appointment.service.name}</h4>
                      <p className="text-primary-700 mb-2">
                        {new Date(appointment.dateTime).toLocaleString()}
                      </p>
                      <span className="inline-block px-3 py-1 bg-primary-200 text-primary rounded-full text-sm font-medium">
                        {appointment.status}
                      </span>
                    </div>
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-primary-700 text-lg">No upcoming appointments</p>
              <Link href="/services" className="text-primary hover:text-primary-600 font-semibold mt-2 inline-block">
                Book an appointment →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

