import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28 text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 font-['Cormorant_Garamond']">Privacy & Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="font-semibold">Last Updated: August 2026</p>
          
          <p>
            Global Scholar Publications ("we", "us", or "our") is committed to protecting and respecting your privacy. 
            This Privacy and Cookie Policy explains how we collect, use, disclose, and safeguard your information when you 
            visit our website and use our platform. This policy is written in accordance with the UK General Data Protection 
            Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
          <p>We may collect and process the following data about you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> Name, academic title, institutional affiliation, and username.</li>
            <li><strong>Contact Data:</strong> Email address, telephone number, and physical address.</li>
            <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types, operating system, and platform.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, downloads, and search queries.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and manage your account and academic profile.</li>
            <li>To process and publish your submissions (papers, books, thesis, etc.).</li>
            <li>To improve our website, services, and customer experiences.</li>
            <li>To comply with a legal or regulatory obligation.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may share your data with selected third parties including IT service providers, 
            analytics providers, and legal/regulatory authorities where required by UK law.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. International Transfers</h2>
          <p>
            If we transfer your personal data out of the UK, we ensure a similar degree of protection is afforded to it by ensuring 
            appropriate safeguards are implemented (such as Standard Contractual Clauses or ensuring the country has an adequacy decision).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Data Security & Retention</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed 
            in an unauthorised way. We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, 
            including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Your Legal Rights (UK GDPR)</h2>
          <p>Under the UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request access to your personal data (a "data subject access request").</li>
            <li>Request correction of the personal data that we hold about you.</li>
            <li>Request erasure of your personal data ("right to be forgotten").</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing of your personal data.</li>
            <li>Request the transfer of your personal data to you or to a third party (data portability).</li>
            <li>Withdraw consent at any time where we are relying on consent to process your personal data.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Cookie Policy</h2>
          <p>
            Our website uses cookies to distinguish you from other users. This helps us provide you with a good experience and allows us to improve our site.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Strictly Necessary Cookies:</strong> Required for the operation of our website (e.g., login sessions).</li>
            <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognise and count the number of visitors and see how visitors move around our website.</li>
            <li><strong>Functionality Cookies:</strong> Used to recognise you when you return to our website, allowing us to personalise our content for you.</li>
          </ul>
          <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact our Data Protection Officer at:<br/>
            <strong>Email:</strong> legal@globalscholarpublishing.com<br/>
            <strong>Post:</strong> Global Scholar Publications, 124 City Road, London, EC1V 2NX, United Kingdom
          </p>
          <p>
            You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues (<em>www.ico.org.uk</em>).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
