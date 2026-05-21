import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const sections = [
  { 
    title: "What Are Cookies?", 
    content: "Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information. Cookies set by the website owner (in this case, GrabGo) are called \"first-party cookies.\" Cookies set by parties other than the website owner are called \"third-party cookies.\" Third-party cookies enable third-party features or functionality to be provided on or through the website, such as advertising, interactive content, and analytics." 
  },
  { 
    title: "Why Do We Use Cookies?", 
    content: "We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as \"essential\" or \"strictly necessary\" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our platform. Third parties serve cookies through our Website for advertising, analytics, and other purposes." 
  },
  { 
    title: "How Can I Control Cookies?", 
    content: "You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Preference Center. The Cookie Preference Center allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted." 
  },
  { 
    title: "How Can I Control Cookies on My Browser?", 
    content: "The means by which you can refuse cookies through your web browser controls vary from browser to browser. You should visit your browser's help menu for more information. Most major browsers including Chrome, Firefox, Safari, Edge, and Opera provide options to manage cookies. You can find browser-specific instructions by visiting the help pages for your preferred browser. In addition, most advertising networks offer you a way to opt out of targeted advertising through the Digital Advertising Alliance at http://www.aboutads.info/choices." 
  },
  { 
    title: "What About Other Tracking Technologies, Like Web Beacons?", 
    content: "Cookies are not the only way to recognize or track visitors to a website. We may use other similar technologies from time to time, like web beacons (sometimes called \"tracking pixels\" or \"clear gifs\"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us to monitor the traffic patterns of users, understand whether you have come to the website from an online advertisement, improve site performance, and measure the success of email marketing campaigns." 
  },
  { 
    title: "Do You Use Flash Cookies or Local Shared Objects?", 
    content: "Websites may also use so-called \"Flash Cookies\" (also known as Local Shared Objects or \"LSOs\") to collect and store information about your use of our services, fraud prevention, and for other site operations. If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools in the Website Storage Settings Panel. Please note that restricting Flash Cookies may reduce or impede the functionality of some Flash applications." 
  },
  { 
    title: "Do You Serve Targeted Advertising?", 
    content: "Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these." 
  },
  { 
    title: "How Often Will You Update This Cookie Policy?", 
    content: "We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated." 
  },
  { 
    title: "Where Can I Get Further Information?", 
    content: "If you have any questions about our use of cookies or other technologies, please email us at contact@grabgogh.com or by post to: GrabGo, Accra, Greater Accra Region 00233, Ghana. Phone: (+233)536997662." 
  },
]

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fafafa] antialiased text-[#111827] pt-32 pb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12 border-b border-slate-200 pb-8">
            <p className="text-[#fe6132] text-sm font-black uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-slate-500 text-sm">Last updated: May 20, 2026</p>
          </div>

          {/* Intro */}
          <div className="mb-10">
            <p className="text-lg text-slate-600 leading-relaxed">
              This Cookie Policy explains how GrabGo ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at{" "}
              <a href="https://grabgogh.com" className="text-[#fe6132] underline">https://grabgogh.com</a>. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#fe6132]/5 border border-[#fe6132]/20 rounded-2xl p-6 mb-12">
            <h2 className="text-lg font-black text-[#fe6132] mb-3 uppercase tracking-widest">Quick Summary</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed list-disc list-inside">
              <li>We use cookies to make our website work properly and to improve your experience.</li>
              <li>Some cookies are essential and cannot be disabled.</li>
              <li>You can control non-essential cookies through your browser settings.</li>
              <li>We may use third-party cookies for analytics and advertising.</li>
              <li>We may update this policy from time to time — check back regularly.</li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map(({ title, content }) => (
              <div key={title} className="border-b border-slate-100 pb-10">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mb-4">
                  {title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Box */}
          <div className="mt-12 bg-[#0f172a] rounded-2xl p-8 text-white">
            <h3 className="text-xl font-black mb-2">Still have questions?</h3>
            <p className="text-white/70 text-sm mb-4">Reach out to us and we'll be happy to help.</p>
            {/*  Fixed: Wrapped the floating attributes safely inside an opening <a tag */}
            <a 
              href="mailto:contact@grabgogh.com" 
              className="inline-flex items-center px-6 py-3 bg-[#fe6132] text-white font-bold rounded-full hover:opacity-90 transition text-sm"
            >
              Email Us
            </a>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
