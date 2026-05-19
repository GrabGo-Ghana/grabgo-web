"use client"
import { motion } from "framer-motion"
import Image from "next/image"

export default function TriCTA() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-360 mx-auto px-6 lg:px-20 space-y-8">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight">
            Join Our Network
          </h1>
          <p className="mt-4 text-lg text-[#64748b]">
            Our platform connects hungry customers, reliable riders and top-tier local vendors.
          </p>
        </div>

        {/* Vendors Card */}
        <motion.div
          className="relative w-full rounded-3xl border border-[#d1d5db] bg-[#fafafa] overflow-hidden flex flex-col lg:flex-row-reverse lg:items-center lg:min-h-105"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <div className="flex-1 flex flex-col gap-6 text-[#0f172a] px-5 pt-10 pb-6 lg:px-12 lg:py-16 lg:pr-[45%]">
            <p className="text-[#fe6132] text-sm font-bold uppercase tracking-widest">For Vendors</p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Reach thousands of new customers.
            </h2>
            <p className="text-[#0f172a]/85 text-lg max-w-md leading-relaxed">
              Expand your reach and grow your sales with our seamless logistics platform. List your business and start getting orders today.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <a href="#" className="flex items-center gap-3 bg-white text-[#0f172a] px-5 py-3 rounded-full font-bold hover:opacity-90 transition shadow-md">
                Partner With Us
              </a>
            </div>
          </div>
          <div className="w-full h-72 sm:h-100 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] lg:h-full relative">
            <Image
              src="/media/vendor.png"
              alt="GrabGo Vendor App"
              fill
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Riders Card */}
        <motion.div
          className="relative w-full rounded-3xl border border-[#d1d5db] bg-[#fafafa] overflow-hidden flex flex-col lg:flex-row-reverse lg:items-center lg:min-h-105"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <div className="flex-1 flex flex-col gap-6 text-[#0f172a] px-5 pt-10 pb-6 lg:px-12 lg:py-16 lg:pr-[45%]">
            <p className="text-[#fe6132] text-sm font-bold uppercase tracking-widest">For Riders</p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              Be your own boss. Earn on your terms.
            </h2>
            <p className="text-[#0f172a]/85 text-lg max-w-md leading-relaxed">
              Join our rider network and earn competitive rates on your own schedule. Flexible hours, fast payouts, real income.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <a href="#" className="flex items-center gap-3 bg-white text-[#0f172a] px-5 py-3 rounded-full font-bold hover:opacity-90 transition shadow-md">
                Start Riding
              </a>
            </div>
          </div>
          <div className="w-full h-72 sm:h-100 lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-[40%] lg:h-full relative">
            <Image
              src="/media/rider.PNG"
              alt="GrabGo Rider App"
              fill
              className="object-fit object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}