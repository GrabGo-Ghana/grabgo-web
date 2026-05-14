"use client"
import { useState } from "react"
import { MapPin, Loader2, Navigation } from "lucide-react"

export default function Hero() {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
          )
          const data = await res.json()
          if (data.results[0]) {
            setAddress(data.results[0].formatted_address)
          }
        } catch {
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        }
        setLoading(false)
      },
      () => setLoading(false)
    )
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[#fe6132] pt-28 pb-16 lg:pt-32 lg:pb-20">
        <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/media/grabgo-main-video.webm" type="video/webm" />
            <source src="/media/grabgo-main-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#fe6132]/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-col items-center justify-center gap-12">
          <div className="flex flex-col text-center lg:text-left space-y-8">
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Hunger Ends{" "}
              <span className="text-white">Here!</span>
            </h1>
            <p className="text-lg items-center justify-center text-white/90 max-w-xl mx-auto lg:mx-0">
              Order from top-rated local favorites or join our growing network as a vendor or rider. Don't be left out.
            </p>
          </div>

          <div className="flex-1 w-full">
            <div className="w-full max-w-lg mx-auto lg:mt-10">
              <form>
                <label className="sr-only" htmlFor="hero-location">Search delivery location</label>
                <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white px-4 py-3 sm:px-4 sm:py-3">
                  <MapPin className="w-5 h-5 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                  <input
                    className="flex-1 min-w-0 bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm sm:text-base"
                    id="hero-location"
                    name="hero-location"
                    placeholder="Search your address..."
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                    type="button"
                    onClick={getCurrentLocation}
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                    <span className="hidden sm:inline">Use Current Location</span>
                    <span className="sm:hidden">Locate Me</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="px-7 py-3 bg-white text-background-dark font-bold rounded-full text-lg hover:scale-[1.02] transition-transform border border-white/90">
              Order Now
            </button>
          </div>
        </div>
      </section>
      <div aria-hidden="true" className="hero-end-curve" />
    </>
  )
}