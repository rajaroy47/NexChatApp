import AdBanner from "../components/AdBanner";

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
    <div className="text-gray-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 6, 2026</p>

        <AdBanner slot="1357924680" format="horizontal" className="mb-10" />

        <Section title="1. Introduction">
          <p>
            Welcome to NexChat ("we", "our", or "us"). This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our website at{" "}
            <strong className="text-white">nexchat.vercel.app</strong> and use our real-time chat
            application.
          </p>
          <p>
            Please read this policy carefully. If you disagree with its terms, please discontinue
            use of the site.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Account Information:</strong> Your email address and
              chosen display name when you register.
            </li>
            <li>
              <strong className="text-white">Chat Messages:</strong> Messages you send in global
              chat and private conversations are stored in Firebase Realtime Database.
            </li>
            <li>
              <strong className="text-white">Online Presence Data:</strong> Your online/offline
              status and last-active timestamp, used to show presence indicators to other users.
            </li>
            <li>
              <strong className="text-white">Usage Data:</strong> Automatically collected data
              including IP address, browser type, operating system, pages visited, and time spent,
              collected by Google Analytics and Google AdSense.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>To operate and maintain the NexChat service</li>
            <li>To authenticate you and manage your account securely</li>
            <li>To display your messages and presence to other users</li>
            <li>To improve the application based on usage patterns</li>
            <li>To serve relevant advertisements through Google AdSense</li>
            <li>To comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Google AdSense & Advertising">
          <p>
            NexChat uses Google AdSense to display advertisements. Google AdSense uses cookies and
            web beacons to serve ads based on your prior visits to this and other websites. Google's
            use of advertising cookies enables it and its partners to serve ads based on your visit
            to our site and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="text-purple-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of a third-party vendor's use of cookies for
            personalized advertising by visiting{" "}
            <a
              href="http://www.aboutads.info/choices/"
              className="text-purple-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutads.info
            </a>
            .
          </p>
          <p>
            Our publisher ID is <strong className="text-white">ca-pub-6772714713874190</strong>.
          </p>
        </Section>

        <AdBanner slot="0246813579" format="rectangle" className="my-8" />

        <Section title="5. Cookies">
          <p>
            We use cookies and similar tracking technologies to track activity on our service and
            store certain information. Cookies are files with a small amount of data which may
            include an anonymous unique identifier.
          </p>
          <p>Types of cookies we use:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-white">Essential cookies:</strong> Required for Firebase
              authentication to function.
            </li>
            <li>
              <strong className="text-white">Analytics cookies:</strong> Used by Google Analytics
              to understand how visitors interact with our site.
            </li>
            <li>
              <strong className="text-white">Advertising cookies:</strong> Used by Google AdSense
              to display relevant ads.
            </li>
          </ul>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is
            being sent. However, if you do not accept cookies, you may not be able to use some
            portions of our service.
          </p>
        </Section>

        <Section title="6. Firebase & Third-Party Services">
          <p>
            NexChat is built on Google Firebase services, including Firebase Authentication and
            Firebase Realtime Database. Your data is stored on Google's infrastructure. Please refer
            to{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-purple-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's Privacy Policy
            </a>{" "}
            for details on how Google handles data.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your account information and messages for as long as your account is active.
            Online status data is updated in real time and reflects your current session only.
            If you wish to delete your account and all associated data, please contact us at{" "}
            <a href="mailto:eduroket001@gmail.com" className="text-purple-400 hover:underline">
              eduroket001@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            NexChat is not directed to anyone under the age of 13. We do not knowingly collect
            personally identifiable information from children under 13. If you are a parent or
            guardian and believe your child has provided us with personal information, please
            contact us immediately so we can delete such data.
          </p>
        </Section>

        <Section title="9. Security">
          <p>
            We use commercially acceptable means to protect your personal information. Firebase
            provides industry-standard encryption for data in transit (TLS/SSL) and at rest.
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="10. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (Right to be Forgotten)</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href="mailto:eduroket001@gmail.com" className="text-purple-400 hover:underline">
              eduroket001@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date at
            the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:eduroket001@gmail.com" className="text-purple-400 hover:underline">
              eduroket001@gmail.com
            </a>
          </p>
        </Section>

        <AdBanner slot="1928374650" format="horizontal" className="mt-10" />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
