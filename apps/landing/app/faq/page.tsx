import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo Help & FAQ",
};

const FAQ_NAV = [
  { href: "/customer", label: "Customers" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
];

const faqSections = [
  {
    id: "refunds",
    title: "Refunds",
    icon: (
      <svg className="w-5 h-5 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
    items: [
      {
        q: "Policy on canceled orders",
        a: "Orders canceled before the vendor starts preparation are eligible for a full refund. If the vendor has already begun preparing your order, a partial refund or cancellation fee may apply depending on the specific store's policy. Refunds are typically issued back to the original payment method.",
        open: true,
      },
      {
        q: "How long do refund processing times take?",
        a: "Once approved, refunds usually take 3-5 business days to appear in your account, depending on your bank or credit card provider. Digital wallet refunds are often processed within 24 hours.",
      },
    ],
  },
  {
    id: "late",
    title: "Late Deliveries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    items: [
      {
        q: "What if my order is late?",
        a: "If your delivery is delayed past the estimated window, we recommend checking the live tracker in the app. If it's more than 20 minutes late, you may be eligible for a delivery fee credit or GrabGo points as an apology for the wait.",
      },
    ],
  },
  {
    id: "missing",
    title: "Missing Items",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    items: [
      {
        q: "What should I do if an item is missing from my order?",
        a: "Please report missing items within 24 hours of delivery through the app or via our contact form. We will investigate and issue a refund or replacement for confirmed missing items.",
      },
    ],
  },
  {
    id: "account",
    title: "Account Basics",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    items: [
      {
        q: "How do I reset my password?",
        a: "On the login screen, tap 'Forgot Password' and enter your email address. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't appear.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased min-h-screen flex flex-col">
      

      <main className="flex-1">
        {/* Hero Search */}
        <section className="relative bg-slate-900 py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200')" }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight">How can we help you today?</h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Search our help center for quick answers to your questions about orders, payments, and account security.
            </p>
            <div className="w-full max-w-2xl mt-4">
              <div className="flex items-center bg-white rounded-xl shadow-xl overflow-hidden p-1">
                <svg className="w-5 h-5 text-slate-400 ml-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  className="flex-1 border-none focus:ring-0 text-slate-800 text-base py-4 px-2 placeholder:text-slate-400 outline-none"
                  placeholder="Search for articles, topics, or keywords..."
                  type="text"
                />
                <button className="bg-[#fe6132] text-slate-900 font-bold px-8 py-3 rounded-lg hover:brightness-105 transition-all">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-28 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-4">Categories</h3>
              {faqSections.map(({ id, title, icon }, i) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    i === 0
                      ? "bg-[#fe6132]/10 text-slate-900 font-bold border-l-4 border-[#fe6132]"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {icon}
                  {title}
                </a>
              ))}
            </div>
          </aside>

          {/* FAQ Sections */}
          <div className="flex-1 space-y-12">
            {faqSections.map(({ id, title, items }) => (
              <section key={id} id={id} className="scroll-mt-28">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <div className="h-px flex-1 bg-slate-200 ml-4" />
                </div>
                <div className="space-y-4">
                  {items.map(({ q, a, open }) => (
                    <details key={q} className="group bg-white border border-slate-200 rounded-xl overflow-hidden" open={open}>
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                        <span className="text-base font-semibold">{q}</span>
                        <svg className="w-5 h-5 transition-transform group-open:rotate-180 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 text-slate-600 leading-relaxed">{a}</div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            {/* Still Need Help */}
            <section className="mt-16 bg-[#fe6132]/10 border border-[#fe6132]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                <p className="text-slate-600">Our customer support team is available 24/7 to assist you with any issues.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:brightness-110 transition-all">
                  Live Chat
                </Link>
                <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all">
                  Email Support
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
