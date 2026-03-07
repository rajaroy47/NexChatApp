import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </div>
    <span className="text-base font-bold text-white">Nex<span className="gradient-text">Chat</span></span>
  </div>
);

const links = {
  Product: [
    { to: '/chat', label: 'Open App' },
    { to: '/about', label: 'About' },
    { to: '/blog', label: 'Blog' },
  ],
  Legal: [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
  Connect: [
    { href: 'https://www.instagram.com/raja_roy47', label: 'Instagram' },
    { href: 'https://github.com/rajaroy47', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/rajaroy47', label: 'LinkedIn' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#060608]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-[#55556a] leading-relaxed max-w-xs">
              Next-generation real-time messaging. Secure, fast, and beautifully designed.
            </p>
            <p className="mt-4 text-xs text-[#55556a]">
              Built with <span className="animate-heartbeat text-red-500">❤️</span> by Raja
            </p>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#55556a] mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {items.map(({ to, href, label }) => (
                  <li key={label}>
                    {to
                      ? <Link to={to} className="text-sm text-[#9999b0] hover:text-white transition-colors">{label}</Link>
                      : <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9999b0] hover:text-white transition-colors">{label}</a>
                    }
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#55556a]">© {new Date().getFullYear()} NexChat. All rights reserved.</p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
            <span className="text-xs text-[#9999b0]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
