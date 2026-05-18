"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div className={`border-b border-gray-200 py-5 transition-colors duration-300 ${isOpen ? 'bg-[#fe6132]/5 rounded-2xl px-6 -mx-6 border-transparent' : 'px-6 -mx-6'}`}>
      <button
        className="w-full flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#fe6132]' : 'text-gray-900 group-hover:text-[#fe6132]'}`}>
          {question}
        </span>
        <div className={`shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isOpen ? 'bg-[#fe6132] text-white rotate-180' : 'bg-white text-gray-400 group-hover:bg-[#fe6132]/10 group-hover:text-[#fe6132] border border-gray-100'}`}>
          <ChevronDown size={24} />
        </div>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden text-gray-600 text-lg leading-relaxed pr-12 font-medium">
          {answer}
        </div>
      </div>
    </div>
  )
}

const faqs = [
  { question: "How fast is the delivery?", answer: "Our lightning-fast logistics network ensures that most orders are delivered within 20-30 minutes. Real-time traffic monitoring and optimized routing help our riders get to you as quickly as possible." },
  { question: "Are there any hidden fees?", answer: "No, we believe in 100% transparency. The delivery fee and any applicable taxes are clearly displayed at checkout before you confirm your order. No surprises, ever." },
  { question: "Can I track my order in real-time?", answer: "Absolutely! Once your order is picked up by a rider, you can track their exact location on the live map in our app until it reaches your doorstep." },
  { question: "What if there is an issue with my order?", answer: "Our 24/7 customer support team is always ready to help. You can report an issue directly through the app, and we'll resolve it immediately with a refund or replacement." },
  { question: "Do you deliver late at night?", answer: "Yes! We have partners and riders operating 24/7 in most major cities. Whether it's a midnight snack or an early morning pharmacy run, we've got you covered." },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faqs" className="py-20 px-6 lg:px-20 max-w-250 mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-sm mb-6">
          <span>Support</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Got questions? We've got answers. Here is everything you need to know about GrabGo.</p>
      </div>
      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  )
}