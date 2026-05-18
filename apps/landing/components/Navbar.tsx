"use client"
import { useState, useEffect } from "react"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors py-6 `}>
        <div className="max-w-360 mx-auto px-6 lg:px-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 bg-[#fe6132] text-white px-5 h-11.25 rounded-full font-extrabold text-xl tracking-tight ">
              <img src="/media/logo.svg" alt="GrabGO" className="w-6 h-6 object-contain rounded-md" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="hidden sm:inline">GrabGO</span>
            </a>
          </div>

          {/* Desktop Links Pill */}
          <div className="hidden lg:flex justify-center">
            <ul className="bg-white rounded-full flex items-center px-2 h-14 shadow-sm border border-gray-100">
              {['About Us', 'Vendors', 'Riders', 'FAQs'].map((item) => (
                <li key={item} className="relative group flex items-center h-full">
                  <a
                    className="relative z-10 py-2 px-6 text-center inline-block font-semibold text-gray-600 transition-colors duration-300 group-hover:text-white"
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                  >
                    {item}
                  </a>
                  <div className="absolute inset-y-1.5 inset-x-1 bg-[#fe6132] rounded-full scale-95 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 z-0"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block">
              <a href="#download" className="inline-flex items-center justify-center h-11.25 px-6 bg-[#fe6132] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Download App
              </a>
            </div>
            <button
              className="lg:hidden bg-[#fe6132] text-white w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black text-white z-1000 overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="sticky top-0 w-full bg-black flex items-center justify-end p-6 border-b border-white/20">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col pt-4">
            {['Customers', 'Vendors', 'Riders', 'FAQs', 'About Us', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="flex items-center text-xl font-medium h-20 pl-10 border-b border-white/20 hover:bg-[#fe6132] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="p-10">
              <a href="#download" className="flex items-center justify-center w-full px-6 py-4 bg-[#fe6132] text-white font-bold rounded-full hover:opacity-90 transition">
                Download App
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar