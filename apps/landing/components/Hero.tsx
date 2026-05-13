    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <HomeNavbar />
      <main>
        {/* Hero Section */}
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
            <div className="absolute inset-0 bg-[#fe6132]/60" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Everything you need,{" "}
                <span className="text-white/95">delivered fast.</span>
              </h1>
              <p className="text-lg text-white/90 max-w-xl mx-auto lg:mx-0">
                Order from top-rated local favorites or join our growing network as a vendor or rider. Fresh food, groceries, and essentials at your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-white text-[#1a0f0a] font-bold rounded-xl text-lg hover:scale-[1.02] transition-transform border border-white/90">
                  Order Now
                </button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="w-full max-w-lg lg:ml-auto lg:mt-10">
                <form>
                  <label className="sr-only" htmlFor="hero-location">Search delivery location</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3">
                    <LocationIcon />
                    <input
                      className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-500 outline-none text-sm sm:text-base"
                      id="hero-location"
                      name="hero-location"
                      placeholder="Search your address..."
                      type="text"
                    />
                    <button
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap"
                      type="button"
                    >
                      Use Current Location
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <div aria-hidden="true" className="hero-end-curve" />