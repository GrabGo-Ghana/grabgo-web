"use client"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-24 pb-16 lg:py-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/media/grabgo-main-video.webm" type="video/webm" />
        <source src="/media/grabgo-main-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#fe6132]/60 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-black/20 z-0" />

      <div className="relative z-10 w-full max-w-360 mx-auto px-6 lg:px-20 flex flex-col items-center justify-center text-center mt-12 lg:mt-0 text-white">
        <motion.div className="w-full max-w-4xl flex flex-col items-center"
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.5}}
        >
          <h1 className="text-white text-5xl md:text-6xl lg:text-[80px]  font-black leading-[1.1] tracking-tight mb-8 drop-shadow-sm">
            Everything you need, <br className="hidden md:block" /> delivered <span className="speed-text">fast</span>.
          </h1>
          <p className="text-white/90 text-lg md:text-2xl max-w-2xl font-medium leading-relaxed drop-shadow-sm">
            Order meals, groceries, and send packages across the city with real-time tracking and zero hassle.
          </p>
        </motion.div>
      </div>

      {/* Umbrella Curve Decorative Edge */}
      <div className="sm:bg-[#fe6132]">
      <div className="umbrella-curve-hero"></div>
      </div>
    </section>
  )
}