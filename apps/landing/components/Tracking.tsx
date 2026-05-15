import Image from "next/image"

interface WavyBannerProps {
  image: string
  title: string
  description?: string
}

export default function WavyBanner({ image, title, description }: WavyBannerProps) {
  const waveHeight = 8
  const waveCount = 8
  const cornerRadius = 16
  const width = 1000
  const height = 500
  const waveWidth = width / waveCount

  // Build top wavy path
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
    <section className="relative flex flex-col w-full my-10 px-4 sm:px-8 lg:px-16">
      <div className="relative w-full">
        {/* Mobile layout - column: text top, image bottom */}
        <div className="block lg:hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="wavyClipMobile">
                <path d={topPath} />
              </clipPath>
            </defs>

            <path d={topPath} fill="#fe6132" fillOpacity="0.55" />

            {/* Text at top - 50% */}
            <foreignObject x="30" y="20" width={width - 60} height={height / 2 - 30}>
              <div className="flex flex-col items-center justify-center text-center px-20 h-full">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-4 text-3xl text-white/90 sm:text-4xl md:text-5xl">
                    {description}
                  </p>
                )}
              </div>
            </foreignObject>

            {/* Image at bottom - 50% */}
            <image
              href={image}
              x="200"
              y={height / 2}
              width={600}
              height={height / 2 - 40}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#wavyClipMobile)"
            />
          </svg>
        </div>

        {/* Desktop layout - image left, text right */}
        <div className="hidden lg:block">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="w-full h-125"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="wavyClipDesktop">
                <path d={topPath} />
              </clipPath>
            </defs>

            <path d={topPath} fill="#fe6132" fillOpacity="0.55" />

            <image
              href={image}
              x="40"
              y="40"
              width={width / 2 - 80}
              height={height - 80}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#wavyClipDesktop)"
            />

            <foreignObject x={width / 2} y="0" width={width / 2} height={height}>
              <div className="flex flex-col items-center justify-center text-center px-10 h-full">
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-4 text-lg text-white/90 max-w-sm">
                    {description}
                  </p>
                )}
              </div>
            </foreignObject>

          </svg>
        </div>

      </div>
    </section>
  )
}