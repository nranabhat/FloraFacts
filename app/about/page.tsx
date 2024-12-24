'use client'

import { Lobster } from 'next/font/google'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className={`${lobster.className} text-4xl text-green-800 mb-8 text-center`}>
        About FloraFacts 🌱
      </h1>
      
      <div className="space-y-12">
        {/* Fun Intro Section */}
        <section className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Hi! I&apos;m a developer exploring the wonderful world of web development, 
            one plant at a time! 
          </p>
          <div className="flex justify-center gap-2 text-2xl">
            <span>👩‍💻</span>
            <span>➕</span>
            <span>🌿</span>
            <span>=</span>
            <span>✨</span>
          </div>
        </section>

        {/* Project Story */}
        <section className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className={`${lobster.className} text-2xl text-green-700 mb-4`}>The Story</h2>
          <p className="text-gray-700 mb-4">
            FloraFacts is my first dive into the world of full-stack development. 
            I wanted to create something that combines my interest in technology with 
            something practical and fun.
          </p>
          <p className="text-gray-700">
            As someone learning to code (and trying not to kill my houseplants), 
            I thought: why not build something that helps people identify and learn about plants?
          </p>
        </section>

        {/* Tech Stack */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-3xl mb-3">⚛️</div>
            <h3 className="font-semibold text-green-700 mb-2">Built With</h3>
            <p className="text-gray-600 text-sm">
              Next.js, React, and Tailwind CSS - learning modern web development one component at a time!
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-green-700 mb-2">Powered By</h3>
            <p className="text-gray-600 text-sm">
              Google&apos;s Gemini AI - because sometimes you need a little artificial help with natural things.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform duration-300">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-green-700 mb-2">Features</h3>
            <p className="text-gray-600 text-sm">
              Mobile-friendly design, real-time plant identification, and a sprinkle of plant puns!
            </p>
          </div>
        </section>

        {/* Learning Journey */}
        <section className="bg-green-50 p-8 rounded-2xl border-2 border-green-100">
          <h2 className={`${lobster.className} text-2xl text-green-700 mb-4`}>What I&apos;ve Learned</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span>Building a full-stack app from scratch is challenging but incredibly rewarding!</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xl">🔄</span>
              <span>The importance of user feedback and continuous improvement.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span>That both code and plants need patience, care, and occasional debugging.</span>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Want to see how this project grows? Check out the code or get in touch!
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/nranabhat/FloraFacts"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded-lg
                hover:bg-green-700 transition-colors duration-300"
            >
              View on GitHub
            </a>
            <a 
              href="mailto:nicoranabhat@gmail.com"
              className="bg-green-100 text-green-800 px-6 py-2 rounded-lg
                hover:bg-green-200 transition-colors duration-300"
            >
              Say Hello! 👋
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}