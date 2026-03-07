import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect your email address and display name when you register. We store chat messages in Firebase Realtime Database. We collect minimal data necessary for the service to function.' },
    { title: '2. How We Use Your Information', content: 'Your information is used solely to provide the NexChat service. We do not sell, trade, or share your personal information with third parties, except as required by law.' },
    { title: '3. Data Security', content: 'We use Firebase Authentication for secure login. All data is transmitted over HTTPS. We use email verification to prevent unauthorized access.' },
    { title: '4. Data Retention', content: 'Your data remains in our system as long as your account is active. You may request deletion of your account and associated data by contacting us.' },
    { title: '5. Changes to This Policy', content: 'We may update this privacy policy from time to time. We will notify users of significant changes via email or in-app notifications.' },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Legal</span>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-[#55556a] text-sm">Last updated: March 1, 2026</p>
        </div>
        <div className="space-y-4">
          {sections.map(({ title, content }) => (
            <div key={title} className="bg-[#0e0e12] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-2">{title}</h2>
              <p className="text-sm text-[#9999b0] leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
        <div className="mt-8"><Link to="/" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">← Back to Home</Link></div>
      </div>
    </div>
  );
}
