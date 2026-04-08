"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/services", label: "Deliver" },
  { href: "/vendor", label: "Partner" },
  { href: "/customer", label: "Order" },
];

const STANDARD_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/vendor", label: "Vendor" },
  { href: "/rider", label: "Rider" },
  { href: "/customer", label: "Customer" },
];

/** Floating pill navbar used on the home page */
export function HomeNavbar() {
  return (
    <header className="fixed inset-x-0 top-3 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-2.5"
          >
            <span className="text-[1.55rem] sm:text-[1.8rem] leading-none font-extrabold tracking-tight">
              <span className="text-slate-900">Grab</span>
              <span className="text-[#fe6132]">GO</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <Link
              href="/customer"
              className="hidden lg:inline-flex items-center px-3 py-2 text-sm font-semibold text-slate-700 rounded-full hover:bg-slate-50 transition-colors"
            >
              Download App
            </Link>
            <button className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold text-slate-700 rounded-full hover:bg-slate-50 transition-colors">
              Login
            </button>
            <button className="inline-flex px-5 py-2.5 bg-[#fe6132] text-white text-sm font-bold rounded-full hover:brightness-95 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/** Standard sticky glass navbar used on most inner pages */
export function Navbar({
  activeHref,
  links = STANDARD_NAV_LINKS,
}: {
  activeHref?: string;
  links?: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const active = activeHref ?? pathname;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-[#fe6132]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-[#fe6132] text-[#1a0f0a] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="font-extrabold tracking-tight text-slate-900">GrabGo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                active === href
                  ? "text-[#fe6132]"
                  : "hover:text-[#fe6132] transition-colors"
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="px-4 py-2 rounded-lg bg-[#fe6132] text-[#1a0f0a] text-sm font-bold hover:brightness-95 transition-all"
        >
          Get Support
        </Link>
      </div>
    </header>
  );
}
