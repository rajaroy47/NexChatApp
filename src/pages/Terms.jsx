import AdBanner from "../components/AdBanner";

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
    <div className="text-gray-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: March 6, 2026</p>

        <AdBanner slot="1029384756" format="horizontal" className="mb-10" />

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using NexChat at <strong className="text-white">nexchat.vercel.app</strong>,
            you agree to be bound by these Terms of Service and our Privacy Policy. If you do not
            agree to these terms, please do not use our service.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>
            You must be at least 13 years of age to use NexChat. By using the service, you represent
            and warrant that you meet this age requirement and have the legal capacity to enter into
            this agreement.
          </p>
        </Section>

        <Section title="3. User Accounts">
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide a valid email address and verify it to activate your account.</li>
            <li>You are responsible for maintaining the confidentiality of your password.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You may not share your account with others.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree NOT to use NexChat to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send spam, unsolicited messages, or bulk commercial communications</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Post or transmit illegal, obscene, defamatory, or harmful content</li>
            <li>Impersonate any person or entity</li>
            <li>Distribute malware, viruses, or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Use the service for any unlawful purpose</li>
            <li>Violate any applicable local, national, or international law</li>
          </ul>
        </Section>

        <AdBanner slot="5647382910" format="rectangle" className="my-8" />

        <Section title="5. Content Ownership">
          <p>
            You retain ownership of the content you post on NexChat. By posting content, you grant
            NexChat a non-exclusive, royalty-free license to display and transmit your content as
            part of providing the service.
          </p>
          <p>
            We reserve the right to remove any content that violates these Terms or that we
            determine, in our sole discretion, is harmful to users, the service, or third parties.
          </p>
        </Section>

        <Section title="6. Advertising">
          <p>
            NexChat uses Google AdSense to display third-party advertisements. By using the service,
            you acknowledge that advertisements may be served. We are not responsible for the content
            of third-party advertisements. Clicking on ads will direct you to third-party sites that
            have their own privacy policies and terms.
          </p>
        </Section>

        <Section title="7. Disclaimers">
          <p>
            NexChat is provided "as is" and "as available" without warranties of any kind, either
            express or implied. We do not warrant that the service will be uninterrupted, error-free,
            or free from viruses or other harmful components.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, NexChat and its operator shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages arising from
            your use of (or inability to use) the service.
          </p>
        </Section>

        <Section title="9. Account Termination">
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without
            notice, for conduct that violates these Terms or that we believe is harmful to other
            users, us, or third parties, or for any other reason at our sole discretion.
          </p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>
            We may revise these Terms at any time. Continued use of the service after changes are
            posted constitutes your acceptance of the revised Terms. We will update the "Last
            updated" date at the top of this page when changes are made.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
            of the courts located in India.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            Questions about these Terms? Contact us at:{" "}
            <a href="mailto:eduroket001@gmail.com" className="text-purple-400 hover:underline">
              eduroket001@gmail.com
            </a>
          </p>
        </Section>

        <AdBanner slot="9081726354" format="horizontal" className="mt-10" />
      </div>
    </div>
  );
};

export default Terms;
