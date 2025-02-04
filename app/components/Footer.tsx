'use client'

import Link from 'next/link'

const Footer = () => {
  const handleCoffeeClick = () => {
    // Replace with your actual Buy Me a Coffee link
    window.open('https://www.buymeacoffee.com/nranabhat', '_blank')
  }

  return (
    <footer className="footer-gradient text-green-100 mt-24 py-8 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About FloraFacts</h3>
          <p className="text-green-200 text-sm leading-relaxed">
            FloraFacts uses advanced AI to help plant enthusiasts identify and learn about their leafy friends. 
            Built with love for the plant community. 🌱
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="text-green-200 text-sm space-y-2">
            <li>
              <a href="https://github.com/nranabhat/FloraFacts" 
                className="hover:text-white transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </li>
            <li>
              <Link 
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Support the Project</h3>
          <p className="text-green-200 text-sm mb-4">
            If you find FloraFacts helpful, consider supporting its development! ☕
          </p>
          <button
            onClick={handleCoffeeClick}
            className="bg-[#FFDD00] text-gray-900 px-6 py-2 rounded-lg
              font-medium hover:bg-[#FFE44D] transition-colors duration-300
              flex items-center gap-2 text-sm"
          >
            <span role="img" aria-label="coffee">☕</span>
            Buy Me a Coffee
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 pt-4 border-t border-green-800 text-center text-sm text-green-400">
        <p>© {new Date().getFullYear()} FloraFacts. Made with 💚 for plant lovers.</p>
      </div>
    </footer>
  )
}

export default Footer 