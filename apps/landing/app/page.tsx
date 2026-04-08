import Link from "next/link";
import { HomeNavbar } from "@/components/Navbar";
import { HomeFooter } from "@/components/Footer";

const ShoppingBasketIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const StorefrontIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
  </svg>
);

const BikeIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h-3l-3 8m0 0l2-3h4l2 3M8 17.5l4-8 4 4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const PaymentsIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path strokeLinecap="round" d="M2 10h20" />
  </svg>
);

const TrackIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ExpandMoreIcon = () => (
  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const howItWorksSteps = [
  { num: "1", label: "Choose", desc: "Browse through thousands of local restaurants and stores at your fingertips.", Icon: SearchIcon },
  { num: "2", label: "Pay", desc: "Securely checkout with your preferred payment method. It's fast and easy.", Icon: PaymentsIcon },
  { num: "3", label: "Track", desc: "Watch your order arrive in real-time with our advanced GPS tracking system.", Icon: TrackIcon },
];

const faqItems = [
  { q: "How fast is GrabGo delivery?", a: "Most orders arrive in 20-35 minutes depending on distance, traffic, and merchant prep time.", open: true },
  { q: "Can I schedule an order in advance?", a: "Yes. You can schedule selected orders ahead of time and choose your preferred delivery window." },
  { q: "What payment methods do you accept?", a: "GrabGo supports cards, mobile wallets, and cash on delivery in supported zones." },
  { q: "How do I track my order live?", a: "After checkout, open your order status page to see real-time rider location and delivery progress." },
];

export default function HomePage() {
  return (
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

        {/* Tri-CTA Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-3xl bg-[#fff9f4] border border-slate-100 transition-all shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white">
                  <ShoppingBasketIcon />
                </div>
                <h3 className="text-2xl font-bold mb-3">Order Now</h3>
                <p className="text-slate-600 mb-6">Hungry? Get the best food and groceries delivered to your door in minutes.</p>
                <Link className="inline-flex items-center text-[#fe6132] font-bold gap-1 group-hover:gap-2 transition-all" href="/customer">
                  Start Shopping <ChevronRightIcon />
                </Link>
              </div>

              <div className="group p-8 rounded-3xl bg-[#fff9f4] border border-slate-100 transition-all shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white">
                  <StorefrontIcon />
                </div>
                <h3 className="text-2xl font-bold mb-3">Become a Vendor</h3>
                <p className="text-slate-600 mb-6">Expand your reach and grow your sales with our professional delivery fleet.</p>
                <Link className="inline-flex items-center text-[#fe6132] font-bold gap-1 group-hover:gap-2 transition-all" href="/vendor">
                  Partner With Us <ChevronRightIcon />
                </Link>
              </div>

              <div className="group p-8 rounded-3xl bg-[#fff9f4] border border-slate-100 transition-all shadow-sm">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white">
                  <BikeIcon />
                </div>
                <h3 className="text-2xl font-bold mb-3">Join as Rider</h3>
                <p className="text-slate-600 mb-6">Be your own boss. Earn competitive rates on your own schedule with GrabGo.</p>
                <Link className="inline-flex items-center text-[#fe6132] font-bold gap-1 group-hover:gap-2 transition-all" href="/rider">
                  Start Riding <ChevronRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-[#fff9f4]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Ordering made simple</h2>
            <p className="text-slate-600">From craving to doorstep in three easy steps</p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-[#fe6132]/20 -translate-y-12" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
              {howItWorksSteps.map(({ num, label, desc, Icon }) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white border-4 border-[#fe6132] shadow-xl flex items-center justify-center mb-8 relative">
                    <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#fe6132] text-[#1a0f0a] font-black flex items-center justify-center text-sm">
                      {num}
                    </span>
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{label}</h3>
                  <p className="text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
              {[["FOODIE","HUB"], ["STORE","SYNC"], ["METRO","GO"], ["QUICK","PAY"]].map(([a, b]) => (
                <span key={a} className="text-2xl font-black text-slate-900">
                  {a}<span className="text-[#fe6132]">{b}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Quick FAQ */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
              <div className="space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#fe6132]">Quick FAQ</p>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                  Got questions before you order?
                </h2>
                <p className="text-slate-600 max-w-md">
                  Here are the most common things customers ask before placing their first order.
                </p>
                <Link
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fe6132] text-white font-bold text-sm hover:brightness-95 transition-all"
                  href="/faq"
                >
                  View Full FAQs <ChevronRightIcon />
                </Link>
              </div>

              <div className="space-y-3">
                {faqItems.map(({ q, a, open }) => (
                  <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5" open={open}>
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                      <span className="font-bold text-slate-900">{q}</span>
                      <ExpandMoreIcon />
                    </summary>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
