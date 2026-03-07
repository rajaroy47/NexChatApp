import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Raja Roy', role: 'Founder & Developer', avatar: 'R', color: ['#7C3AED','#A78BFA'] },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-violet-600/8 rounded-full filter blur-[100px]"/>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-600/6 rounded-full filter blur-[100px]"/>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">About</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">The Story Behind NexChat</h1>
          <p className="text-[#9999b0] text-lg max-w-2xl mx-auto leading-relaxed">
            NexChat was built with a simple mission: create the most beautiful and functional real-time messaging experience possible.
          </p>
        </div>

        <div className="grid gap-5 mb-12">
          {[
            { title: 'Our Mission', content: 'To democratize real-time communication by providing a fast, secure, and beautifully designed chat platform that works seamlessly across all devices.', icon: '🎯' },
            { title: 'The Technology', content: 'Built on Firebase Realtime Database for instant message delivery, React for a fluid UI, and Tailwind CSS for a polished design system.', icon: '⚡' },
            { title: 'Privacy First', content: 'We believe your conversations are yours. NexChat uses email verification and secure authentication to ensure only verified users can participate.', icon: '🔒' },
          ].map(({ title, content, icon }) => (
            <div key={title} className="bg-[#0e0e12] border border-white/[0.07] rounded-3xl p-6 flex gap-4 hover:border-violet-500/20 transition-all">
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#9999b0] leading-relaxed">{content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0e0e12] border border-white/[0.07] rounded-3xl p-8 mb-10 overflow-hidden relative">
          <div className="h-0.5 absolute top-0 left-0 right-0 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500"/>
          <h2 className="text-xl font-bold text-white mb-6 text-center">Meet the Developer</h2>
          {team.map(({ name, role, avatar, color }) => (
            <div key={name} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl" style={{ background: `linear-gradient(135deg, ${color[0]}, ${color[1]})` }}>
                {avatar}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{name}</p>
                <p className="text-sm text-violet-400">{role}</p>
              </div>
              <div className="flex gap-3 mt-2">
                {[
                  { href: 'https://github.com/rajaroy47', label: 'GitHub' },
                  { href: 'https://www.instagram.com/raja_roy47', label: 'Instagram' },
                  { href: 'https://www.linkedin.com/in/rajaroy47', label: 'LinkedIn' },
                ].map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs font-medium text-[#9999b0] hover:text-white hover:border-violet-500/30 transition-all"
                  >{l.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/chat" className="inline-flex items-center gap-2 px-7 py-3.5 btn-gradient rounded-2xl text-white font-semibold text-sm shadow-lg hover:scale-[1.03] transition-all">
            Start Chatting <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
