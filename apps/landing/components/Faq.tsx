import Link from "next/link"

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const ExpandMoreIcon = () => (
  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const faqItems = [
  { q: "How fast is GrabGo delivery?", a: "Most orders arrive in 20-35 minutes depending on distance, traffic, and merchant prep time.", open: true },
  { q: "Can I schedule an order in advance?", a: "Yes. You can schedule selected orders ahead of time and choose your preferred delivery window." },
  { q: "What payment methods do you accept?", a: "GrabGo supports cards, mobile wallets, and cash on delivery in supported zones." },
  { q: "How do I track my order live?", a: "After checkout, open your order status page to see real-time rider location and delivery progress." },
]

export default function FAQ() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fe6132]">Quick FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              Got questions before you order?
            </h2>
            <p className="text-slate-600 max-w-md">
              Here are the most common things customers ask before placing their first order.
            </p>
            <Link
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fe6132] text-white font-bold text-sm hover:brightness-95 transition-all"
              href="/faq"
            >
              View Full FAQs <ChevronRightIcon />
            </Link>
          </div>
          <div className="space-y-3">
            {faqItems.map(({ q, a, open }) => (
              <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5" open={open}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="font-bold text-slate-900">{q}</span>
                  <ExpandMoreIcon />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}