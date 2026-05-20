import { Search, CreditCard, MapPin } from "lucide-react"

const steps = [
  { num: "1", label: "Choose", desc: "Browse through thousands of local restaurants and stores at your fingertips.", Icon: Search },
  { num: "2", label: "Pay", desc: "Securely checkout with your preferred payment method. It's fast and easy.", Icon: CreditCard },
  { num: "3", label: "Track", desc: "Watch your order arrive in real-time with our advanced GPS tracking system.", Icon: MapPin },
]

export default function HowItWorks() {
  return (
    <section className="py-15 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl font-black mb-4 text-[#111827]">Ordering made simple</h2>
        <p className="text-[#4b5563]">From cravings to doorstep in three easy steps.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-[#fe6132] -translate-y-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
          {steps.map(({ num, label, desc, Icon }) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-[#fe6132] shadow-xl flex items-center justify-center mb-8 relative">
                <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-[#fe6132] text-white font-black flex items-center justify-center text-sm">
                  {num}
                </span>
                <Icon className="w-10 h-10 text-[#fe6132]" />
              </div>
              <h3 className="text-xl font-bold mb-4">{label}</h3>
              <p className="text-[#4b5563]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}