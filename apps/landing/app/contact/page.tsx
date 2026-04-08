import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | Contact Support",
};

const CONTACT_NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
  { href: "/faq", label: "Support" },
];

const channels = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h7l4 4 4-4h3a2 2 0 002-2V5a2 2 0 00-2-2z" />
      </svg>
    ),
    title: "WhatsApp",
    desc: "Real-time chat with our support specialists.",
    cta: "Start Chat",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Support",
    desc: "Get a response within 2-4 business hours.",
    cta: "Send Email",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Call Helpline",
    desc: "For urgent delivery or safety issues.",
    cta: "Call Now",
  },
];

const hours = [
  { day: "Weekdays", time: "24 Hours", primary: true },
  { day: "Weekends", time: "24 Hours", primary: true },
  { day: "Holidays", time: "8:00 AM - 10:00 PM", primary: false },
];

export default function ContactPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased min-h-screen flex flex-col">
      <Navbar activeHref="/contact" links={CONTACT_NAV} />

      <main className="flex flex-1 flex-col items-center">
        <div className="w-full max-w-[1200px] px-6 lg:px-10 py-8">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col gap-2 mb-10">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <Link className="hover:text-[#fe6132]" href="/">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900">Contact Support</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mt-4">How can we help you today?</h1>
            <p className="text-slate-600 text-lg max-w-2xl mt-2">
              Our dedicated team is here to support customers, vendors, and riders 24/7 across all regions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form + Channels */}
            <div className="lg:col-span-2 space-y-8">
              {/* Support Channels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {channels.map(({ icon, title, desc, cta }) => (
                  <div key={title} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow border-b-4 border-b-[#fe6132]/40">
                    <div className="bg-[#fe6132]/10 text-[#fe6132] p-3 rounded-lg w-fit">{icon}</div>
                    <div>
                      <h3 className="text-slate-900 text-lg font-bold">{title}</h3>
                      <p className="text-slate-600 text-sm mt-1">{desc}</p>
                    </div>
                    <button className="mt-2 w-full py-2 bg-slate-100 text-slate-900 font-bold rounded-lg text-sm hover:bg-[#fe6132] hover:text-slate-900 transition-colors">
                      {cta}
                    </button>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input
                        className="rounded-lg border border-slate-300 bg-white text-slate-900 px-4 py-3 focus:ring-2 focus:ring-[#fe6132] focus:border-[#fe6132] outline-none"
                        placeholder="John Doe"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input
                        className="rounded-lg border border-slate-300 bg-white text-slate-900 px-4 py-3 focus:ring-2 focus:ring-[#fe6132] focus:border-[#fe6132] outline-none"
                        placeholder="john@example.com"
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">I am a...</label>
                    <select className="rounded-lg border border-slate-300 bg-white text-slate-900 px-4 py-3 focus:ring-2 focus:ring-[#fe6132] focus:border-[#fe6132] outline-none">
                      <option>Customer</option>
                      <option>Vendor Partner</option>
                      <option>Rider</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea
                      className="rounded-lg border border-slate-300 bg-white text-slate-900 px-4 py-3 focus:ring-2 focus:ring-[#fe6132] focus:border-[#fe6132] outline-none"
                      placeholder="How can we help?"
                      rows={4}
                    />
                  </div>
                  <button
                    className="w-full md:w-auto px-10 h-12 bg-[#fe6132] text-slate-900 font-bold rounded-lg hover:brightness-105 transition-all"
                    type="submit"
                  >
                    Submit Inquiry
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              {/* Support Hours */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Support Hours
                </h3>
                <div className="space-y-3">
                  {hours.map(({ day, time, primary }) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-slate-600">{day}</span>
                      <span className={`font-bold ${primary ? "text-[#fe6132]" : "text-slate-900"}`}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-[#fe6132]/10 rounded-xl p-6 border border-[#fe6132]/20">
                <h4 className="font-bold text-slate-900 mb-3">Looking for something else?</h4>
                <div className="flex flex-col gap-3">
                  {[
                    { href: "/faq", label: "Frequently Asked Questions" },
                    { href: "/legal/terms", label: "Terms of Service" },
                  ].map(({ href, label }) => (
                    <Link key={href} className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-[#fe6132] transition-colors" href={href}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
