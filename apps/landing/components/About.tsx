"use client"
import { useState, useEffect } from "react"

export default function AboutUs() {
  const [svgPath, setSvgPath] = useState("")
  const waveHeight = 15
  const waveCount = 15
  const cornerRadius = 16
  const width = 1000
  const height = 550
  const waveWidth = width / waveCount

  // Run path generation ONLY on the client to completely eliminate hydration errors
  useEffect(() => {
    let topPath = `M0,${waveHeight + cornerRadius} Q0,${waveHeight} ${cornerRadius},${waveHeight} `
    for (let i = 0; i < waveCount; i++) {
      const x2 = waveWidth * (i + 0.5)
      const x3 = waveWidth * (i + 1)
      if (i === 0) {
        topPath += `Q${x2},0 ${x3},${waveHeight} `
      } else if (i === waveCount - 1) {
        topPath += `Q${x2},0 ${width - cornerRadius},${waveHeight} `
      } else {
        topPath += `Q${x2},0 ${x3},${waveHeight} `
      }
    }
    topPath += `Q${width},${waveHeight} ${width},${waveHeight + cornerRadius} `
    topPath += `L${width},${height - waveHeight - cornerRadius} `
    topPath += `Q${width},${height - waveHeight} ${width - cornerRadius},${height - waveHeight} `
    for (let i = waveCount; i > 0; i--) {
      const x2 = waveWidth * (i - 0.5)
      const x3 = waveWidth * (i - 1)
      if (i === waveCount) {
        topPath += `Q${x2},${height} ${x3},${height - waveHeight} `
      } else if (i === 1) {
        topPath += `Q${x2},${height} ${cornerRadius},${height - waveHeight} `
      } else {
        topPath += `Q${x2},${height} ${x3},${height - waveHeight} `
      }
    }
    topPath += `Q0,${height - waveHeight} 0,${height - waveHeight - cornerRadius} `
    topPath += `L0,${waveHeight + cornerRadius} Z`

    setSvgPath(topPath)
  }, [])

  return (
    <section id="about-us" className="relative w-full my-12 px-4 sm:px-8 lg:px-20 max-w-360 mx-auto scroll-mt-24">

      {/* Mobile & Tablet Layout */}
      <div className="lg:hidden relative bg-[#f59e0b] px-6 sm:px-12 py-16 flex flex-col items-center text-center gap-6 overflow-hidden rounded-3xl shadow-sm">
        {/* Wavy top edge */}
        <div className="absolute top-0 left-0 w-full">
          <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-4">
            <path d="M0,10 Q12.5,0 25,10 Q37.5,20 50,10 Q62.5,0 75,10 Q87.5,20 100,10 Q112.5,0 125,10 Q137.5,20 150,10 Q162.5,0 175,10 Q187.5,20 200,10 Q212.5,0 225,10 Q237.5,20 250,10 Q262.5,0 275,10 Q287.5,20 300,10 Q312.5,0 325,10 Q337.5,20 350,10 Q362.5,0 375,10 Q387.5,20 400,10 L400,0 L0,0 Z" fill="#fafafa" />
          </svg>
        </div>

        {/* Wavy bottom edge */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-4">
            <path d="M0,10 Q12.5,20 25,10 Q37.5,0 50,10 Q62.5,20 75,10 Q87.5,0 100,10 Q112.5,20 125,10 Q137.5,0 150,10 Q162.5,20 175,10 Q187.5,0 200,10 Q212.5,20 225,10 Q237.5,0 250,10 Q262.5,20 275,10 Q287.5,0 300,10 Q312.5,20 325,10 Q337.5,0 350,10 Q362.5,20 375,10 Q387.5,0 400,10 L400,20 L0,20 Z" fill="#fafafa" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-white">
          About Us
        </h1>
        <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
          GrabGo Ghana was built to make food delivery in Ghana faster, more reliable, and more affordable. Starting from Accra, GrabGo connects hungry customers, local restaurants, vendors, and hardworking riders on one seamless delivery platform built for how Ghana moves.
        </p>
        <a href="#customers" className="mt-2 inline-flex items-center px-8 py-3 bg-white text-[#fe6132] font-bold rounded-full hover:bg-slate-50 transition text-lg shadow-sm">
          Order Now
        </a>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block relative w-full overflow-hidden rounded-3xl min-h-125">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://w3.org"
          >
            {/* Render the path only when it has safely generated on the client */}
            {svgPath && <path d={svgPath} fill="#f59e0b" fillOpacity="0.9" />}
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-16 xl:px-32 py-24 gap-8 min-h-125">
          <h1 className="text-3xl font-black uppercase tracking-widest text-white">
            About Us
          </h1>
          <p className="text-white/95 text-xl xl:text-2xl font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-sm">
            GrabGo as a marketplace and logistics platform for restaurants in Ghana operates with the sole aim of making food delivery in Ghana fast, reliable and affordable. Our mission is to create value for our customers, vendors and riders across the delivery chain, thereby empowering businesses, growing local economies and satisfying consumers.
          </p>
          <a
            href="#customers"
            className="mt-4 inline-flex items-center px-10 py-4 bg-white text-[#fe6132] font-black rounded-full hover:bg-orange-50 transition duration-300 text-lg shadow-md transform hover:-translate-y-0.5"
          >
            Order Now
          </a>
        </div>
      </div>

    </section>
  )
}


