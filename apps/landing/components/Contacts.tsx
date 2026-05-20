"use client"
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GrabGo | Contact Support",
};

export default function ContactPage() {
  return (
    <div id="contact" className="bg-[#fafafa] antialiased min-h-screen py-3 flex flex-col scroll-mt-24">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        
        {/* Parent rounded rectangle */}
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
          
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Get in Touch
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Have a question or partnership inquiry? We'd love to hear from you.
            </p>
          </div>

          {/* Render the Client-Side Form handling functionality */}
          <ContactForm />

        </div>
      </main>
    </div>
  );
}

// Inline Client Component to manage form state and submission actions

import { useState, FormEvent } from "react";

function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);

    // Swap 'YOUR_FORMSPREE_ID' with your actual token code from formspree.io
    const response = await fetch("https://formspree.io", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setStatus("success");
      e.currentTarget?.reset();
    } else {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input 
          name="name"
          required
          className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400" 
          placeholder="Your name" 
          type="text" 
        />
        <input 
          name="email"
          required
          className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400" 
          placeholder="your@email.com" 
          type="email" 
        />
      </div>
      
      <input 
        name="phone"
        className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400" 
        placeholder="Your phone number" 
        type="tel" 
      />
      
      <textarea 
        name="message"
        required
        className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400 resize-none" 
        placeholder="Your message" 
        rows={5} 
      />
      
      <button 
        disabled={status === "sending"}
        className="w-full py-4 bg-[#fe6132] text-white font-bold text-lg rounded-2xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer text-center" 
        type="submit"
      >
        {status === "sending" ? "Sending Message..." : "Send Message"}
      </button>

      {/* Success Notification */}
      {status === "success" && (
        <p className="text-center text-emerald-600 font-semibold mt-4">
          Medaase! Your message has been sent successfully. We'll get back to you soon.
        </p>
      )}

      {/* Error Notification */}
      {status === "error" && (
        <p className="text-center text-rose-600 font-semibold mt-4">
          Oops! Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
