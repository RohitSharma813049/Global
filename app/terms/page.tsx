import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28 text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 font-['Cormorant_Garamond']">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="font-semibold">Last Updated: August 2026</p>
          
          <p>
            Welcome to Global Scholar Publications. These terms of service outline the rules and regulations for the use of our website and services.
            By accessing this website, we assume you accept these terms of service in full. Do not continue to use Global Scholar Publications if you do not accept all of the terms stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. General Overview & Applicability</h2>
          <p>
            These Terms of Service ("Terms") apply to all users of the Global Scholar Publications platform, including scholars, readers, authors, and institutional representatives. These Terms are governed by and construed in accordance with the laws of England and Wales.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, Global Scholar Publications and/or its licensors own the intellectual property rights for all material on the platform. All intellectual property rights are reserved. You may view and/or print pages from the website for your own personal use, subject to restrictions set in these terms.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authors:</strong> Retain the copyright to their submitted works, granting us a non-exclusive, worldwide, royalty-free license to publish, reproduce, and distribute the work on our platform.</li>
            <li><strong>Readers:</strong> Must not republish, sell, rent, sub-license, reproduce, or redistribute material from Global Scholar Publications without explicit consent from the copyright holder.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Acceptable Use Policy</h2>
          <p>You agree not to use our platform in any way that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Breaches any applicable local, national, or international law or regulation (including UK laws).</li>
            <li>Is unlawful or fraudulent or has any unlawful or fraudulent purpose or effect.</li>
            <li>Involves the transmission of unsolicited or unauthorised advertising or promotional material (spam).</li>
            <li>Knowingly transmits any data, sends or uploads any material that contains viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware, or any other harmful programs.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Submissions and Peer Review</h2>
          <p>
            We maintain strict academic standards. By submitting a manuscript, thesis, or book for publication, you warrant that the work is original, has not been published elsewhere, and does not infringe upon any third-party rights. All submissions are subject to our peer-review process and editorial guidelines. We reserve the right to reject or retract any publication that violates academic integrity.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury resulting from negligence, or limit any of our or your liabilities in any way that is not permitted under applicable law.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">8. Governing Law and Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at: <br/>
            <strong>Email:</strong> legal@globalscholarpublishing.com<br/>
            <strong>Address:</strong> Global Scholar Publications, 124 City Road, London, EC1V 2NX, United Kingdom
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
