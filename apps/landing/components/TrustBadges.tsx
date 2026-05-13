const badges = [
  ["FOODIE", "HUB"],
  ["STORE", "SYNC"],
  ["METRO", "GO"],
  ["QUICK", "PAY"],
]

export default function TrustBadges() {
  return (
    <section className="py-12 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
          {badges.map(([a, b]) => (
            <span key={a} className="text-2xl font-black text-slate-900">
              {a}<span className="text-[#fe6132]">{b}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}