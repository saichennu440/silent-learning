// TermsAndConditions.jsx
import React from "react";

const TermsPage = () => {
  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Terms &amp; Conditions</h1>
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
            Welcome to <strong>Salient Learnings</strong> (the “Site”, “we”, “us” or “our”). These Terms &amp;
            Conditions (“Terms”) govern your access to and use of our website, services and content. By using the
            Site you agree to these Terms. If you do not agree, please do not use the Site.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            These Terms constitute a legally binding agreement between you and the Site operator. You confirm that you
            are at least the legal age required to form a binding contract. We may modify these Terms from time to
            time — changes take effect when posted. Your continued use after changes means you accept the updated Terms.
          </p>

          <h2>2. Access &amp; Use</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable right to access and use the Site for your personal
            and non-commercial purposes. You agree not to use the Site for unlawful purposes or to interfere with its
            operation.
          </p>

          <h2>3. Accounts &amp; Credentials</h2>
          <p>
            Certain features may require registration. You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your account. Notify us immediately if you
            suspect unauthorized use.
          </p>

          <h2>4. Payments, Fees &amp; Refunds</h2>
          <p>
            If you purchase paid services or courses, you agree to the pricing and payment terms shown at checkout.
            Refunds, if available, will be handled in accordance with our Refund Policy (posted on the Site or
            provided at purchase). Payment processing is handled by third-party providers and is subject to their terms.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            All content on the Site — text, images, videos, course materials, logos and designs — is owned by us or our
            licensors and is protected by copyright, trademark and other laws. You may not copy, distribute, modify or
            create derivative works without our written permission.
          </p>

          <h2>6. User Content</h2>
          <p>
            You may submit comments, questions, or other content. By submitting content you grant us a worldwide,
            royalty-free, perpetual license to use, reproduce, modify, and display the content. You represent and
            warrant you own the rights to any content you post and that it does not infringe the rights of others.
          </p>

          <h2>7. Disclaimers</h2>
          <p>
            THE SITE AND CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND. WE MAKE NO
            WARRANTIES THAT THE SITE WILL BE UNINTERRUPTED, SECURE OR ERROR-FREE. ANY ADVICE, COURSE MATERIAL OR
            INFORMATION IS FOR EDUCATIONAL PURPOSES ONLY.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL
            OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SITE. OUR AGGREGATE LIABILITY WILL NOT EXCEED THE AMOUNTS
            YOU HAVE PAID US IN THE PAST 12 MONTHS (IF ANY).
          </p>

          <h2>9. Indemnity</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses
            arising from your use of the Site or your breach of these Terms.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your access for any reason, including violation of these Terms. Upon
            termination, your right to use the Site ends.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the jurisdiction where the Site operator is located, without regard
            to conflict of law rules. Any dispute will be resolved in the courts of that jurisdiction.
          </p>

          <h2>12. Changes to the Site</h2>
          <p>
            We may update features, add or remove content, or discontinue the Site at any time. We are not required to
            provide notice in advance.
          </p>

          <h2>13. Contact</h2>
          <p>
            If you have questions about these Terms, contact us at:
            <br />
            <strong>Email:</strong> support@example.com
          </p>

        </section>
      </div>
    </div>
  );
};

export default TermsPage;
