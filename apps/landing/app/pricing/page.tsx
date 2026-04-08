import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | Pricing & Fees",
};

const PRICING_NAV = [
  { href: "/customer", label: "For Customers" },
  { href: "/vendor", label: "For Vendors" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "Help Center" },
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#fe6132] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const feeCards = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      </svg>
    ),
    title: "Base Fee",
    desc: "Starts as low as $1.99. This covers the essential logistics of preparing your order for transit.",
    tag: "Fixed Component",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Distance Factor",
    desc: "Calculated per mile from the vendor to your doorstep. Proximity saves you more money.",
    tag: "Variable Component",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Surge Pricing",
    desc: "Adjusted during peak hours or extreme weather to ensure we have enough riders available.",
    tag: "Dynamic Component",
  },
];

const vendorPlans = [
  { tier: "Self-Delivery", sub: "Use your own riders", commission: "12%", bestFor: "Established fleets", popular: false },
  { tier: "GrabGo Growth", sub: "Full logistics + Marketing", commission: "25%", bestFor: "Growing local spots", popular: true },
  { tier: "Enterprise", sub: "Custom solutions & API", commission: "Custom", bestFor: "Large chains & Retail", popular: false },
];

const billingFaqs = [
  { q: "Are there any hidden service fees?", a: "No. Every fee is itemized at checkout. We do not hide charges in the menu prices; what you see is what you pay." },
  { q: "When do vendors receive their payouts?", a: "Standard payouts are processed every Monday. Premium Growth vendors can opt for daily instant settlements for a small transaction fee." },
  { q: "How is surge pricing calculated?", a: "Our algorithm monitors real-time driver availability and demand density. When demand exceeds supply, fees increase slightly to incentivize more riders to come online." },
];

export default function PricingPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <Navbar activeHref="/pricing" links={PRICING_NAV} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20">
          <div className="absolute inset-0 opacity-5 -z-10" style={{ backgroundImage: "radial-gradient(circle, #fe6132 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#fe6132]/10 text-[#fe6132] uppercase tracking-wider mb-6">
              Transparent & Fair
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Pricing Built for <span className="text-[#fe6132]">Growth</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
              No hidden fees. Just clear, upfront costs for customers and powerful tools for vendors to scale their business effectively.
            </p>
          </div>
        </section>

        {/* Customer Pricing */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Delivery Fees Work</h2>
              <p className="text-slate-600">Our fees are calculated in real-time to ensure the fastest delivery and fairest pay for riders.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {feeCards.map(({ icon, title, desc, tag }) => (
                <div key={title} className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#fe6132]/10 flex items-center justify-center mb-6">
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{desc}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vendor Plans */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-1/3">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">Vendor Plans & Commissions</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Join thousands of local businesses already growing with GrabGo. We offer flexible commission structures that scale with your volume.
                </p>
                <ul className="space-y-4 mb-8">
                  {["No setup or registration fees", "Weekly instant settlements", "Access to 1M+ active customers"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <CheckIcon /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:w-2/3 w-full">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-4 text-sm font-bold text-slate-900">Service Tier</th>
                        <th className="px-6 py-4 text-sm font-bold text-slate-900">Commission</th>
                        <th className="px-6 py-4 text-sm font-bold text-slate-900">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vendorPlans.map(({ tier, sub, commission, bestFor, popular }) => (
                        <tr key={tier} className={popular ? "bg-[#fe6132]/5" : ""}>
                          <td className="px-6 py-5">
                            <div className="font-bold flex items-center gap-2">
                              {tier}
                              {popular && (
                                <span className="text-[10px] bg-[#fe6132] text-[#1a0f0a] px-2 py-0.5 rounded-full uppercase">Popular</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">{sub}</div>
                          </td>
                          <td className="px-6 py-5 text-[#fe6132] font-bold text-lg">{commission}</td>
                          <td className="px-6 py-5 text-sm text-slate-600">{bestFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1a0f0a] text-white rounded-[2rem] mx-4 sm:mx-6 lg:mx-8 mb-20 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to scale your business?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Get a personalized quote for your business and see how GrabGo can help you reach more customers today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto px-10 py-4 bg-[#fe6132] text-[#1a0f0a] font-bold rounded-xl hover:brightness-105 transition-all text-lg shadow-lg shadow-[#fe6132]/20">
                Contact Sales
              </Link>
              <button className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg border border-white/10">
                View Demo
              </button>
            </div>
          </div>
        </section>

        {/* Billing FAQ */}
        <section className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Common Billing Questions</h2>
          <div className="space-y-4">
            {billingFaqs.map(({ q, a }) => (
              <details key={q} className="group border border-slate-200 rounded-xl bg-white overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">{q}</span>
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">{a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
}
