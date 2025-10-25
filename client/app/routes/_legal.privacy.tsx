import { useEffect, useState } from "react";
import XButton from "~/components/xbutton";

export default function Privacy() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-500 to-blue-500 p-6">
      <div className="flex justify-end">
        <XButton />
      </div>
      <div
        className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 space-y-8 transition-opacity duration-1000 transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >

        <header>
          <h1 className="text-4xl font-bold mb-2 text-center text-blue-950">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 text-center">
            Last updated: October 15, 2025
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p className="leading-relaxed text-gray-700">
            Welcome to <span className="font-medium">GatorMarket</span>, a student-driven marketplace created to help students buy, sell, and trade items safely within their university community. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="leading-relaxed mb-2 text-gray-700">
            We collect information that helps us verify users and provide a functional marketplace, including:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>University affiliation</li>
            <li>Listing details (title, description, images, categories)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p className="leading-relaxed mb-2 text-gray-700">
            We use the information collected only to operate and improve GatorMarket. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Allowing you to create and manage listings</li>
            <li>Enabling communication between users</li>
            <li>Verifying student status for account safety</li>
            <li>Sending important account updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
          <p className="leading-relaxed text-gray-700">
            We take reasonable measures to safeguard your data through secure storage and communication practices. However, no system is completely secure, and we cannot guarantee absolute protection of your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Sharing Your Information</h2>
          <p className="leading-relaxed text-gray-700">
            We do not sell or rent your personal data. Some information, such as your listings and contact details, may be visible to other registered students. We may share limited information only when required by law or necessary to protect user safety.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Your Choices</h2>
          <p className="leading-relaxed text-gray-700">
            You may update or delete your account information at any time. You can also request removal of your data by contacting us, subject to verification and applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p className="leading-relaxed text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:support@gatormarket.edu" className="underline hover:text-blue-600">
              support@gatormarket.edu
            </a>.
          </p>
        </section>

        <footer className="pt-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} GatorMarket. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
