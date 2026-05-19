"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const Tracking = () => {
  return (
    <section id="tracking" className="w-full py-10 px-4 sm:px-8 lg:px-16 bg-white">
      <motion.div className="max-w-360 mx-auto flex flex-col lg:flex-row items-center gap-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}>


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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[color-text-main] tracking-tight leading-tight">
            Know exactly where your order is.
          </h2>
          <p className="text-[color-text-muted] text-lg leading-relaxed max-w-lg">
            Chale! Track your order live from the moment it leaves the restaurant to the second it arrives at your door. Zero guessing. Zero waiting in the dark.
          </p>
          <a
            href="#download"
            className="inline-flex items-center self-start px-4 py-3 bg-[#fe6132] text-white font-medium rounded-full hover:opacity-90 transition text-lg"
          >
            Download the App
          </a>
        </div>

      </motion.div>
    </section>
  )
}

export default Tracking