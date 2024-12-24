'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className={`${lobster.className} text-4xl text-green-800 mb-8`}>Terms of Use</h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Acceptance of Terms</h2>
          <p>
            By using FloraFacts, you agree to these terms. Our service is provided "as is" 
            and we reserve the right to modify these terms at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Use of Service</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use FloraFacts for personal, non-commercial plant identification only</li>
            <li>Don&apos;t upload inappropriate or harmful content</li>
            <li>Don&apos;t attempt to misuse or exploit the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Plant Identification</h2>
          <p>
            While we strive for accuracy, our AI-based identification is not guaranteed. 
            Don&apos;t rely on FloraFacts for identifying potentially harmful or edible plants.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Limitations</h2>
          <p>
            We are not liable for any damages or losses resulting from your use of FloraFacts. 
            Our service may be interrupted for maintenance or updates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-green-700 mb-3">Contact</h2>
          <p>
            For questions about these terms, contact us at terms@florafacts.com
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
} 