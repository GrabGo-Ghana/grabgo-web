import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const sections = [
  {
    title: "1. Our Services",
    content: "The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable."
  },
  {
    title: "2. Intellectual Property Rights",
    content: "We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the \"Content\"), as well as the trademarks, service marks, and logos contained therein (the \"Marks\"). Our Content and Marks are protected by copyright and trademark laws and treaties around the world. The Content and Marks are provided in or through the Services \"AS IS\" for your personal, non-commercial use only."
  },
  {
    title: "3. User Representations",
    content: "By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 13; (5) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (6) you will not access the Services through automated or non-human means; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation."
  },
  {
    title: "4. User Registration",
    content: "You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable."
  },
  {
    title: "5. Products",
    content: "We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change."
  },
  {
    title: "6. Purchases and Payment",
    content: "We accept the following forms of payment: Paystack. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. All payments shall be in Ghana Cedis. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment."
  },
  {
    title: "7. Return Policy",
    content: "All sales are final and no refund will be issued."
  },
  {
    title: "8. Prohibited Activities",
    content: "You may not access or use the Services for any purpose other than that for which we make the Services available. As a user of the Services, you agree not to systematically retrieve data, trick or defraud other users, circumvent security features, disparage or harm us or the Services, use information to harass others, make improper use of support services, use the Services in a manner inconsistent with applicable laws, engage in unauthorized framing or linking, upload viruses or other malicious material, engage in automated use of the system, attempt to impersonate another user, or use the Services to compete with us."
  },
  {
    title: "9. User Generated Contributions",
    content: "The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality. Any Contributions you transmit may be treated as non-confidential and non-proprietary. You are responsible for ensuring your Contributions do not infringe on any third party rights, are not false or misleading, and comply with all applicable laws and regulations."
  },
  {
    title: "10. Contribution License",
    content: "By posting your Contributions to any part of the Services, you automatically grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt, and distribute such Contributions for any purpose."
  },
  {
    title: "11. Guidelines for Reviews",
    content: "When posting a review, you must have firsthand experience with the person/entity being reviewed. Your reviews should not contain offensive profanity, discriminatory references, references to illegal activity, or false or misleading statements. We may accept, reject, or remove reviews in our sole discretion."
  },
  {
    title: "12. Mobile Application License",
    content: "If you access the Services via the App, we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on wireless electronic devices owned or controlled by you. You shall not decompile, reverse engineer, disassemble, or decrypt the App; make any modification or derivative work; violate any applicable laws; or use the App for any revenue-generating endeavor for which it is not designed."
  },
  {
    title: "13. Services Management",
    content: "We reserve the right, but not the obligation, to monitor the Services for violations of these Legal Terms, take appropriate legal action against anyone who violates the law or these Legal Terms, and otherwise manage the Services in a manner designed to protect our rights and property."
  },
  {
    title: "14. Privacy Policy",
    content: "We care about data privacy and security. By using the Services, you agree to be bound by our Privacy Policy posted on the Services. Please be advised the Services are hosted in Ghana. If you access the Services from any other region of the world, through your continued use of the Services, you are transferring your data to Ghana and you expressly consent to have your data transferred to and processed in Ghana."
  },
  {
    title: "15. Copyright Infringements",
    content: "We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below."
  },
  {
    title: "16. Term and Termination",
    content: "These Legal Terms shall remain in full force and effect while you use the Services. We reserve the right to deny access to and use of the Services to any person for any reason, including breach of any representation, warranty, or covenant contained in these Legal Terms. If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account."
  },
  {
    title: "17. Modifications and Interruptions",
    content: "We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We cannot guarantee the Services will be available at all times and will not be liable for any loss, damage, or inconvenience caused by inability to access the Services."
  },
  {
    title: "18. Governing Law",
    content: "These Legal Terms shall be governed by and defined following the laws of Ghana. GrabGo and yourself irrevocably consent that the courts of Ghana shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms."
  },
  {
    title: "19. Dispute Resolution",
    content: "To expedite resolution and control the cost of any dispute, the Parties agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating arbitration. Any dispute arising out of or in connection with these Legal Terms shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber. The seat of arbitration shall be Accra, Ghana."
  },
  {
    title: "20. Corrections",
    content: "There may be information on the Services that contains typographical errors, inaccuracies, or omissions. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice."
  },
  {
    title: "21. Disclaimer",
    content: "THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT."
  },
  {
    title: "22. Indemnification",
    content: "You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of your Contributions, use of the Services, or breach of these Legal Terms."
  },
  {
    title: "23. User Data",
    content: "We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services."
  },
  {
    title: "24. Electronic Communications, Transactions, and Signatures",
    content: "Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing."
  },
  {
    title: "25. SMS Text Messaging",
    content: "By opting into any GrabGo text messaging program, you expressly consent to receive text messages (SMS) to your mobile number. If at any time you wish to stop receiving SMS messages from us, simply reply to the text with \"STOP.\" Message and data rates may apply. For support, reply with the keyword HELP or email us at hello@grabgogh.app."
  },
  {
    title: "26. Food Quality and Restaurant Responsibility",
    content: "Restaurants and vendors using the GrabGo platform are solely responsible for the preparation, quality, safety, packaging, labeling, and accuracy of the food and products they provide. GrabGo does not prepare, manufacture, or inspect food items listed on the platform. Customers with allergies or dietary restrictions are responsible for reviewing item descriptions and contacting the vendor directly before placing an order."
  },
  {
    title: "27. Delivery Delays and Order Availability",
    content: "Estimated delivery times provided through the GrabGo platform are approximate and may vary due to traffic conditions, weather, vendor preparation times, rider availability, or other unforeseen circumstances. GrabGo does not guarantee that orders will be delivered within a specific timeframe."
  },
  {
    title: "28. Fraud Prevention and Account Suspension",
    content: "GrabGo reserves the right to suspend, restrict, or permanently terminate any account involved in fraudulent, abusive, misleading, or suspicious activity. Prohibited activities include fake orders, payment fraud, abuse of promotions or referral programs, harassment of vendors or riders, and violations of applicable laws or these Terms."
  },
  {
    title: "29. Miscellaneous",
    content: "These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision."
  },
  {
    title: "30. Contact Us",
    content: "In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at: GrabGo, Accra, Greater Accra Region 00233, Ghana. Phone: (+233)536997662. Email: hello@grabgogh.app."
  },
]

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fafafa] antialiased text-[#111827] pt-32 pb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-12 border-b border-slate-200 pb-8">
            <p className="text-[#fe6132] text-sm font-black uppercase tracking-widest mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-slate-500 text-sm">Last updated: 2026</p>
          </div>

          {/* Intro */}
          <p className="mb-10 text-lg text-slate-600 leading-relaxed">
            We are GrabGo, doing business as GrabGo ("Company," "we," "us," "our"), a company registered in Ghana at Accra, Greater Accra Region 00233. We operate the website{" "}
            <a href="https://grabgogh.app" className="text-[#fe6132] underline">https://grabgogh.app</a>{" "}
            and the mobile applications GrabGo, GrabGo Rider, and GrabGo Vendor. You can contact us by phone at (+233)536997662 or email at{" "}
            <a href="mailto:hello@grabgogh.app" className="text-[#fe6132] underline">hello@grabgogh.app</a>.
          </p>

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