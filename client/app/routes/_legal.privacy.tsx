export default function Privacy() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: October 15, 2025</p>
        </header>

        <section>
          <h2 className="text-xl font-medium mb-2">1. Introduction</h2>
          <p className="leading-relaxed">
            Welcome to <span className="font-medium">GatorMarket</span>, a student-driven marketplace
            created to help students buy, sell, and trade items safely within their university
            community. This Privacy Policy explains how we collect, use, and protect your
            information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">2. Information We Collect</h2>
          <p className="leading-relaxed mb-2">
            We collect information that helps us verify users and provide a functional marketplace,
            including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>University affiliation</li>
            <li>Listing details (title, description, images, categories)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">3. How We Use Your Information</h2>
          <p className="leading-relaxed mb-2">
            We use the information collected only to operate and improve GatorMarket. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Allowing you to create and manage listings</li>
            <li>Enabling communication between users</li>
            <li>Verifying student status for account safety</li>
            <li>Sending important account updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">4. Data Security</h2>
          <p className="leading-relaxed">
            We take reasonable measures to safeguard your data through secure storage and
            communication practices. However, no system is completely secure, and we cannot
            guarantee absolute protection of your information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">5. Sharing Your Information</h2>
          <p className="leading-relaxed">
            We do not sell or rent your personal data. Some information, such as your listings and
            contact details, may be visible to other registered students. We may share limited
            information only when required by law or necessary to protect user safety.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">6. Your Choices</h2>
          <p className="leading-relaxed">
            You may update or delete your account information at any time. You can also request
            removal of your data by contacting us, subject to verification and applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-2">7. Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
