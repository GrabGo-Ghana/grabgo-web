import type { Metadata } from "next";
import Navbar from "@/components/Navbar";


export const metadata: Metadata = {
  title: "GrabGo | Contact Support",
};

export default function ContactPage() {
  return (
    <div className="bg-[#fafafa] text-[color-text-muted] antialiased min-h-screen py-3 flex flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        
        {/* Parent rounded rectangle */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
          
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-[color-text-main]">
              Get in Touch
            </h1>
            <p className="text-[color-text-muted] mt-3 text-lg">
              Have a question or partnership inquiry? We'd love to hear from you.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-[color-text-muted] px-4 py-3 outline-none   placeholder:text-slate-400"
                placeholder="Your name"
                type="text"
              />
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none   placeholder:text-slate-400"
                placeholder="your@email.com"
                type="email"
              />
            </div>
            <input
              className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none  placeholder:text-slate-400"
              placeholder="Your phone number"
              type="tel"
            />
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none  placeholder:text-slate-400 resize-none"
              placeholder="Your message"
              rows={5}
            />
            <button
              className="w-full py-4 bg-[#fe6132] text-white font-bold text-lg rounded-2xl hover:opacity-90 transition"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </main> 
    </div>
    
  );
}