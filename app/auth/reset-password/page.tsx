'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import axios from 'axios'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email') || ''
  
  const [email, setEmail] = useState(emailFromQuery)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (emailFromQuery) {
      setEmail(emailFromQuery)
    }
  }, [emailFromQuery])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (code.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    
    try {
      const response = await axios.post('/api/auth/reset-password', {
        email,
        code,
        newPassword,
      })

      if (response.data) {
        toast.success('Password reset successfully! Please sign in with your new password.')
        router.push('/auth/signin')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 py-8 px-4">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md border border-primary-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary font-heading">
            Reset Password
          </h1>
          <p className="text-primary-700 text-sm">
            Enter the 6-digit code from your email and your new password
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
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

          <div>
            <label className="block text-sm font-semibold mb-2 text-primary-700">
              Reset Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setCode(value)
              }}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary-400 text-center text-2xl font-mono font-bold tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-xs text-primary-600 mt-1">Enter the 6-digit code sent to your email</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-primary-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary-400"
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-primary-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary-400"
              placeholder="Re-enter your password"
              required
              minLength={6}
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
                Resetting password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-primary-600">
            Didn't receive a code?{' '}
            <Link href="/auth/forgot-password" className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
              Request a new one
            </Link>
          </p>
          <p className="text-center text-sm text-primary-600">
            <Link href="/auth/signin" className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md border border-primary-200">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-primary-700">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

