// app/layout.tsx

import type { Metadata } from 'next'
// import { Lobster } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { GalleryProvider } from './context/GalleryContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import { PlantProvider } from './context/PlantContext'
import { AuthModalProvider } from './components/AuthModalProvider'
import { MobileMenuProvider } from './components/MobileMenuProvider'
import { Analytics } from '@vercel/analytics/react'

// const lobster = Lobster({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: 'FloraFacts',
  description: 'Identify plants using AI technology',
  icons: {
    icon: [
      { url: '/favicon-32x32.png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  openGraph: {
    title: 'FloraFacts',
    description: 'Identify plants using AI technology',
    images: '/android-chrome-512x512.png',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FloraFacts',
    description: 'Identify plants using AI technology',
    images: '/android-chrome-512x512.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen transition-colors duration-200">
        <div className="page-gradient" />
        <ThemeProvider>
          <AuthProvider>
            <PlantProvider>
              <GalleryProvider>
                <AuthModalProvider>
                  <MobileMenuProvider>
                    <div className="mesh-gradient grid-overlay min-h-screen relative">
                      <Header />
                      <main className="pt-16">
                        {children}
                      </main>
                      <Toaster
                        position="bottom-right"
                        toastOptions={{
                          success: {
                            style: {
                              background: 'rgb(22 101 52)', // bg-green-800
                              color: 'white',
                              borderRadius: '0.5rem',
                            },
                            iconTheme: {
                              primary: 'white',
                              secondary: 'rgb(22 101 52)',
                            },
                          },
                          error: {
                            style: {
                              background: 'rgb(185 28 28)', // bg-red-700
                              color: 'white',
                              borderRadius: '0.5rem',
                            },
                            iconTheme: {
                              primary: 'white',
                              secondary: 'rgb(185 28 28)',
                            },
                          },
                          duration: 4000,
                          className: 'dark:bg-gray-800 dark:text-white',
                          style: {
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          },
                        }}
                      />
                      <Analytics />
                    </div>
                  </MobileMenuProvider>
                </AuthModalProvider>
              </GalleryProvider>
            </PlantProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}