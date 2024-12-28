// app/layout.tsx

import type { Metadata } from 'next'
// import { Lobster } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { GalleryProvider } from './context/GalleryContext'
import { ThemeProvider } from './context/ThemeContext'

// const lobster = Lobster({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: 'FloraFacts',
  description: 'Identify plants using AI technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-green-50 dark:bg-gray-900 transition-colors duration-200">
        <ThemeProvider>
          <GalleryProvider>
            <Header />
            {children}
          </GalleryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}