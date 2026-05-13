"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/services", label: "About Us" },
  { href: "/vendor", label: "Vendors" },
  { href: "/customer", label: "Riders" },
];

export function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">

          {/* Logo */}
          <Link
            href="/"
            className="inline-flex items-center justify-center md:justify-start rounded-full border border-slate-200 bg-white w-12 h-12 md:w-auto md:h-auto md:px-5 md:py-2.5"
          >
            <img src="/figma/grabgo-homepage/logo.svg" alt="GrabGo Logo" className="w-7 h-7 md:mr-3" />
            <span className="hidden md:block font-bold text-[#2a2a2a] text-xl">GrabGo</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-md font-semibold text-[#2a2a2a] hover:bg-[#fe6132] hover:text-white transition-colors px-4 py-2 rounded-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Download Button */}
          <div className="hidden md:flex items-center rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Link
              href="/customer"
              className="text-md font-semibold text-[#2a2a2a] hover:bg-[#fe6132] hover:text-white transition-colors px-6 py-3"
            >
              Download App
            </Link>
          </div>

          {/* Mobile Hamburger - only when menu is closed */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm"
            >
              <Menu size={20} className="text-[#2a2a2a]" />
            </button>
          )}

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed top-0 left-0 right-0 bottom-0 z-50 w-full h-full bg-white flex flex-col pt-24 px-6 py-3">

            {/* Logo inside menu */}
            <div className="absolute top-6 left-4">
              <Link href="/" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 bg-white">
                <img src="/figma/grabgo-homepage/logo.svg" alt="GrabGo Logo" className=" w-6 h-6" />
              </Link>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-4 py-3 flex items-center justify-center w-10 h-10 rounded-full bg-[#fe6132] shadow-sm "
            >
              <X size={20} className="text-white" />
            </button>

            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-md font-semibold text-[#2a2a2a] hover:bg-orange-50 hover:text-[#fe6132] transition-colors px-4 py-4 border-b border-gray-100"
              >
                {label}
              </Link>
            ))}
            <div className="mt-6">
              <Link
                href="/customer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 bg-[#fe6132] text-white text-md font-bold rounded-full hover:opacity-90 transition"
              >
                Download App
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}