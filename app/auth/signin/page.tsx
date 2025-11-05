'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error.includes('database') || result.error.includes('connection')) {
          toast.error('Database connection error. Please ensure PostgreSQL is running.')
        } else {
          toast.error(result.error)
        }
      } else if (result?.ok) {
        toast.success('Signed in successfully!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Sign-in error:', error)
      const errorMessage = error?.message || 'An error occurred'
      if (errorMessage.includes('database') || errorMessage.includes('connection')) {
        toast.error('Database connection error. Please check your database setup.')
      } else {
        toast.error(errorMessage || 'An error occurred during sign-in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-50 py-8 px-4">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md border border-primary-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary font-heading">
            Welcome Back
          </h1>
          <p className="text-primary-700 text-sm">Sign in to your Luxe Bella account</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-5">
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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-primary-700">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:border-primary-400"
              placeholder="Enter your password"
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
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-primary-600 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={async () => {
                try {
                  const result = await signIn('google', { 
                    callbackUrl: '/dashboard',
                    redirect: true,
                  })
                  if (result?.error) {
                    toast.error('Google sign-in failed. Please try again or use email sign-in.')
                  }
                } catch (error: any) {
                  console.error('Google sign-in error:', error)
                  toast.error('Google sign-in is not configured. Please use email sign-in or configure OAuth credentials.')
                }
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary-300 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all duration-200 font-medium text-primary shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={async () => {
                try {
                  const result = await signIn('facebook', { 
                    callbackUrl: '/dashboard',
                    redirect: true,
                  })
                  if (result?.error) {
                    toast.error('Facebook sign-in failed. Please try again or use email sign-in.')
                  }
                } catch (error: any) {
                  console.error('Facebook sign-in error:', error)
                  toast.error('Facebook sign-in is not configured. Please use email sign-in or configure OAuth credentials.')
                }
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-primary-300 rounded-lg hover:bg-primary-50 hover:border-primary-400 transition-all duration-200 font-medium text-primary shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Sign in with Facebook</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-primary-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary-600 font-semibold hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

