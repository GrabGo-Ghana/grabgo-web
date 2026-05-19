"use client"
import { FaGooglePlay, FaApple } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Image from 'next/image'

const Downloadapp = () => {
  return (
    <div className='bg-white py-20'>
      <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>

        {/* Headline */}
        <motion.h2
          className='text-3xl sm:text-4xl lg:text-5xl text-center text-[color-text-main] font-black mb-4 tracking-tight'
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          Grab it and Go!
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          className='text-lg text-center text-[color-text-muted] max-w-xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          Download the GrabGo app and get exclusive deals!
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-row justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <a href="#" className="flex items-center gap-3 bg-[#fe6132] text-white px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-4 rounded-full font-medium hover:opacity-90 transition">
            <FaGooglePlay size={18} />
            <span className="text-sm font-semibold">Get on Android</span>
          </a>
          <a href="#" className="flex items-center gap-2 bg-[#fe6132] text-white px-3 py-3 sm:px-5 sm:py-4 lg:px-7 lg:py-4 rounded-full font-medium hover:opacity-90 transition">
            <FaApple size={18} />
            <span className="text-sm font-semibold">Get on iPhone</span>
          </a>
        </motion.div>

        {/* Mockup Image */}
        <motion.div
          className="mt-10 w-full flex justify-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.25, 1], delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Image
            src="/media/home.png"
            alt="GrabGo Mockup"
            width={672}
            height={500}
            className='w-full max-w-2xl object-contain'
            priority={false}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Downloadapp