import type { Metadata } from "next";
import Link from "next/link";

import { SimpleFooter } from "@/components/Footer";

export const metadata: Metadata = {
  title: "GrabGo Services | Everything Delivered Fast",
};

const SERVICES_NAV = [
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendors" },
  { href: "/rider", label: "Riders" },
  { href: "/about", label: "About" },
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[#fe6132] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const steps = [
  { num: "1", Icon: () => (
    <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
    </svg>
  ), label: "1. Browse" },
  { num: "2", Icon: () => (
    <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ), label: "2. Order" },
  { num: "3", Icon: () => (
    <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  ), label: "3. Track" },
  { num: "4", Icon: () => (
    <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ), label: "4. Enjoy" },
];

const services = [
  {
    title: "Food Delivery",
    desc: "On-demand service from your local favorites. Fast, hot, and straight to your door.",
    features: ["Real-time tracking included", "Average 25 min delivery", "24/7 Availability"],
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
  },
  {
    title: "Scheduled Orders",
    desc: "Plan ahead up to 7 days in advance. Perfect for recurring meals or event planning.",
    features: ["Plan up to 7 days out", "Recurring order options", "Reminder notifications"],
    img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600",
  },
  {
    title: "Group Orders",
    desc: "Shared baskets for teams and social gatherings. Simplify lunch for the whole office.",
    features: ["Split bills instantly", "Collaborative basket link", "Team budgeting tools"],
    img: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600",
    comingSoon: true,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#fff9f4] text-slate-900 antialiased">
     

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fe6132]/10 border border-[#fe6132]/20 text-[#fe6132] text-sm font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe6132] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fe6132]" />
                </span>
                New Features Available
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
                Everything you need, delivered{" "}
                <span className="text-[#fe6132] underline decoration-[#fe6132]/30 underline-offset-8">exactly</span>{" "}
                when you want it.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl font-medium">
                Connecting you with your favorite local vendors and riders for seamless, lightning-fast delivery across the city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#fe6132] text-slate-900 text-lg font-bold px-10 py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-xl shadow-[#fe6132]/20">
                  Start Ordering Now
                </button>
                <button className="bg-white border border-slate-200 text-lg font-bold px-10 py-4 rounded-xl hover:bg-slate-50 transition-colors">
                  View All Vendors
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#fe6132]/20 rounded-full blur-[100px] -z-10" />
              <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
                  alt="Courier delivering fresh food"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[240px]">
                <div className="flex items-center gap-3 mb-2">
                  <CheckIcon />
                  <span className="text-sm font-bold">Express Delivery</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Over 500+ local partners ready to deliver to your doorstep in under 30 mins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="bg-white py-20 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-center gap-8 md:gap-4">
              {steps.map(({ Icon, label }, i) => (
                
                  <div key={label} className="flex flex-col items-center text-center gap-4 flex-1 min-w-[150px]">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon />
                    </div>
                    <h4 className="font-bold text-lg">{label}</h4>
                  </div>
                
                     
                  
                
              ))}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Our Specialized Services</h2>
              <p className="text-slate-600 font-medium">Choose the way you want to receive your orders. We offer flexibility for every occasion.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map(({ title, desc, features, img, comingSoon }) => (
                <div
                  key={title}
                  className={`group relative bg-white p-8 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 ${
                    comingSoon
                      ? "bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#fe6132]/50"
                      : "border-slate-200 hover:border-[#fe6132]/30"
                  }`}
                >
                  {comingSoon && (
                    <div className="absolute top-6 right-6">
                      <span className="px-3 py-1 bg-[#fe6132] text-slate-900 text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className={`w-full aspect-video rounded-2xl mb-8 overflow-hidden bg-slate-100 ${comingSoon ? "grayscale" : ""}`}>
                    <img src={img} alt={title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-2xl font-extrabold tracking-tight ${comingSoon ? "opacity-70" : ""}`}>{title}</h3>
                    <p className={`font-medium leading-relaxed ${comingSoon ? "text-slate-500" : "text-slate-600"}`}>{desc}</p>
                    <ul className={`space-y-3 pt-2 ${comingSoon ? "opacity-50" : ""}`}>
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm font-semibold">
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="bg-[#1a0f0a] text-white rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-center space-y-8">
              <div className="absolute inset-0 bg-[#fe6132]/10 pointer-events-none" />
              <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-[#fe6132]/20 rounded-full blur-[120px]" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight relative z-10">
                Ready to eat?<br />Join GrabGo today.
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto relative z-10">
                Download the app or use our web platform to start browsing thousands of options near you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <button className="w-full sm:w-auto bg-[#fe6132] text-slate-900 text-lg font-bold px-12 py-5 rounded-2xl hover:brightness-110 hover:scale-105 transition-all shadow-xl shadow-[#fe6132]/20">
                  Go to Web App
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SimpleFooter />
    </div>
  );
}
