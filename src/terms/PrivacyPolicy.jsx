// PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: January 8, 2026</p>
          </div>
          <div>
            {/* <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              Back
            </button> */}
          </div>
        </div>

        <section className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
          <p>
            This Privacy Policy explains how <strong>Salient Learnings</strong> (“we”, “us”, or “our”) collects,
            uses, discloses, and protects personal information when you use our website and services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            <strong>Information you give us:</strong> name, email, phone, billing information, resume or profile data
            when you register, enroll, contact support or purchase a course.
          </p>
          <p>
            <strong>Automatically collected information:</strong> usage data (pages visited, time spent), device and
            browser information, IP address, and analytics data.
          </p>
          <p>
            <strong>Third-party data:</strong> data from payment processors, social login providers, or advertising and
            analytics services.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and operate the Site and deliver the services you request.</li>
            <li>To process payments and manage orders and subscriptions.</li>
            <li>To communicate about your account, updates, promotions, and support.</li>
            <li>To improve our platform, personalize content, and conduct analytics.</li>
            <li>To detect and prevent fraud and abuse.</li>
          </ul>

          <h2>3. Cookies &amp; Tracking</h2>
          <p>
            We use cookies and similar technologies to remember preferences, enable features, and collect analytics.
            You can control cookies via your browser settings; blocking certain cookies may limit functionality.
          </p>

          <h2>4. Sharing &amp; Disclosure</h2>
          <p>
            We do not sell personal information. We may share data with:
            <ul>
              <li>Service providers (payment processors, hosting, analytics) who help operate the Site.</li>
              <li>Compliance, safety or legal authorities when required by law or to protect rights.</li>
              <li>Other parties with your explicit consent.</li>
            </ul>
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            Our Site integrates third-party tools (e.g., payment gateways, analytics, email services). Those services
            have their own privacy policies — we recommend reviewing them.
          </p>

          <h2>6. Data Retention &amp; Security</h2>
          <p>
            We retain personal data for as long as necessary to provide services, comply with legal obligations, and
            resolve disputes. We use industry-standard measures to protect data, but no method is completely secure.
          </p>

          <h2>7. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights to access, correct, delete or port your personal data,
            and to object to or restrict certain processing. To exercise rights, contact us at the email below.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not directed to children under 16. We do not knowingly collect personal information from
            children under 16. If you believe we have collected such information, contact us to request deletion.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Data may be processed and stored in countries outside your jurisdiction. We take steps to provide an
            adequate level of protection for data transfer as required by law.
          </p>

          <h2>10. Changes to this Policy</h2>
          <p>
            We may update this policy periodically. We will post the revised policy with a new “Last updated” date.
            Continued use after changes indicates acceptance.
          </p>

          <h2>11. Contact</h2>
          <p>
            For privacy requests or questions, contact:
            <br />
            <strong>Email:</strong> privacy@example.com
          </p>

        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
