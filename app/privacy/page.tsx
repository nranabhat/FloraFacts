'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className={`${lobster.className} text-4xl text-green-800 mb-8`}>Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Data Collection</h2>
          <p className="mb-2">
            FloraFacts collects only the images you upload for plant identification. These images are:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Used solely for plant identification purposes</li>
            <li>Not stored permanently on our servers</li>
            <li>Not shared with third parties</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">AI Processing</h2>
          <p>
            We use Google&apos;s Gemini AI to process your images. The processing is temporary and 
            follows Google&apos;s strict privacy standards.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Your Rights</h2>
          <p>
            You maintain full rights to your uploaded images. You can request deletion of your data 
            at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Contact</h2>
          <p>
            For privacy concerns or questions, please reach out to us at privacy@florafacts.com
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
} 