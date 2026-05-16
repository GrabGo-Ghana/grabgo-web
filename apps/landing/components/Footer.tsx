import Link from "next/link";
import { FaTwitter } from "react-icons/fa";

const InstagramIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
    <rect height="17" rx="4.8" width="17" x="3.5" y="3.5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.5" cy="6.8" fill="currentColor" r="1.1" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.5 8.8V7.7c0-.6.4-.9 1-.9H16V4h-2.1C11.7 4 10 5.5 10 7.9V8.8H8v3h2V20h3v-8.2h2.3l.4-3H13.5z" />
  </svg>
);

const TikTokIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.6 3h3.1c.2 1.2 1.1 2.3 2.3 2.8v3.1c-1.2 0-2.4-.4-3.5-1.1v6.5a5.2 5.2 0 1 1-5.2-5.2c.2 0 .5 0 .7.1V12c-.2-.1-.5-.1-.7-.1a2.2 2.2 0 1 0 2.2 2.2V3z" />
  </svg>
);

const X = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.6 3h3.1c.2 1.2 1.1 2.3 2.3 2.8v3.1c-1.2 0-2.4-.4.3.5-1.1v6.5a5.2 5.2 0 1 1-5.2-5.2c.2 0 .5 0 .7.1V12c-.2-.1-.5-.1-.7-.1a2 2.2 0 1 0 2.2 2.2V3z" />
  </svg>
)

const GooglePlayIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
    <path d="M2.4 1.6L13.9 12 2.4 22.4V1.6z" fill="#00A0FF" />
    <path d="M2.4 1.6l8 7.2 3.5-3.4L2.4 1.6z" fill="#00C853" />
    <path d="M13.9 12l3.1-2.9 3.9 2.2c1 .6 1 1.9 0 2.4L17 15z" fill="#FFEB3B" />
    <path d="M2.4 22.4l8-7.2 3.5 3.4-11.5 3.8z" fill="#FF3D00" />
  </svg>
);

const AppleIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.182.008c0 1.066-.78 2.35-2.026 2.35-.014-1.096.793-2.35 2.026-2.35zm2.039 8.858c.018 2.151 1.884 2.867 1.905 2.876-.015.05-.297 1.02-.98 2.02-.59.866-1.203 1.73-2.167 1.748-.946.017-1.25-.56-2.334-.56-1.084 0-1.422.543-2.316.578-.93.035-1.64-.93-2.236-1.79-1.22-1.764-2.154-4.987-.901-7.164.623-1.082 1.737-1.768 2.946-1.786.919-.018 1.786.62 2.334.62.547 0 1.575-.767 2.654-.654.451.019 1.717.182 2.53 1.373-.066.04-1.51.88-1.495 2.739z" />
  </svg>
);

/** Full footer used on the home page */
export function HomeFooter() {
  return (
    <>
      <div aria-hidden="true" className="footer-top-curve" />
      <footer className="bg-[#1a1a1a] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <img src="media/logo.svg" alt="GrabGo Logo" className="w-10 h-10 md:mr-1" />
              <span className="text-3xl font-bold tracking-tight text-white">GrabGo</span>
            </div>
            <p className="text-white text-sm max-w-xs">
              Building the future of local commerce through efficient delivery and strong community partnerships.
            </p>
            <div className="flex gap-4">
              <a aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/14 flex items-center justify-center hover:bg-white transition-colors group" href="https://www.instagram.com" rel="noopener noreferrer" target="_blank">
                <span className="text-white group-hover:text-[#fe6132]"><InstagramIcon /></span>
              </a>
              <a aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/14 flex items-center justify-center hover:bg-white transition-colors group" href="https://www.facebook.com" rel="noopener noreferrer" target="_blank">
                <span className="text-white group-hover:text-[#fe6132]"><FacebookIcon /></span>
              </a>
              <a aria-label="TikTok" className="w-10 h-10 rounded-full bg-white/14 flex items-center justify-center hover:bg-white transition-colors group" href="https://www.tiktok.com" rel="noopener noreferrer" target="_blank">
                <span className="text-white group-hover:text-[#fe6132]"><TikTokIcon /></span>
              </a>
              <a arial-label="X" className="w-10 h-10 rounded-full bg-white/14 flex items-center justify-center hover:bg-white transition-colors group" href="https://www.x.com" rel="noopener noreferrer" target="_blank">
                <span className="text-white group-hover:text-[#fe6132]"><FaTwitter /></span>
              </a>
            </div>
            <div className="space-y-3">
              <p className="text-[0.65rem] font-semibold uppercase tracking-tighter text-white/75">Download the app</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a className="inline-flex w-fit sm:inline-flex items-center gap-3  rounded-xl bg-white/10 px-4 py-2.5 transition-colors hover:bg-white group" href="https://play.google.com/store" rel="noopener noreferrer" target="_blank">
                  <GooglePlayIcon />
                  <span className="leading-tight">
                    <span className="block text-[0.62rem] text-white/80 group-hover:text-[#fe6132]/80">Get it on</span>
                    <span className="block text-sm font-bold text-white group-hover:text-[#fe6132]">Google Play</span>
                  </span>
                </a>
                <a className="inline-flex w-fit sm:inline-flex items-center gap-3  rounded-xl bg-white/10 px-4 py-2.5 transition-colors hover:bg-white group" href="https://www.apple.com/app-store/" rel="noopener noreferrer" target="_blank">
                  <span className="text-white group-hover:text-[#fe6132]"><AppleIcon /></span>
                  <span className="leading-tight">
                    <span className="block text-[0.62rem] text-white/80 group-hover:text-[#fe6132]/80">Download on the</span>
                    <span className="block text-sm font-bold text-white group-hover:text-[#fe6132]">App Store</span>
                  </span>
                </a>
              </div>
            </div>
          </div>


          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-white/85 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/about">About Us</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/about">For Vendors</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/about">For Riders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Help Center</h4>
            <ul className="space-y-4 text-white/85 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/faq">Faq</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/contact">Contact</Link></li>

            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 text-white/85 text-sm">
              <li><Link className="hover:text-white transition-colors" href="/services">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/services">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-md text-[#f2f2f2] font-normal">
          <p>© 2026 GrabGo. All rights reserved.</p>
          <div className="flex gap-8">
          </div>
        </div>
      </footer>
    </>
  );
}


