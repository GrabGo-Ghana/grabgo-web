"use client"

import { useState, FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Ghanaian Phone Number Validation Logic (Supports +233, 233, or local 02x/05x/03x formats)
  const validateGhanaPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, ""); // Strip out accidental spacing
    const ghanaRegex = /^(?:\+?233|0)(?:[0-9])\d{7}$/;
    return ghanaRegex.test(cleanPhone);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhoneError("");
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const phoneNumber = formData.get("phone") as string;

    // Run Ghana Phone Validation Check
    if (phoneNumber && !validateGhanaPhone(phoneNumber)) {
      setPhoneError("Please enter a valid Ghana phone number (e.g., 024XXXXXXX or +23324XXXXXXX).");
      setStatus("");
      return;
    }

    // Post securely to your Formspree endpoint dashboard handler
    const response = await fetch("https://formspree.io", {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setStatus("success");
      setPhoneError("");
      e.currentTarget.reset(); // Clear out input rows after successful transmission
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
          className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-[#fe6132] focus:ring-1 focus:ring-[#fe6132]" 
          placeholder="Your name" 
          type="text" 
        />
        <input 
          name="email"
          required
          className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400 focus:border-[#fe6132] focus:ring-1 focus:ring-[#fe6132]" 
          placeholder="your@email.com" 
          type="email" 
        />
      </div>
      
      <div>
        <input 
          name="phone"
          required
          className={`w-full rounded-xl border bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400 focus:ring-1 ${
            phoneError ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:border-[#fe6132] focus:ring-[#fe6132]"
          }`} 
          placeholder="Your phone number (e.g. 0244123456)" 
          type="tel" 
        />
        {phoneError && (
          <p className="text-rose-500 text-xs mt-1.5 font-medium px-1">{phoneError}</p>
        )}
      </div>
      
      <textarea 
        name="message"
        required
        className="w-full rounded-xl border border-slate-200 bg-[#fafafa] text-slate-900 px-4 py-3 outline-none placeholder:text-slate-400 resize-none focus:border-[#fe6132] focus:ring-1 focus:ring-[#fe6132]" 
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

      {/* Delivery Status Messages */}
      {status === "success" && (
        <p className="text-center text-emerald-600 font-semibold mt-4">
          Medaase! Your message has been sent successfully. We'll get back to you soon.
        </p>
      )}

      {status === "error" && (
        <p className="text-center text-rose-600 font-semibold mt-4">
          Oops! Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
