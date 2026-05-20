import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import TriCTA from "@/components/TriCTA"
import HowItWorks from "@/components/HowitWorks"
import FAQ from "@/components/Faq"
import DownloadApp from "@/components/DownloadApp"
import Tracking from "@/components/Tracking"
import Contacts from "@/components/Contacts"
import AboutUs from "@/components/About"

export default function HomePage() {
  return (
    <div className="bg-[#fafafa] text-[#2a2a2a] antialiased">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="customers">
          <DownloadApp />
        </section>
        <section id="howitworks">
          <HowItWorks />
        </section>
        <section >
          <Tracking />
        </section>
        <section >
          <TriCTA />
        </section>
        <section id="aboutus">
          <AboutUs />
        </section>
        <section id="faqs">
          <FAQ />
        </section>
        <section id="contact">
          <Contacts />
        </section>
      </main>
      <Footer />
    </div>
  )
}