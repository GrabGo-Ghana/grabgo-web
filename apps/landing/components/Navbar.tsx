"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


const NAV_LINKS = [
  { href: "/services", label: "About Us" },
  { href: "/vendor", label: "Vendors" },
  { href: "/customer", label: "Riders" },
];


export function HomeNavbar() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5"
          >
            <img src="/figma/grabgo-homepage/logo.svg" alt="GrabGo Logo" className="w-7 h-7 mr-1 " />
            <span className=" font-bold text-[#2a2a2a] text-md ">GrabGo</span>
          </Link>

          <nav className="hidden md:flex items-center ml-20 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm transition-colors ">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-md font-semibold text-[#2a2a2a] hover:text-slate-900 transition-colors px-4 py-2 rounded-full"
              >
                {label}
              </Link>
            ))}
          </nav>

        <div className="hidden md:flex items-center rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Link
            href="/customer"
            className="text-md font-semibold text-[#2a2a2a] hover:bg-[#fe6132] hover:text-white transition-colors px-6 py-3 rounded-full w-full h-full"
       >
        Download App
          </Link>
        </div>
        </div>
      </div>
    </header>
  );
}


