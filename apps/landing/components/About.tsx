export default function AboutUs() {
  const waveHeight = 15
  const waveCount = 15
  const cornerRadius = 16
  const width = 1000
  const height = 500
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
    <section id="about" className="relative flex flex-col w-full my-10 px-4 sm:px-8 lg:px-16">
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="w-full h-64 sm:h-80 lg:h-125"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="wavyClipAbout">
              <path d={topPath} />
            </clipPath>
          </defs>

          {/* Background fill */}
          <path d={topPath} fill="#f59e0b" fillOpacity="0.9" />

          {/* Content */}
          <foreignObject x="0" y="0" width={width} height={height} clipPath="url(#wavyClipAbout)">
            <div className="flex flex-col items-center justify-center text-center px-16 sm:px-24 lg:px-40 h-full gap-6">
              <p className="text-white/80 text-xl sm:text-2xl font-bold uppercase tracking-widest py-3">
                
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight">
                
              </h2>
              <p className="text-white/90 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl">
                
              </p>
              <a href="#customers" className="mt-2 inline-flex items-center px-8 py-3 bg-white text-[#fe6132] font-bold rounded-full hover:opacity-90 transition text-lg">
                
              </a>
            </div>
          </foreignObject>
        </svg>
      </div>
    </section>
  )
}