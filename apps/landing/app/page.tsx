import Navbar  from "@/components/Navbar"
import { HomeFooter } from "@/components/Footer"
import Hero from "@/components/Hero"
import TriCTA from "@/components/TriCTA"
import HowItWorks from "@/components/HowitWorks"
import FAQ from "@/components/Faq"
import DownloadApp from "@/components/DownloadApp"
import Tracking from "@/components/About"
import Contacts from "@/components/Contacts"

export default function HomePage() {
  return (
    <div className="bg-[#fafafa] text-[#2a2a2a] antialiased">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <TriCTA />
        </section>
        <section id="riders">
          <DownloadApp />
        </section>
        <section id="vendors">
          <HowItWorks />
        </section>
        <section id="about-us">
          <Tracking />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="contact">
          <Contacts />
        </section>
      </main>
      <HomeFooter />
    </div>
  )
}