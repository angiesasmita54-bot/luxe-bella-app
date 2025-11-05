import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export default async function StaffPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { staffProfile: true },
  })

  if (!user || !user.staffProfile) {
    redirect('/dashboard')
  }

  const today = new Date().toISOString().split('T')[0]
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/staff?date=${today}`, {
    headers: {
      Cookie: `next-auth.session-token=${session.user.id}`, // In production, use proper session
    },
  })

  const data = await response.json().catch(() => ({
    appointments: [],
    sales: { total: 0, count: 0 },
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Today's Appointments</h2>
            <p className="text-3xl font-bold text-primary-600">
              {data.appointments?.length || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Today's Sales</h2>
            <p className="text-3xl font-bold text-primary-600">
              ${data.sales?.total?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {data.sales?.count || 0} transactions
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
          {data.appointments && data.appointments.length > 0 ? (
            <div className="space-y-4">
              {data.appointments.map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="border-b pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{appointment.service.name}</h3>
                      <p className="text-gray-600">
                        {format(new Date(appointment.dateTime), 'h:mm a')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Client: {appointment.user.name || appointment.user.email}
                      </p>
                      {appointment.user.phone && (
                        <p className="text-sm text-gray-500">
                          Phone: {appointment.user.phone}
                        </p>
                      )}
                      {appointment.user.customerProfile?.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {appointment.user.customerProfile.notes}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  )
}

