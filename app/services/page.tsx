import { prisma } from '@/lib/prisma'
import { ServiceCard } from '@/components/ServiceCard'

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F5F5DC] border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to</h1>
          <h2 className="text-4xl font-bold text-gray-900">Luxe Bella</h2>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Our Services</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

