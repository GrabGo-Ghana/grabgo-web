import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | Terms of Service",
};

const LEGAL_NAV = [
  { href: "/", label: "Home" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
  { href: "/faq", label: "Support" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service", active: true },
  { href: "/legal/privacy", label: "Privacy Policy", active: false },
  { href: "/legal/cookies", label: "Cookie Policy", active: false },
];

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">Welcome to GrabGo. These Terms of Service govern your access to and use of the GrabGo website, mobile applications, and services (collectively, the &ldquo;Platform&rdquo;). By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy.</p>
        <p className="text-slate-600 leading-relaxed">The Platform provides a marketplace where persons who seek food, goods, or delivery services (&ldquo;Customers&rdquo;) can be matched with third-party vendors (&ldquo;Vendors&rdquo;) and independent delivery service providers (&ldquo;Riders&rdquo;).</p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility & Account",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">You must be at least 18 years old to use the GrabGo Platform. By creating an account, you represent and warrant that you meet this requirement and that all information you provide is accurate and complete.</p>
        <p className="text-slate-600 leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized use of your account.</p>
      </>
    ),
  },
  {
    id: "services",
    title: "3. Delivery Terms",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">GrabGo acts as a technology platform connecting Customers with Vendors and Riders. We do not guarantee delivery times, as they depend on factors including distance, traffic, and Vendor preparation time.</p>
        <p className="text-slate-600 leading-relaxed">Delivery fees are calculated based on distance, surge pricing, and applicable service fees. All fees will be displayed transparently before you confirm your order.</p>
      </>
    ),
  },
  {
    id: "payments",
    title: "4. Payments & Refunds",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">By placing an order, you authorize GrabGo to charge the payment method on file for the total amount including item costs, delivery fees, and applicable taxes.</p>
        <p className="text-slate-600 leading-relaxed">Refunds are issued in accordance with our Refund Policy. Orders canceled before a Vendor begins preparation are eligible for a full refund. Partial refunds may apply once preparation has begun.</p>
      </>
    ),
  },
  {
    id: "conduct",
    title: "5. Acceptable Use",
    content: (
      <>
        <p className="text-slate-600 leading-relaxed mb-4">You agree not to use the Platform for any unlawful purpose or in any way that could harm GrabGo, its users, Vendors, or Riders. Prohibited activities include but are not limited to:</p>
        <ul className="space-y-2 text-slate-600">
          {["Placing fraudulent orders or providing false information.", "Harassing, threatening, or abusing Riders, Vendors, or GrabGo staff.", "Attempting to circumvent the Platform's payment systems.", "Using the Platform to transmit spam or malicious content."].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <svg className="w-4 h-4 text-[#fe6132] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    title: "6. Limitation of Liability",
    content: (
      <p className="text-slate-600 leading-relaxed">To the fullest extent permitted by law, GrabGo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform, even if GrabGo has been advised of the possibility of such damages. Our total liability to you shall not exceed the amount paid by you for the specific transaction giving rise to the claim.</p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased min-h-screen">
      <Navbar links={LEGAL_NAV} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Legal Center</h3>
                <nav className="space-y-1">
                  {legalLinks.map(({ href, label, active }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${active ? "bg-[#fe6132]/10 text-slate-900 font-bold border-l-4 border-[#fe6132]" : "text-slate-600 hover:bg-slate-100 font-medium"}`}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="bg-[#fe6132]/5 p-4 rounded-xl border border-[#fe6132]/10">
                <h4 className="text-sm font-bold mb-2">Need help?</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Have questions about our legal terms? Our support team is here to help.</p>
                <Link className="text-xs font-bold text-[#fe6132] hover:underline flex items-center gap-1" href="/contact">
                  Contact Support →
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 max-w-4xl">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-[#fe6132] font-bold text-sm mb-4">
                <span>Last Updated: October 24, 2023</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Terms of Service</h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                Please read these Terms of Service carefully before using the GrabGo platform. These Terms constitute a legally binding agreement between you and GrabGo.
              </p>
            </div>

            <div className="space-y-12">
              {sections.map(({ id, title, content }) => (
                <section key={id} id={id} className="scroll-mt-28">
                  <h2 className="text-2xl font-bold border-b border-slate-200 pb-4 mb-6 text-slate-900">{title}</h2>
                  {content}
                </section>
              ))}

              <div className="bg-slate-900 text-white p-8 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Questions about these Terms?</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">If you have any questions about these Terms of Service, please contact our legal team at legal@grabgo.com or reach out to our support team.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#fe6132] text-[#1a0f0a] font-bold rounded-xl hover:brightness-105 transition-all">
                  Contact Support
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
