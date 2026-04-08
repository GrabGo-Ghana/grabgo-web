import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | Privacy Policy",
};

const LEGAL_NAV = [
  { href: "/services", label: "How it Works" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
];

const tocItems = [
  { href: "#introduction", label: "Introduction" },
  { href: "#data-collection", label: "Data Collection" },
  { href: "#usage", label: "How We Use Info" },
  { href: "#sharing", label: "Sharing Data" },
  { href: "#rights", label: "User Rights" },
  { href: "#cookies", label: "Cookie Policy" },
];

export default function PrivacyPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <Navbar links={LEGAL_NAV} />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-20 py-12">
        {/* Hero */}
        <div className="mb-12">
          <div className="bg-[#1a0f0a] rounded-xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(45deg, #fe6132 25%, transparent 25%), linear-gradient(-45deg, #fe6132 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fe6132 75%), linear-gradient(-45deg, transparent 75%, #fe6132 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
            <div className="relative z-10">
              <nav className="flex items-center gap-2 text-[#fe6132] text-xs font-bold uppercase tracking-widest mb-4">
                <Link href="/legal/terms">Legal</Link>
                <span>›</span>
                <span>Privacy Policy</span>
              </nav>
              <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
              <p className="text-slate-300 max-w-2xl">
                At GrabGo, we believe in transparency. This policy explains how we collect, use, and protect your data across our entire ecosystem.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <span className="bg-[#fe6132]/10 text-[#fe6132] px-4 py-1 rounded-full text-xs font-semibold border border-[#fe6132]/20">
              Last Updated: October 24, 2023
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-slate-900 font-bold text-sm mb-4">Table of Contents</h3>
                <nav className="flex flex-col gap-1">
                  {tocItems.map(({ href, label }, i) => (
                    <a
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${i === 0 ? "bg-[#fe6132]/10 text-[#fe6132] font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="bg-[#fe6132]/5 rounded-xl border border-[#fe6132]/10 p-5">
                <p className="text-slate-700 text-xs leading-relaxed">Have questions about our privacy practices?</p>
                <a className="inline-flex items-center gap-2 mt-3 text-[#fe6132] font-bold text-sm hover:underline" href="mailto:privacy@grabgo.com">
                  Contact Privacy Team
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 max-w-3xl space-y-10 text-slate-600 leading-relaxed">
            <section id="introduction" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Introduction</h2>
              <p>GrabGo (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is dedicated to protecting your personal data. This Privacy Policy applies to our website, mobile applications, and all related services (collectively, the &ldquo;Services&rdquo;) that connect customers, independent delivery partners (&ldquo;Riders&rdquo;), and merchant partners (&ldquo;Vendors&rdquo;).</p>
              <p className="mt-4">By using our Services, you agree to the collection and use of information in accordance with this policy. We recommend reading this document in full to understand how we treat your information.</p>
            </section>

            <hr className="border-slate-200" />

            <section id="data-collection" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Collection</h2>
              <p>We collect several different types of information for various purposes to provide and improve our Services to you.</p>
              <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 mt-6">
                <h4 className="text-slate-900 font-bold mb-4">Personal Information</h4>
                <ul className="space-y-2">
                  {["Contact details (Name, email address, phone number).", "Delivery addresses and saved locations.", "Payment information (Processed securely via third-party providers).", "Profile photos and account preferences."].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#fe6132] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="text-slate-900 font-bold mb-4">Location Data</h4>
                <ul className="space-y-2">
                  {["Real-time GPS tracking for active deliveries (Riders and Customers).", "Device-based location to suggest nearby Vendors.", "Historical address data to improve logistics efficiency."].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#fe6132] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <hr className="border-slate-200" />

            <section id="usage" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Information</h2>
              <p>GrabGo uses the collected data for various purposes, primarily focused on facilitating the delivery process:</p>
              <ul className="mt-4 space-y-2">
                {[
                  { label: "Fulfillment", desc: "To process orders and ensure accurate delivery from Vendor to Customer." },
                  { label: "Safety & Security", desc: "To verify identities of Riders and prevent fraudulent transactions." },
                  { label: "Communication", desc: "To send order status updates and respond to customer support inquiries." },
                  { label: "Product Improvement", desc: "To analyze usage patterns and optimize our delivery algorithms." },
                  { label: "Marketing", desc: "With your consent, to provide news about promotions or new local Vendors." },
                ].map(({ label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#fe6132] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong className="text-slate-900">{label}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-slate-200" />

            <section id="sharing" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing Data</h2>
              <p>We share information within our ecosystem only when necessary to complete a transaction or provide a service:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  { title: "With Vendors", desc: "We share your name and order details so merchants can prepare your items correctly." },
                  { title: "With Riders", desc: "We share your address and phone number to facilitate safe and timely delivery." },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <h5 className="font-bold text-slate-900 text-sm mb-2">{title}</h5>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200" />

            <section id="rights" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul className="mt-4 space-y-2">
                {[
                  { label: "Access", desc: "The right to request copies of your personal data." },
                  { label: "Correction", desc: "The right to request that we correct inaccurate information." },
                  { label: "Deletion", desc: "The right to request that we erase your personal data under certain conditions." },
                  { label: "Portability", desc: "The right to request that we transfer your data to another organization." },
                ].map(({ label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#fe6132] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong className="text-slate-900">{label}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-slate-200" />

            <section id="cookies" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookie Policy</h2>
              <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
              <div className="mt-6 flex items-center justify-between p-4 border-2 border-[#fe6132]/20 bg-[#fe6132]/5 rounded-xl gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-slate-900 text-sm mb-1">Detailed Cookie Preferences</p>
                  <p className="text-xs text-slate-500">Learn more about how we use cookies and manage your preferences.</p>
                </div>
                <Link className="px-4 py-2 bg-[#fe6132] text-[#1a0f0a] text-xs font-bold rounded-lg hover:brightness-95 transition-all" href="/legal/cookies">
                  View Cookie Policy
                </Link>
              </div>
            </section>
          </article>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
