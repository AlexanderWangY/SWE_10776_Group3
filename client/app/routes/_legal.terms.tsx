export default function Terms() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-semibold mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: October 15, 2025</p>
        </header>

        <section>
          <h2 className="text-xl font-medium mb-2">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By accessing or using <span className="font-medium">GatorMarket</span> (“we,” “our,” “us”),
            you agree to comply with and be bound by these Terms of Service (“Terms”). If you do not
            agree with these Terms, you may not use or access the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">2. Eligibility</h2>
          <p className="leading-relaxed">
            GatorMarket is intended for verified university students. By registering, you confirm that
            you are a currently enrolled student with a valid institutional email address. We reserve
            the right to suspend or terminate accounts that do not meet these requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">3. Use of the Platform</h2>
          <p className="leading-relaxed mb-2">
            You agree to use GatorMarket only for lawful purposes and in accordance with university
            policies. You are responsible for all activity under your account, including content you
            post, such as item listings, messages, or uploaded media.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Do not post illegal, harmful, or offensive content.</li>
            <li>Do not impersonate other users or provide false information.</li>
            <li>Do not use automated systems, bots, or scraping tools.</li>
            <li>Do not interfere with or disrupt the service or other users’ experiences.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">4. No Financial Transactions</h2>
          <p className="leading-relaxed">
            GatorMarket does <strong>not</strong> handle money transfers, payments, or delivery of goods.
            All transactions occur directly between users. We do not verify, guarantee, or take
            responsibility for the condition, authenticity, or value of any listed items or services.
            Any disputes, losses, or damages arising from user interactions are solely between the
            involved parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">5. User Content and Ownership</h2>
          <p className="leading-relaxed">
            You retain ownership of the content you post but grant GatorMarket a limited,
            non-exclusive, royalty-free license to display, distribute, and promote that content
            within the platform. You are responsible for ensuring that your content does not
            infringe upon any intellectual property or privacy rights of others.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">6. Account Responsibility</h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials.
            You must immediately notify us of any unauthorized access or use of your account.
            We are not liable for any loss or damage resulting from unauthorized access to your
            account due to your negligence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">7. Termination</h2>
          <p className="leading-relaxed">
            We reserve the right to suspend or terminate your account at any time, with or without
            notice, if you violate these Terms or engage in conduct that we determine to be harmful
            to the community or platform. Upon termination, your access to GatorMarket will cease
            immediately, and we may remove any associated data or listings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">8. Limitation of Liability</h2>
          <p className="leading-relaxed">
            GatorMarket and its developers are not liable for any direct, indirect, incidental, or
            consequential damages resulting from your use or inability to use the platform, including
            but not limited to loss of profits, data, or goodwill. You use the service entirely at your
            own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">9. Disclaimer of Warranties</h2>
          <p className="leading-relaxed">
            GatorMarket is provided on an “as is” and “as available” basis without warranties of any
            kind, whether express or implied. We do not guarantee the accuracy, reliability, or
            availability of listings, communications, or any information shared through the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">10. Indemnification</h2>
          <p className="leading-relaxed">
            You agree to indemnify and hold harmless GatorMarket, its student developers, affiliates,
            and university partners from any claims, liabilities, damages, or expenses arising from
            your use of the platform, your posted content, or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">11. Changes to Terms</h2>
          <p className="leading-relaxed">
            We may modify or update these Terms at any time. Continued use of the platform after
            updates take effect constitutes your acceptance of the revised Terms. We encourage users
            to review this page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">12. Governing Law</h2>
          <p className="leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of the State of
            Florida, without regard to its conflict of law principles. Any legal disputes shall be
            resolved in the appropriate courts located within Florida.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">13. Contact Us</h2>
          <p className="leading-relaxed">
            For questions regarding these Terms of Service, please contact us at{" "}
            <a href="mailto:support@gatormarket.edu" className="underline">
              support@gatormarket.edu
            </a>.
          </p>
        </section>

        <footer className="pt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} GatorMarket. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
