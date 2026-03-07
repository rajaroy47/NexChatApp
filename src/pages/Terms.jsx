import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using NexChat, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
    { title: '2. User Responsibilities', content: 'You are responsible for your account security, including keeping your password confidential. You agree not to use NexChat for any unlawful purpose or to send harmful, abusive, or offensive content.' },
    { title: '3. Email Verification', content: 'Email verification is required to use NexChat. This helps us maintain a safe and verified community of users.' },
    { title: '4. Content Policy', content: 'You retain ownership of content you post. By posting, you grant NexChat a license to display your content within the service. We reserve the right to remove content that violates our policies.' },
    { title: '5. Service Availability', content: 'We strive for 99.9% uptime but cannot guarantee uninterrupted service. We may modify or discontinue the service at any time with reasonable notice.' },
    { title: '6. Termination', content: 'We reserve the right to terminate or suspend accounts that violate these terms, engage in harmful behavior, or misuse the service.' },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Legal</span>
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
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
