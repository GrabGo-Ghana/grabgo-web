"use client"
import Link from "next/link"
import { ShoppingBasket, Store, Bike, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const cards = [
  {
    icon: ShoppingBasket,
    color: "#fe6132",
    bg: "#fff0eb",
    title: "For Customers",
    desc: "Hungry? Get the your favorite meals delivered to your door in minutes.",
    cta: "Start Shopping",
    href: "/customer",
  },
  {
    icon: Store,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    title: "For Vendors",
    desc: "Expand your reach and grow your sales with our seamless logistics platform.",
    cta: "Partner With Us",
    href: "/vendor",
  },
  {
    icon: Bike,
    color: "#22c55e",
    bg: "#dcfce7",
    title: "For Riders",
    desc: "Be your own boss. Earn competitive rates on your own schedule with GrabGo.",
    cta: "Start Riding",
    href: "/rider",
  },
]

export default function TriCTA() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[color-text-main] tracking-tight">
            Join Our Network
          </h1>
          <p className="mt-4 text-lg text[color-text-muted]">
            Our platform connects hungry customers, reliable riders and top-tier local vendors. 
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map(({ icon: Icon, color, bg, title, desc, cta, href }) => (
            <motion.div
              key={title}
              className="group p-7 rounded-3xl bg-white border border-slate-100 shadow-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: bg }}
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  scale: 1.15,
                  transition: { duration: 0.4, ease: "easeInOut" },
                }}
              >
                <Icon style={{ color }} className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl text-[color-text-main] font-bold mb-3">{title}</h3>
              <p className="text-[color-text-muted] mb-6">{desc}</p>
              <Link
                className="inline-flex items-center font-bold gap-1 group-hover:gap-2 transition-all"
                style={{ color }}
                href={href}
              >
                {cta} <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}