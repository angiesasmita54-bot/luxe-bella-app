import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  }
  return stripeInstance
}

// Export for backward compatibility - will throw at runtime if not configured
export const stripe = (() => {
  // Only initialize if key is present (for build-time compatibility)
  if (process.env.STRIPE_SECRET_KEY) {
    return getStripe()
  }
  // Return a proxy that will throw when accessed
  return new Proxy({} as Stripe, {
    get() {
      throw new Error('STRIPE_SECRET_KEY is not set')
    },
  })
})()

