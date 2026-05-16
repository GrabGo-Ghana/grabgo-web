"use client"
import { motion } from "framer-motion"
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
  { q: "How do I place an order on GrabGo?", a: "Download the GrabGo app, create an account, browse restaurants near you, add items to your cart and checkout. Your food will be on its way in minutes.", open: true },
  { q: "How fast is GrabGo delivery?", a: "Most orders arrive in 20-35 minutes depending on your location, traffic, and the restaurant's prep time." },
  { q: "What areas in Accra does GrabGo deliver to?", a: "GrabGo currently delivers across major areas in Accra including East Legon, Osu, Cantonments, Airport Residential, Tema and more. We are expanding rapidly." },
  { q: "What payment methods do you accept?", a: "We accept Mobile Money (MTN, Vodafone, AirtelTigo), card payments and cash on delivery." },
  { q: "What happens if my order is wrong or missing items?", a: "Contact our support team immediately through the app. We will resolve it quickly with a replacement or refund." },
  { q: "Can I cancel or modify my order after placing it?", a: "You can cancel or modify your order within 2 minutes of placing it. After that the restaurant will have started preparing your food." },
  { q: "Is GrabGo available 24/7?", a: "GrabGo operates based on restaurant hours. Many of our partner restaurants are open late. Check the app for live availability near you." },
  { q: "How do I contact GrabGo support?", a: "You can reach us through the in-app support chat, email us at support@grabgo.app or call our customer service line during business hours." },
]

export default function FAQ() {
  return (
    <motion.section className="py-20 overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 1, 0.25, 1], delay: 0.3 }}
      viewport={{ once: true, amount: 0.2 }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center w-full gap-12">
          <div className="space-y-5 text-3xl lg:text-5xl font-black tracking-tight text-[#2a2a2a] text-center">  
              Got questions before you order?
          </div>
          <div className="space-y-3">
            {faqItems.map(({ q, a, open }) => (
              <details key={q} className="group rounded-3xl lg:w-3xl border border-slate-200 bg-white p-10" open={open}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="font-bold text-[#2a2a2a]">{q}</span>
                  <ExpandMoreIcon />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}