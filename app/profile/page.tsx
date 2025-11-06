import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LogoutButton } from '@/components/LogoutButton'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: true,
      loyaltyPoints: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      },
      badges: {
        orderBy: { unlockedAt: 'desc' },
      },
      reviews: {
        include: {
          service: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary font-heading">My Profile</h1>
          <LogoutButton />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
            <h2 className="text-xl font-semibold mb-4 text-primary font-heading">Personal Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
              {user?.birthday && (
                <p><strong>Birthday:</strong> {new Date(user.birthday).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
            <h2 className="text-xl font-semibold mb-4 text-primary font-heading">Loyalty Points</h2>
            <div className="text-3xl font-bold text-primary mb-2">
              {user?.loyaltyPoints?.points || 0}
            </div>
            <p className="text-primary-700">Total Visits: {user?.loyaltyPoints?.visits || 0}</p>
            <p className="text-primary-700">Tier: {user?.customerProfile?.loyaltyTier || 'BRONZE'}</p>
          </div>

          {user?.customerProfile && (
            <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
              <h2 className="text-xl font-semibold mb-4 text-primary font-heading">Preferences</h2>
              <div className="space-y-2">
                {user.customerProfile.skinType && (
                  <p><strong>Skin Type:</strong> {user.customerProfile.skinType}</p>
                )}
                {user.customerProfile.allergies && (
                  <p><strong>Allergies:</strong> {user.customerProfile.allergies}</p>
                )}
                {user.customerProfile.preferences && (
                  <p><strong>Preferences:</strong> {user.customerProfile.preferences}</p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow border border-primary-200">
            <h2 className="text-xl font-semibold mb-4 text-primary font-heading">Badges</h2>
            {user?.badges && user.badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {badge.icon} {badge.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No badges yet</p>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow border border-primary-200">
          <h2 className="text-xl font-semibold mb-4 text-primary font-heading">Recent Reviews</h2>
          {user?.reviews && user.reviews.length > 0 ? (
            <div className="space-y-4">
              {user.reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{review.service.name}</h3>
                      <div className="flex items-center gap-1 my-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      {review.comment && <p className="text-gray-600">{review.comment}</p>}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

