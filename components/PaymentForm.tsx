'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PaymentFormProps {
  amount: number
  appointmentId?: string
  onSuccess?: () => void
}

function PaymentFormContent({ amount, appointmentId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'zelle' | 'cash' | 'deposit'>('card')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (paymentMethod === 'cash') {
      // Handle cash payment
      try {
        await axios.post('/api/payments', {
          amount,
          appointmentId,
          method: 'CASH',
        })
        toast.success('Payment recorded successfully!')
        onSuccess?.()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Payment failed')
      }
      return
    }

    if (paymentMethod === 'zelle') {
      // Handle Zelle payment - in production, integrate with Zelle API
      toast('Zelle payment instructions will be sent to your email', { icon: 'ℹ️' })
      try {
        await axios.post('/api/payments', {
          amount,
          appointmentId,
          method: 'ZELLE',
        })
        toast.success('Payment initiated!')
        onSuccess?.()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Payment failed')
      }
      return
    }

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Create payment intent
      const { data } = await axios.post('/api/payments', {
        amount,
        appointmentId,
        method: 'CARD',
      })

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      )

      if (error) {
        toast.error(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!')
        onSuccess?.()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <div className="grid grid-cols-2 gap-2">
          {(['card', 'zelle', 'cash', 'deposit'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`p-2 border rounded ${
                paymentMethod === method
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-300'
              }`}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="p-4 border rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      )}

      {paymentMethod === 'deposit' && (
        <div>
          <label className="block text-sm font-medium mb-2">Deposit Amount</label>
          <input
            type="number"
            min="0"
            max={amount}
            step="0.01"
            className="w-full p-2 border rounded"
            placeholder="Enter deposit amount"
          />
        </div>
      )}

      <div className="text-xl font-semibold">
        Total: ${amount.toFixed(2)}
      </div>

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  )
}

