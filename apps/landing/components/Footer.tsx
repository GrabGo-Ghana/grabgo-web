import Image from "next/image"
import { FaApple, FaGooglePlay, FaXTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa6"

const footerLinks = [
  {
    title: "Company",
    links: ["About Us", "Customers", "Vendors", "Riders"]
  },
  {
    title: "Help & Support",
    links: ["FAQ", "Contact Us"]
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms and Conditions", "Cookie Policy"]
  }
]

export default function Footer() {
  return (
    <footer className="bg-[#fe6132] text-white pt-20 relative">
      {/* Umbrella Curve Decorative Edge */}
      <div className="umbrella-curve-footer"></div>

      <div className="max-w-360 mx-auto px-6 lg:px-20">

        {/* Top Section */}
        <div className="lg:flex border-b border-white/20 pb-16">
          <div className="flex flex-col lg:w-[35%] lg:pr-8 mb-12 lg:mb-0">
            <div className="w-20 h-20 mb-6">
              <Image
                src="/media/logo.svg"
                alt="GrabGo App Icon"
                width={50}
                height={50}
                className="w-full h-full object-contain rounded-[18px] shadow-sm"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight">GrabGo</h2>
              <p className="text-white/80 mt-2 font-medium">Whenever you want it.</p>
            </div>

            {/* App Download Badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-md border border-white/10 hover:border-white/30">
                <FaApple size={24} />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] leading-none text-gray-300 mb-1">Download on the</span>
                  <span className="text-sm font-semibold leading-none tracking-wide">App Store</span>
                </div>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-md border border-white/10 hover:border-white/30">
                <FaGooglePlay size={24} />
                <div className="flex flex-col text-left">
                  <span className="text-[10px] leading-none text-gray-300 mb-1">GET IT ON</span>
                  <span className="text-sm font-semibold leading-none tracking-wide">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:border-l border-white/20 flex-1 lg:pl-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {footerLinks.map((col, idx) => (
                <div key={idx}>
                  <h3 className="uppercase text-[#FFD166] font-bold tracking-wider text-sm mb-6">{col.title}</h3>
                  <ul className="grid gap-4">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        <a href="#" className="text-white/90 hover:text-white hover:underline font-medium transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Socials & Copyright */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/70 text-sm font-medium mb-6 md:mb-0">
            © 2026 GrabGo. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-white hover:text-[#FFD166] transition-colors flex items-center gap-2 font-semibold">
              <FaXTwitter size={20} />
              <span className="hidden sm:inline">Twitter</span>
            </a>
            <a href="#" className="text-white hover:text-[#FFD166] transition-colors flex items-center gap-2 font-semibold">
              <FaInstagram size={20} />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a href="#" className="text-white hover:text-[#FFD166] transition-colors flex items-center gap-2 font-semibold">
              <FaFacebook size={20} />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a href="#" className="text-white hover:text-[#FFD166] transition-colors flex items-center gap-2 font-semibold">
              <FaLinkedin size={20} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}