"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const Tracking = () => {

  // Dynamic OS Routing Function
  const handleDownloadRedirect = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    const userAgent = navigator.userAgent || navigator.vendor || ((window as any).opera || "")

    // Detect iOS, iPadOS, and macOS
    const isApple = /iPad|iPhone|iPod/.test(userAgent) || 
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                    /Macintosh/.test(userAgent)

    if (isApple) {
      window.open('https://apps.apple.com/app/your-app-id', '_blank', 'noopener,noreferrer')
    } else {
      // Fallback for Android, Windows, and Linux
      window.open('https://play.google.com/store/apps/details?id=your.package.name', '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section id="tracking" className="w-full py-10 px-4 sm:px-8 lg:px-16 bg-white scroll-mt-24">
      <motion.div 
        className="max-w-360 mx-auto flex flex-col lg:flex-row items-center gap-12" 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        viewport={{ once: true }}
      >
        {/* Image - left on desktop, top on mobile */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Image 
            src="/media/tracker.jpeg" 
            alt="GrabGo App Mockup" 
            width={600} 
            height={600} 
            className="w-full max-w-sm object-contain" 
          />
        </div>

        {/* Text - right on desktop, bottom on mobile */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <p className="text-[#fe6132]/90 text-sm font-black uppercase tracking-tight">
            Real-Time Tracking
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-tight">
            Know exactly where your order is.
          </h2>
          <p className="text-[#4b5563] text-lg leading-relaxed max-w-lg">
            Chale! Track your order live from the moment it leaves the restaurant to the second it arrives at your door. Zero guessing. Zero waiting in the dark.
          </p>
          
          {/* Converted from link to a dynamic redirect button */}
          <button 
            onClick={handleDownloadRedirect}
            className="inline-flex items-center self-start px-6 py-3 bg-[#fe6132] text-white font-medium rounded-full hover:opacity-90 transition text-lg cursor-pointer"
          >
            Download the App
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default Tracking
