import type { Metadata } from "next";
import Link from "next/link";

import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo Vendor Portal | Grow Your Business",
};

const VENDOR_NAV = [
  { href: "#how-it-works", label: "How it Works" },
  { href: "#benefits", label: "Benefits" },
  { href: "/faq", label: "FAQ" },
];

const stats = [
  { icon: "trending_up", value: "+30%", label: "Order Growth", sub: "Average increase for new vendors in first 3 months." },
  { icon: "groups", value: "1.2M+", label: "Active Customers", sub: "Ready to order from shops like yours right now." },
  { icon: "two_wheeler", value: "50k+", label: "Fleet Strength", sub: "Professional delivery partners at your service." },
];

const benefits = [
  {
    title: "More Orders",
    desc: "Tap into our massive customer base and see your daily order volume soar with our targeted marketing tools.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Reliable Fleet",
    desc: "Our professional riders ensure your products reach customers fast, fresh, and in perfect condition every time.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Business Insights",
    desc: "Access powerful real-time analytics to understand customer behavior and optimize your catalog for maximum profit.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const howItWorksSteps = [
  { num: "01", title: "Register Online", desc: "Fill out our simple registration form with your business details and operating hours." },
  { num: "02", title: "Upload Catalog", desc: "Use our intuitive dashboard to upload your products, photos, and pricing in minutes." },
  { num: "03", title: "Go Live & Earn", desc: "Switch your toggle to \"Active\" and start receiving orders from local customers immediately." },
];

export default function VendorPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
  

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#fe6132]/10 text-[#fe6132] text-xs font-bold tracking-wider uppercase mb-4">
                    Partner with the best
                  </span>
                  <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
                    Grow Your Business with{" "}
                    <span className="text-[#fe6132]">GrabGo&apos;s</span> Network.
                  </h1>
                  <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
                    Partner with us to reach more customers, manage orders seamlessly, and grow your revenue with our reliable global delivery fleet.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-[#fe6132] text-white font-bold rounded-xl text-lg hover:scale-105 transition-transform shadow-xl shadow-[#fe6132]/10">
                    Register My Store
                  </button>
                  <Link href="/pricing" className="px-8 py-4 bg-white border border-slate-200 font-bold rounded-xl text-lg hover:bg-slate-50 transition-all text-center">
                    View Pricing
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-300" />
                    ))}
                  </div>
                  <span>Joined by 10,000+ local vendors this month</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-[#fe6132]/20 blur-3xl rounded-full" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    alt="Happy Shop Owner"
                    className="w-full h-[500px] object-cover"
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                  />
                  <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                    <div className="bg-white/90 backdrop-blur p-4 rounded-xl border border-white/20">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Growth</p>
                      <p className="text-2xl font-black text-slate-900">+34%</p>
                      <p className="text-[10px] text-[#fe6132] font-bold">Avg. Monthly Increase</p>
                    </div>
                    <div className="bg-white/90 backdrop-blur p-4 rounded-xl border border-white/20">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reach</p>
                      <p className="text-2xl font-black text-slate-900">5k+</p>
                      <p className="text-[10px] text-[#fe6132] font-bold">New Local Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-slate-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map(({ value, label, sub }) => (
                <div key={label} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-[#fe6132]/50 transition-colors">
                  <p className="text-4xl font-black text-slate-900">{value}</p>
                  <p className="text-base font-bold text-slate-500 mt-1">{label}</p>
                  <p className="text-sm text-slate-500 mt-2">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24" id="benefits">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-6">Why Partner with GrabGo?</h2>
              <p className="text-lg text-slate-600">
                We provide the tools and the network you need to take your business to the next level without the overhead costs of managing logistics.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {benefits.map(({ title, desc, icon }) => (
                <div key={title} className="group">
                  <div className="size-16 bg-[#fe6132]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#fe6132] transition-colors text-[#fe6132] group-hover:text-white">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black mb-6">Start Earning in 3 Simple Steps</h2>
                <p className="text-slate-400 text-lg">Our onboarding process is designed to get you up and running in less than 24 hours.</p>
              </div>
              <button className="px-8 py-4 bg-[#fe6132] text-white font-bold rounded-xl hover:scale-105 transition-transform">
                Get Started Now
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {howItWorksSteps.map(({ num, title, desc }) => (
                <div key={num} className="relative">
                  <div className="text-8xl font-black text-white/5 absolute -top-10 -left-4 select-none">{num}</div>
                  <div className="relative pt-4">
                    <h4 className="text-2xl font-bold mb-4">{title}</h4>
                    <p className="text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#fe6132]/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        </section>

        {/* Testimonial */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#fe6132] rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row gap-12 items-center text-white">
              <div className="w-full lg:w-1/2">
                <svg className="w-16 h-16 mb-6 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <h3 className="text-3xl lg:text-4xl font-black mb-8 leading-tight">
                  &ldquo;Joining GrabGo was the single best decision for my small bakery. Within two months, our revenue doubled and we had to hire two more staff members just to keep up!&rdquo;
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20" />
                  <div>
                    <p className="font-bold text-lg leading-none">Sarah Jenkins</p>
                    <p className="text-sm font-medium opacity-80">Owner, The Golden Whisk</p>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <img
                  alt="Bakery"
                  className="rounded-2xl shadow-xl w-full object-cover aspect-video"
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Ready to scale your business?</h2>
            <p className="text-xl text-slate-600 mb-10">Join thousands of successful vendors who trust GrabGo for their delivery needs.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-5 bg-[#fe6132] text-white font-bold rounded-xl text-xl hover:scale-105 transition-transform shadow-xl shadow-[#fe6132]/20">
                Sign Up Now — It&apos;s Free
              </button>
              <Link href="/contact" className="px-10 py-5 bg-white border border-slate-200 font-bold rounded-xl text-xl text-center">
                Contact Sales
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500 font-medium italic">No credit card required for registration. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
}
