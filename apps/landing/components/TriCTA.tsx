import Link from "next/link"

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const ShoppingBasketIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const StorefrontIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
  </svg>
)

const BikeIcon = () => (
  <svg className="w-8 h-8 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6h-3l-3 8m0 0l2-3h4l2 3M8 17.5l4-8 4 4" />
  </svg>
)

const cards = [
  {
    icon: <ShoppingBasketIcon />,
    title: "Order Now",
    desc: "Hungry? Get the best food and groceries delivered to your door in minutes.",
    cta: "Start Shopping",
    href: "/customer",
  },
  {
    icon: <StorefrontIcon />,
    title: "Become a Vendor",
    desc: "Expand your reach and grow your sales with our professional delivery fleet.",
    cta: "Partner With Us",
    href: "/vendor",
  },
  {
    icon: <BikeIcon />,
    title: "Join as Rider",
    desc: "Be your own boss. Earn competitive rates on your own schedule with GrabGo.",
    cta: "Start Riding",
    href: "/rider",
  },
]

export default function TriCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map(({ icon, title, desc, cta, href }) => (
            <div key={title} className="group p-8 rounded-3xl bg-[#fff9f4] border border-slate-100 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-white">
                {icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{title}</h3>
              <p className="text-slate-600 mb-6">{desc}</p>
              <Link className="inline-flex items-center text-[#fe6132] font-bold gap-1 group-hover:gap-2 transition-all" href={href}>
                {cta} <ChevronRightIcon />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}