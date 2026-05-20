export default function AboutUs() {
  const waveHeight = 15
  const waveCount = 15
  const cornerRadius = 16
  const width = 1000
  const height = 700
  const waveWidth = width / waveCount

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

  return (
    <section id="aboutus" className="relative flex flex-col w-full my-10 px-4 sm:px-8 lg:px-16">
      
      {/* Mobile & Tablet - plain div, no SVG stretching */}
      <div className="lg:hidden rounded-3xl bg-[#f59e0b] px-8 sm:px-16 py-14 flex flex-col items-center text-center gap-6">
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-white">
          About Us
        </h1>
        <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
          GrabGo was built for one reason because getting food delivered in Accra was broken. Cold meals, missing orders, riders who disappear mid-delivery. We lived it, we hated it, and we fixed it. GrabGo is Accra's fastest food delivery platform connecting hungry customers, ambitious vendors, and hardworking riders on one seamless platform built specifically for how this city moves.
        </p>
        <a href="#customers" className="mt-2 inline-flex items-center px-8 py-3 bg-white text-[#fe6132] font-bold rounded-full hover:opacity-90 transition text-lg">
          Order Now
        </a>
      </div>

      {/* Desktop - SVG wavy card */}
      <div className="hidden lg:block relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-150"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="wavyClipAbout">
              <path d={topPath} />
            </clipPath>
          </defs>

          <path d={topPath} fill="#f59e0b" fillOpacity="0.9" />

          <foreignObject x="0" y="0" width={width} height={height} clipPath="url(#wavyClipAbout)">
            <div className="flex flex-col items-center justify-center text-center px-40 h-full gap-6">
              <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
                About Us
              </h1>
              <p className="text-white/90 text-2xl leading-relaxed max-w-2xl">
              GrabGo as a marketplace and logistics platform for restaurants in Ghana operates with the sole aim of making food delivery in Ghana fast, reliable and affordable. Our mission is to create value for our customers, vendors and riders across the delivery chain, thereby empowering businesses, growing local economies and satisfying consumers.
              </p>
              <a href="#customers" className="mt-2 inline-flex items-center px-8 py-3 bg-white text-[#fe6132] font-bold rounded-full hover:opacity-90 transition text-lg">
                Order Now
              </a>
            </div>
          </foreignObject>
        </svg>
      </div>

    </section>
  )
}