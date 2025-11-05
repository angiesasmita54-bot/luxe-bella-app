'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [devCode, setDevCode] = useState<string | null>(null)

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await axios.post('/api/auth/forgot-password', {
        email,
      })

      if (response.data) {
        // In development, if email is not configured, show the code
        if (response.data.code) {
          setDevCode(response.data.code)
          toast.success(`Code generated: ${response.data.code} (email not configured)`, {
            duration: 10000,
          })
        } else {
          toast.success('Reset code sent to your email!')
        }
        setCodeSent(true)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  if (codeSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50 py-8 px-4">
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md border border-primary-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-primary font-heading">
              Check Your Email
            </h1>
            <p className="text-primary-700 text-sm">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            {devCode && (
              <div className="mt-4 p-4 bg-primary-50 border-2 border-primary rounded-lg">
                <p className="text-sm text-primary-700 mb-2">Development Mode:</p>
                <p className="text-2xl font-mono font-bold text-primary">{devCode}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link
              href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
              className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              Enter Reset Code
            </Link>
            <button
              onClick={() => {
                setCodeSent(false)
                setEmail('')
                setDevCode(null)
              }}
              className="w-full bg-white text-primary py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary-50 transition-all duration-200"
            >
              Use Different Email
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-primary-600">
            <Link href="/auth/signin" className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 py-8 px-4">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md border border-primary-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary font-heading">
            Forgot Password?
          </h1>
          <p className="text-primary-700 text-sm">
            Enter your email address and we'll send you a 6-digit code to reset your password
          </p>
        </div>

        <form onSubmit={handleRequestCode} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary-400"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending code...
              </span>
            ) : (
              'Send Reset Code'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary-600">
          Remember your password?{' '}
          <Link href="/auth/signin" className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

