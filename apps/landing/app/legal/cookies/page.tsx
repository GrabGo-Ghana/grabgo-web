import type { Metadata } from "next";
import Link from "next/link";
import { HomeNavbar } from "@/components/Navbar";
import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo | Cookie Policy",
};

const LEGAL_NAV = [
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
  { href: "/about", label: "About Us" },
];

const tocItems = [
  { href: "#what-are", label: "What are cookies?" },
  { href: "#how-we-use", label: "How we use them" },
  { href: "#types", label: "Types of cookies" },
  { href: "#third-party", label: "Third-party cookies" },
  { href: "#managing", label: "Managing preferences" },
];

const cookieTypes = [
  { category: "Strictly Necessary", purpose: "Essential for site navigation and secure login features.", expiry: "Session" },
  { category: "Performance", purpose: "Helps us understand how visitors interact with our platform anonymously.", expiry: "2 years" },
  { category: "Functional", purpose: "Remembers your settings such as language preference or location.", expiry: "1 year" },
  { category: "Marketing", purpose: "Used to deliver advertisements more relevant to you and your interests.", expiry: "90 days" },
];

export default function CookiesPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
      <HomeNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:px-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
          <Link className="hover:text-[#fe6132] transition-colors" href="/">Home</Link>
          <span>›</span>
          <Link className="hover:text-[#fe6132] transition-colors" href="/legal/terms">Legal</Link>
          <span>›</span>
          <span className="text-slate-900">Cookie Policy</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 lg:p-16 mb-12 text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-[#fe6132] via-transparent to-[#fe6132]/30" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-[#fe6132]/20 text-[#fe6132] text-xs font-bold tracking-widest uppercase rounded-full mb-6">
              Legal Documentation
            </span>
            <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">Cookie Policy</h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed mb-8">
              Last Updated: October 20, 2023. This policy explains how GrabGo uses cookies and similar technologies to recognize you when you visit our platform.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#fe6132] text-[#1a0f0a] font-bold rounded-xl hover:scale-105 transition-transform">
              Manage Cookie Preferences
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-28 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 mb-4">Table of Contents</h3>
              {tocItems.map(({ href, label }, i) => (
                <a
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${i === 0 ? "bg-[#fe6132]/10 text-[#fe6132] border border-[#fe6132]/20 font-bold" : "hover:bg-slate-100 text-slate-600"}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12 text-slate-600 leading-relaxed">
            <section id="what-are" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
                <span className="size-2 rounded-full bg-[#fe6132] shrink-0" />
                What are cookies?
              </h2>
              <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
              <p className="mt-4">Cookies set by the website owner (in this case, GrabGo) are called &ldquo;first-party cookies&rdquo;. Cookies set by parties other than the website owner are called &ldquo;third-party cookies&rdquo;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).</p>
            </section>

            <section id="how-we-use" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
                <span className="size-2 rounded-full bg-[#fe6132] shrink-0" />
                How we use them
              </h2>
              <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as &ldquo;essential&rdquo; or &ldquo;strictly necessary&rdquo; cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Sections.</p>
            </section>

            <section id="types" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
                <span className="size-2 rounded-full bg-[#fe6132] shrink-0" />
                Types of cookies we use
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Category</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Purpose</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cookieTypes.map(({ category, purpose, expiry }) => (
                      <tr key={category}>
                        <td className="p-4 font-bold text-slate-900">{category}</td>
                        <td className="p-4">{purpose}</td>
                        <td className="p-4 italic">{expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="third-party" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
                <span className="size-2 rounded-full bg-[#fe6132] shrink-0" />
                Third-party cookies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Analytics Partners", desc: "We use Google Analytics to help us understand how our customers use the site. You can opt-out via their browser extension." },
                  { title: "Advertising Partners", desc: "Partners like Meta and AdRoll allow us to serve relevant advertisements to users based on their past visits to GrabGo." },
                ].map(({ title, desc }) => (
                  <div key={title} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-lg text-slate-900 mb-3">{title}</h4>
                    <p className="text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="managing" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-slate-900">
                <span className="size-2 rounded-full bg-[#fe6132] shrink-0" />
                Managing preferences
              </h2>
              <div className="bg-[#fe6132]/5 border border-[#fe6132]/20 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Take control of your data</h3>
                    <p>You can choose which non-essential cookies we&apos;re allowed to use. These settings will be saved for your current browser and device.</p>
                  </div>
                  <div className="flex shrink-0 gap-3">
                    <button className="px-6 py-3 border-2 border-[#fe6132] text-[#fe6132] font-bold rounded-xl hover:bg-[#fe6132]/10 transition-colors">
                      Reject All
                    </button>
                    <button className="px-6 py-3 bg-[#fe6132] text-[#1a0f0a] font-bold rounded-xl shadow-lg shadow-[#fe6132]/20 hover:brightness-105 transition-all">
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}
