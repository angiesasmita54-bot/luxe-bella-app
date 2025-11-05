import './globals.css'
import type { Metadata } from 'next'
import { Alata, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const alata = Alata({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-body',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: 'Luxe Bella - Beauty & Spa',
  description: 'Book your beauty treatments and manage your appointments',
  manifest: '/manifest.json',
  themeColor: '#603a2e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${alata.variable} ${playfair.variable} font-body`}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}

