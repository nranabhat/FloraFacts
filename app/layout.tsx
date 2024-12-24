// app/layout.tsx

import type { Metadata } from 'next'
// import { Lobster } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import { GalleryProvider } from './context/GalleryContext'

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
      <body className="bg-green-50">
        <GalleryProvider>
          <Header />
          {children}
        </GalleryProvider>
      </body>
    </html>
  )
}