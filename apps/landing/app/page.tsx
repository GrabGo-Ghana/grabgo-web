import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import Hero from "@/components/Hero"
import TriCTA from "@/components/TriCTA"
import HowItWorks from "@/components/HowitWorks"
import FAQ from "@/components/Faq"
import DownloadApp from "@/components/DownloadApp"
import Tracking from "@/components/Tracking"
import Contacts from "@/components/Contacts"
import About from "@/components/About"
import AboutUs from "@/components/About"


export default function HomePage() {
  return (
    <div className="bg-[#fafafa] text-[#2a2a2a] antialiased">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="download">
          <DownloadApp />
        </section>
        <section id="howitworks">
          <HowItWorks />
        </section>
        <section id="vendors">
          <Tracking />
        </section>
        <section id="riders">
          <TriCTA />
        </section>
        <section id="about us">
          <AboutUs />
        </section>
        <section id="faq">
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