import { HomeNavbar } from "@/components/Navbar"
import { HomeFooter } from "@/components/Footer"
import  Hero  from "@/components/Hero"
import TriCTA from "@/components/TriCTA"
import HowItWorks from "@/components/HowitWorks"
import FAQ from "@/components/Faq"
import DownloadApp from "@/components/DownloadApp"
import Tracking from "@/components/Tracking"

export default function HomePage() {
  return (
    <div className="bg-[#fafafa] text - [#2a2a2a] antialiased">
      <HomeNavbar />
      <main>
        <Hero />
        <TriCTA />
        <DownloadApp />
        <HowItWorks />
        <Tracking image={""} title={"Track your Order!"} description={"Track your order in real-time and never worry about where it is."} />
        <FAQ />
      </main>
      <HomeFooter />
    </div>
  )
}