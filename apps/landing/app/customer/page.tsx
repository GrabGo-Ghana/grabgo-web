import type { Metadata } from "next";
import Link from "next/link";
import { HomeNavbar} from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo Customer | Order Fast, Track Live",
};

const CUSTOMER_NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendor" },
  { href: "/rider", label: "Rider" },
  { href: "/customer", label: "Customer" },
];

const featureCards = [
  {
    title: "Fast delivery ETA",
    desc: "Transparent delivery estimates and order milestones.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Flexible payments",
    desc: "Cash, card, and wallet options at checkout.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Reliable support",
    desc: "Fast help from in-app and web support channels.",
    icon: (
      <svg className="w-7 h-7 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const flow = [
  { label: "Discover", desc: "Find restaurants and nearby stores." },
  { label: "Checkout", desc: "Pay with cash, card, or wallet." },
  { label: "Track", desc: "Monitor status updates until delivery." },
];

export default function CustomerPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">


      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe6132]/15 text-[#fe6132] text-xs font-bold tracking-widest uppercase">
                <span className="size-2 rounded-full bg-[#fe6132]" />
                Customer Web
              </span>
              <h1 className="mt-5 text-4xl lg:text-6xl font-black tracking-tight text-slate-900">
                Order food, groceries, and essentials in minutes.
              </h1>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
                Browse local favorites, check out in a few taps, and follow each order from confirmation to doorstep delivery.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="px-7 py-3 rounded-xl bg-[#fe6132] text-[#1a0f0a] font-bold text-sm shadow-lg shadow-[#fe6132]/20 hover:brightness-95 transition-all"
                >
                  Start Ordering
                </Link>
                <Link
                  href="/faq"
                  className="px-7 py-3 rounded-xl bg-white border border-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  How Ordering Works
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-extrabold tracking-tight mb-6">Customer flow preview</h2>
              <ol className="space-y-4 text-sm text-slate-600">
                {flow.map(({ label, desc }) => (
                  <li key={label} className="flex gap-3">
                    <span className="mt-1 size-2 rounded-full bg-[#fe6132] shrink-0" />
                    <span>
                      <strong className="text-slate-900">{label}:</strong> {desc}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 p-4 rounded-xl bg-[#fe6132]/10 border border-[#fe6132]/20">
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900">Phase 1 note:</strong> Live customer mini-web app routes are being integrated next. This page is the current customer entry point.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            {featureCards.map(({ title, desc, icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-6">
                {icon}
                <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
}
