const SearchIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
)

const PaymentsIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path strokeLinecap="round" d="M2 10h20" />
  </svg>
)

const TrackIcon = () => (
  <svg className="w-10 h-10 text-[#fe6132]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
  </svg>
)

const steps = [
  { num: "1", label: "Choose", desc: "Browse through thousands of local restaurants and stores at your fingertips.", Icon: SearchIcon },
  { num: "2", label: "Pay", desc: "Securely checkout with your preferred payment method. It's fast and easy.", Icon: PaymentsIcon },
  { num: "3", label: "Track", desc: "Watch your order arrive in real-time with our advanced GPS tracking system.", Icon: TrackIcon },
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#fff9f4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl font-black mb-4">Ordering made simple</h2>
        <p className="text-slate-600">From craving to doorstep in three easy steps</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-[#fe6132]/20 -translate-y-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
          {steps.map(({ num, label, desc, Icon }) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-[#fe6132] shadow-xl flex items-center justify-center mb-8 relative">
                <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#fe6132] text-white font-black flex items-center justify-center text-sm">
                  {num}
                </span>
                <Icon />
              </div>
              <h3 className="text-xl font-bold mb-4">{label}</h3>
              <p className="text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}