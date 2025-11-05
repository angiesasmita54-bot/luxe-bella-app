import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-primary-50">
      <div className="bg-primary-50 border-b border-primary-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-primary-700 mb-2 font-heading">Welcome to</h1>
            <h2 className="text-5xl md:text-6xl font-bold text-primary mb-8 font-heading">
              Luxe Bella
            </h2>
            <p className="text-xl text-primary-700 mb-10">
              Your Beauty & Spa Experience, Elevated
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-200 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold border-2 border-primary hover:bg-primary-50 transition-all duration-200 shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary font-heading">Online Reservations</h3>
            <p className="text-primary-700">
              Book your appointments 24/7 with real-time availability
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary font-heading">Loyalty Rewards</h3>
            <p className="text-primary-700">
              Earn points with every visit and unlock exclusive benefits
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-primary-200 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary font-heading">Personalized Care</h3>
            <p className="text-primary-700">
              Track your treatments and get personalized recommendations
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

