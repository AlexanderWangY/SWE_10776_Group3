import { useEffect, useState } from "react";
import XButton from "~/components/xbutton";

{/* TERMS OF SERVICE PAGE COMPONENT */}
export default function Terms() {
  const [isVisible, setIsVisible] = useState(false);

  {/* HANDLES VISIBILITY TRANSITION */}
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  {/* RENDER TERMS OF SERVICE PAGE */}
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-500 to-blue-500 p-6">
      <div className="flex justify-end">
        {/* CLOSE BUTTON */}
        <XButton />
      </div>
      <div
        className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 space-y-8 transition-opacity duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* TERMS OF SERVICE CONTENT */}
        <header>
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-950">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 text-center">Last updated: October 15, 2025</p>
        </header>

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-gray-700">
            By accessing or using <span className="font-medium">GatorMarket</span> (“we,” “our,” “us”),
            you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not
            agree with these Terms, you may not use or access the platform.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Eligibility</h2>
          <p className="leading-relaxed text-gray-700">
            GatorMarket is intended for verified university students. By registering, you confirm that
            you are a currently enrolled student with a valid institutional email address. We reserve
            the right to suspend or terminate accounts that do not meet these requirements.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">3. Use of the Platform</h2>
          <p className="leading-relaxed mb-2 text-gray-700">
            You agree to use GatorMarket only for lawful purposes and in accordance with university
            policies. You are responsible for all activity under your account, including content you
            post, such as item listings, messages, or uploaded media.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Do not post illegal, harmful, or offensive content.</li>
            <li>Do not impersonate other users or provide false information.</li>
            <li>Do not use automated systems, bots, or scraping tools.</li>
            <li>Do not interfere with or disrupt the service or other users’ experiences.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">4. No Financial Transactions</h2>
          <p className="leading-relaxed text-gray-700">
            GatorMarket does <strong>not</strong> handle money transfers, payments, or delivery of goods.
            All transactions occur directly between users. We do not verify, guarantee, or take
            responsibility for the condition, authenticity, or value of any listed items or services.
            Any disputes, losses, or damages arising from user interactions are solely between the
            involved parties.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">5. User Content and Ownership</h2>
          <p className="leading-relaxed text-gray-700">
            You retain ownership of the content you post but grant GatorMarket a limited,
            non-exclusive, royalty-free license to display, distribute, and promote that content
            within the platform. You are responsible for ensuring that your content does not
            infringe upon any intellectual property or privacy rights of others.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Account Responsibility</h2>
          <p className="leading-relaxed text-gray-700">
            You are responsible for maintaining the confidentiality of your account credentials.
            You must immediately notify us of any unauthorized access or use of your account.
            We are not liable for any loss or damage resulting from unauthorized access to your
            account due to your negligence.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Termination</h2>
          <p className="leading-relaxed text-gray-700">
            We reserve the right to suspend or terminate your account at any time, with or without
            notice, if you violate these Terms or engage in conduct that we determine to be harmful
            to the community or platform. Upon termination, your access to GatorMarket will cease
            immediately, and we may remove any associated data or listings.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Limitation of Liability</h2>
          <p className="leading-relaxed text-gray-700">
            GatorMarket and its developers are not liable for any direct, indirect, incidental, or
            consequential damages resulting from your use or inability to use the platform, including
            but not limited to loss of profits, data, or goodwill. You use the service entirely at your
            own risk.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Disclaimer of Warranties</h2>
          <p className="leading-relaxed text-gray-700">
            GatorMarket is provided on an “as is” and “as available” basis without warranties of any
            kind, whether express or implied. We do not guarantee the accuracy, reliability, or
            availability of listings, communications, or any information shared through the platform.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">10. Indemnification</h2>
          <p className="leading-relaxed text-gray-700">
            You agree to indemnify and hold harmless GatorMarket, its student developers, affiliates,
            and university partners from any claims, liabilities, damages, or expenses arising from
            your use of the platform, your posted content, or your violation of these Terms.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">11. Changes to Terms</h2>
          <p className="leading-relaxed text-gray-700">
            We may modify or update these Terms at any time. Continued use of the platform after
            updates take effect constitutes your acceptance of the revised Terms. We encourage users
            to review this page periodically.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">12. Governing Law</h2>
          <p className="leading-relaxed text-gray-700">
            These Terms are governed by and construed in accordance with the laws of the State of
            Florida, without regard to its conflict of law principles. Any legal disputes shall be
            resolved in the appropriate courts located within Florida.
          </p>
        </section>

        {/* 13 */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">13. Contact Us</h2>
          <p className="leading-relaxed text-gray-700">
            For questions regarding these Terms of Service, please contact us at{" "}
            <a href="mailto:support@gatormarket.edu" className="underline hover:text-blue-600">
              support@gatormarket.edu
            </a>.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="pt-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} GatorMarket. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
