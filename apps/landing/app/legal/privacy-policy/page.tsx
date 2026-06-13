import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

const sections = [
  {
    title: "1. What Information Do We Collect?",
    content: "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us. We also automatically collect certain information when you visit, use, or navigate the Services. This information may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Services. We do not process sensitive personal information."
  },
  {
    title: "2. How Do We Process Your Information?",
    content: "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your personal information only when we have a valid legal reason to do so, including to fulfill our contractual obligations to you, to comply with our legal obligations, to protect your vital interests, and where it is in our legitimate interests to do so."
  },
  {
    title: "3. When and With Whom Do We Share Your Personal Information?",
    content: "We may share your personal information in the following situations: Business Transfers — we may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. Affiliates — we may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Notice. Business Partners — we may share your information with our business partners to offer you certain products, services, or promotions."
  },
  {
    title: "4. Do We Use Cookies and Other Tracking Technologies?",
    content: "We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions. We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising purposes."
  },
  {
    title: "5. How Do We Handle Your Social Logins?",
    content: "Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider, including your name, email address, friends list, and profile picture. We will use the information we receive only for the purposes described in this Privacy Notice."
  },
  {
    title: "6. Is Your Information Transferred Internationally?",
    content: "We may transfer, store, and process your information in countries other than your own. Regardless of your location, please be aware that your information may be transferred to, stored by, and processed by us in our facilities and in the facilities of the third parties with whom we may share your personal information. We will take all necessary measures to protect your personal information in accordance with this Privacy Notice and applicable law."
  },
  {
    title: "7. How Long Do We Keep Your Information?",
    content: "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or securely store it and isolate it from any further processing until deletion is possible."
  },
  {
    title: "8. Do We Collect Information From Minors?",
    content: "We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records."
  },
  {
    title: "9. What Are Your Privacy Rights?",
    content: "Depending on your location, you may have certain rights regarding your personal information, including the right to review, change, or terminate your account at any time. You have the right to withdraw your consent to our processing of your personal information at any time by contacting us using the contact details provided in this Privacy Notice. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases."
  },
  {
    title: "10. Controls for Do-Not-Track Features",
    content: "Most web browsers and some mobile operating systems include a Do-Not-Track (\"DNT\") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online."
  },
  {
    title: "11. Do We Make Updates to This Notice?",
    content: "Yes, we will update this notice as necessary to stay compliant with relevant laws. We may update this Privacy Notice from time to time. The updated version will be indicated by an updated date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification."
  },
  {
    title: "12. How Can You Contact Us About This Notice?",
    content: "If you have questions or comments about this notice, you may contact us at: GrabGo, Accra, Greater Accra Region 00233, Ghana. Phone: (+233)536997662. Email: hello@grabgogh.app."
  },
  {
    title: "13. How Can You Review, Update, or Delete the Data We Collect From You?",
    content: "Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. To request to review, update, or delete your personal information, please contact us at hello@grabgogh.app."
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fafafa] antialiased text-[#111827] pt-32 pb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-12 border-b border-slate-200 pb-8">
            <p className="text-[#fe6132] text-sm font-black uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-sm">Last updated: 2026</p>
          </div>

          {/* Intro */}
          <div className="mb-10 space-y-4">
            <p className="text-lg text-slate-600 leading-relaxed">
              This Privacy Notice for GrabGo ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share your personal information when you use our services, including when you visit our website at{" "}
              <a href="https://grabgogh.app" className="text-[#fe6132] underline">https://grabgogh.app</a>{" "}
              or use our mobile applications GrabGo, GrabGo Rider, and GrabGo Vendor.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. You can contact us at{" "}
              <a href="mailto:hello@grabgogh.app" className="text-[#fe6132] underline">hello@grabgogh.app</a>.
            </p>
          </div>

          {/* Summary Box */}
          <div className="bg-[#fe6132]/5 border border-[#fe6132]/20 rounded-2xl p-6 mb-12">
            <h2 className="text-lg font-black text-[#fe6132] mb-3 uppercase tracking-widest">Summary of Key Points</h2>
            <ul className="space-y-2 text-slate-600 text-sm leading-relaxed list-disc list-inside">
              <li>We collect personal information you provide to us and some information automatically.</li>
              <li>We do not process sensitive personal information.</li>
              <li>We may collect information from third parties such as public databases and social media platforms.</li>
              <li>We process your information to provide, improve, and administer our Services.</li>
              <li>We may share information in specific situations with specific third parties.</li>
              <li>You may review, change, or terminate your account at any time.</li>
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
        </div>
      </div>
      <Footer />
    </>
  )
}