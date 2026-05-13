import type { Metadata } from "next";
import Link from "next/link";
import { HomeNavbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | About Us - Moving Your World",
};

const ArrowForwardIcon = () => (
  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-[#fe6132] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-12 h-12 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ecosystemItems = [
  {
    title: "For Customers",
    desc: "Fast, reliable delivery from your favorite local shops directly to your door. We ensure freshness, speed, and quality in every single drop-off.",
    icon: (
      <svg className="w-7 h-7 text-[#1a0f0a]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
      </svg>
    ),
  },
  {
    title: "For Vendors",
    desc: "Sophisticated technology and logistics tools to help your business reach new customers, streamline orders, and expand your digital footprint.",
    icon: (
      <svg className="w-7 h-7 text-[#1a0f0a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      </svg>
    ),
  },
  {
    title: "For Riders",
    desc: "Flexible earning opportunities with a focus on safety, community, and support. We provide the platform, you provide the momentum.",
    icon: (
      <svg className="w-7 h-7 text-[#1a0f0a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h-3l-3 8" />
      </svg>
    ),
  },
];

const stats = [
  { value: "50+", label: "Cities" },
  { value: "12k+", label: "Riders" },
  { value: "2M+", label: "Deliveries" },
];

const regions = [
  { name: "North America", sub: "12 Major Markets" },
  { name: "Europe", sub: "8 Strategic Hubs" },
  { name: "SE Asia", sub: "Fastest Growth" },
  { name: "Australia", sub: "Coming Soon" },
];

const team = [
  { name: "Julian Chen", role: "Founder & CEO" },
  { name: "Elena Rodriguez", role: "Chief Operations" },
  { name: "Marcus Thorne", role: "CTO" },
  { name: "Sarah Jenkins", role: "Head of Strategy" },
];

const ABOUT_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "Safety" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <HomeNavbar />

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:w-2/3">
              <span className="inline-block py-1 px-3 rounded-full bg-[#fe6132]/10 text-[#fe6132] text-xs font-bold uppercase tracking-wider mb-6">
                Our Journey
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
                Our Mission to{" "}
                <span className="text-[#fe6132] italic font-serif">Move</span> Your World
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10">
                GrabGo bridges the gap between local commerce and convenient delivery, empowering customers, vendors, and riders across the globe. We aren&apos;t just a delivery app; we are a community-driven logistics engine.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all">
                  Partner With Us <ArrowForwardIcon />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div
              className="w-full h-full bg-cover bg-center rounded-l-[100px] shadow-2xl"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')" }}
            />
          </div>
        </section>

        {/* Empowering Ecosystem */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Empowering Our Ecosystem</h2>
              <p className="text-slate-600">We build tools that create opportunities for everyone involved in the delivery lifecycle.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {ecosystemItems.map(({ title, desc, icon }) => (
                <div key={title} className="group p-8 rounded-2xl bg-[#fff9f4] border border-[#fe6132]/5 hover:border-[#fe6132] transition-all">
                  <div className="w-14 h-14 bg-[#fe6132] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety First */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
                <h2 className="text-white text-4xl font-bold mb-8 flex items-center gap-4">
                  <ShieldIcon />
                  Safety First, Always
                </h2>
                <div className="space-y-6">
                  {[
                    { title: "Strict Partner Vetting", desc: "Every rider and merchant undergoes a rigorous background and quality check." },
                    { title: "Real-time GPS Tracking", desc: "Full transparency with live tracking for customers and insurance for all active riders." },
                    { title: "Contactless & Secure", desc: "Encrypted payment gateways and hygiene-first delivery protocols at every step." },
                  ].map(({ title, desc }) => (
                    <div key={title} className="flex gap-4">
                      <CheckCircleIcon />
                      <div>
                        <h4 className="text-white font-semibold">{title}</h4>
                        <p className="text-slate-400 text-sm">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="lg:w-1/2 min-h-[400px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800')" }}
              />
            </div>
          </div>
        </section>

        {/* Geographic Reach */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white h-[400px] relative bg-slate-200">
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-[#1a0f0a] to-transparent">
                    <div className="flex gap-8 text-white">
                      {stats.map(({ value, label }) => (
                        <div key={label}>
                          <div className="text-3xl font-extrabold text-[#fe6132]">{value}</div>
                          <div className="text-xs uppercase tracking-widest font-bold">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <h2 className="text-4xl font-bold mb-6">Our Growing Footprint</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  From local hubs to major metropolises, GrabGo is rapidly expanding our service area. We believe that distance shouldn&apos;t be a barrier to quality commerce.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {regions.map(({ name, sub }) => (
                    <div key={name} className="p-4 rounded-xl bg-white shadow-sm border border-slate-100">
                      <h5 className="font-bold text-[#fe6132] mb-1">{name}</h5>
                      <p className="text-xs text-slate-500">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20 bg-[#fff9f4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Led by Visionaries</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map(({ name, role }) => (
                <div key={name} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg bg-slate-200 grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <h4 className="font-bold text-lg">{name}</h4>
                  <p className="text-sm text-[#fe6132] font-semibold">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#fe6132] p-12 lg:p-16 rounded-[3rem] text-[#1a0f0a] text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="40" id="about-dots" patternUnits="userSpaceOnUse" width="40">
                      <circle cx="2" cy="2" fill="currentColor" r="2" />
                    </pattern>
                  </defs>
                  <rect fill="url(#about-dots)" height="100%" width="100%" />
                </svg>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6 relative z-10">Ready to Grow With Us?</h2>
              <p className="text-lg lg:text-xl font-medium mb-10 opacity-80 max-w-2xl mx-auto relative z-10">
                Whether you&apos;re a merchant looking to expand or a rider seeking flexibility, GrabGo is your partner for success.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link href="/vendor" className="bg-[#1a0f0a] text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                  Become a Partner
                </Link>
                <Link href="/customer" className="bg-white/20 backdrop-blur-sm border-2 border-[#1a0f0a]/20 text-[#1a0f0a] px-10 py-4 rounded-2xl font-bold hover:bg-white/40 transition-all">
                  Download App
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
}
