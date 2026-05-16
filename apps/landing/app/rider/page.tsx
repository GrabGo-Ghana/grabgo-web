import type { Metadata } from "next";
import Link from "next/link";
import { HomeNavbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GrabGo Rider | Earn on Your Schedule",
};

const RIDER_NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendor" },
  { href: "/rider", label: "Rider" },
  { href: "/customer", label: "Customer" },
];

const requirements = [
  { icon: (
    <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ), label: "Valid government ID" },
  { icon: (
    <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h-3l-3 8" />
    </svg>
  ), label: "Bike, scooter, or other approved vehicle" },
  { icon: (
    <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap="round" d="M12 18h.01" />
    </svg>
  ), label: "Android or iOS phone for rider app" },
  { icon: (
    <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ), label: "Background checks and local compliance verification" },
];

const features = [
  {
    title: "Fast dispatch",
    desc: "Get matched with nearby orders in seconds.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Transparent earnings",
    desc: "See base pay, distance bonus, and incentives clearly.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Rider support",
    desc: "Escalate issues quickly through GrabGo support channels.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

export default function RiderPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <HomeNavbar  />

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe6132]/15 text-[#fe6132] text-xs font-bold tracking-widest uppercase">
                <span className="size-2 rounded-full bg-[#fe6132]" />
                Rider Program
              </span>
              <h1 className="mt-5 text-4xl lg:text-6xl font-black tracking-tight text-slate-900">
                Deliver locally. Earn flexibly.
              </h1>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
                Choose your hours, accept nearby delivery jobs, and get paid with clear earnings breakdowns and reliable weekly payouts.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="px-7 py-3 rounded-xl bg-[#fe6132] text-background-dark font-bold text-sm shadow-lg shadow-[#fe6132]/20 hover:brightness-95 transition-all"
                >
                  Get Started as Rider
                </Link>
                <Link
                  href="/faq"
                  className="px-7 py-3 rounded-xl bg-white border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Read Rider FAQs
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-tight mb-6">Rider requirements</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                {requirements.map(({ icon, label }) => (
                  <li key={label} className="flex gap-3 items-start">
                    <span className="shrink-0 mt-0.5">{icon}</span>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 p-4 rounded-xl bg-[#fe6132]/10 border border-[#fe6132]/20">
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900">Onboarding:</strong> Rider application and verification complete in the mobile rider app flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            {features.map(({ title, desc, icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-6">
                {icon}
                <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
