import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample services
  const facial = await prisma.service.create({
    data: {
      name: 'Hydrating Facial',
      description: 'Deep hydrating facial treatment for glowing skin',
      benefits: 'Removes dead skin cells, hydrates deeply, improves skin texture',
      duration: 60,
      price: 120,
      category: 'Facial',
      active: true,
    },
  })

  const massage = await prisma.service.create({
    data: {
      name: 'Swedish Massage',
      description: 'Relaxing full-body massage',
      benefits: 'Reduces stress, improves circulation, relieves muscle tension',
      duration: 90,
      price: 150,
      category: 'Massage',
      active: true,
    },
  })

  const waxing = await prisma.service.create({
    data: {
      name: 'Full Body Wax',
      description: 'Complete body hair removal',
      benefits: 'Smooth skin for weeks, reduced hair growth over time',
      duration: 120,
      price: 200,
      category: 'Waxing',
      active: true,
    },
  })

  console.log('Seeded services:', { facial, massage, waxing })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

