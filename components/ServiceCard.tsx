'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  description: string
  benefits?: string | null
  duration: number
  price: number
  image?: string | null
  category?: string | null
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200">
      {service.image && (
        <div className="relative h-48 w-full">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
          <span className="text-gray-900 font-bold text-lg">${service.price}</span>
        </div>
        <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
        {service.benefits && (
          <p className="text-sm text-gray-600 mb-3">{service.benefits}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{service.duration} minutes</span>
          <Link
            href={`/services/${service.id}/book`}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}

