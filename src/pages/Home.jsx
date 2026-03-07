import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    ),
    title: 'Real-Time Messaging',
    desc: 'Zero-latency communication powered by enterprise-grade Firebase infrastructure.',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
    ),
    title: 'End-to-End Privacy',
    desc: 'Your conversations are private. Advanced auth and bot detection for security.',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    ),
    title: 'Global Connectivity',
    desc: 'Connect across borders with globally distributed infrastructure.',
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    ),
    title: 'Live Presence',
    desc: 'Real-time activity indicators, online status, and last-seen timestamps.',
    gradient: 'from-orange-500 to-red-500',
    glow: 'rgba(249,115,22,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
    ),
    title: 'Native-Like UI',
    desc: 'Adaptive, pixel-perfect interface that feels at home on every device.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236,72,153,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
    ),
    title: 'Private DMs',
    desc: 'One-on-one private messaging alongside the global group chat.',
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'rgba(99,102,241,0.15)',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<50ms', label: 'Latency' },
  { value: '256-bit', label: 'Encryption' },
  { value: '∞', label: 'Messages' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060608] text-gray-200 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full filter blur-[120px]"/>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/6 rounded-full filter blur-[100px]"/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/6 rounded-full filter blur-[100px]"/>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] px-4 py-2 rounded-full mb-10 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"/>
          </span>
          <span className="text-xs font-medium text-[#9999b0] tracking-wide">
            <span className="text-[#55556a]">v2.1 — </span>Live globally · Firebase powered
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold tracking-tight leading-[1.05] mb-7 animate-fade-in-up animation-delay-100">
          <span className="block text-white">The Future of</span>
          <span className="block mt-1 gradient-text">Real-Time Chat</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-[#9999b0] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-delay-200">
          NexChat delivers instant, secure conversations in a beautifully designed interface.
          Global chat, private DMs, and live presence — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
          <Link
            to="/chat"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 btn-gradient rounded-2xl text-white font-semibold text-sm shadow-xl shadow-violet-900/30 hover:shadow-violet-600/40 hover:scale-[1.03] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            Start Chatting Free
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-[#9999b0] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:text-white hover:border-white/[0.12] transition-all duration-200"
          >
            Learn more
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl py-4 px-2">
              <div className="text-2xl font-bold gradient-text">{value}</div>
              <div className="text-xs text-[#55556a] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Chat preview mockup */}
        <div className="mt-16 max-w-lg mx-auto animate-fade-in-up animation-delay-500">
          <div className="bg-[#0e0e12] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
            <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500"/>
            <div className="p-4 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white">G</div>
              <div>
                <p className="text-sm font-semibold text-white">Global Chat</p>
                <p className="text-xs text-emerald-500">● 3 online</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { name: 'Alex', msg: 'Hey everyone! 👋', mine: false },
                { name: 'You', msg: 'Welcome to NexChat!', mine: true },
                { name: 'Sam', msg: 'This UI is 🔥', mine: false },
              ].map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}>
                  {!m.mine && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                      {m.name[0]}
                    </div>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] ${m.mine ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm' : 'bg-[#1a1a20] text-gray-200 rounded-bl-sm'}`}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/[0.05] flex items-center gap-2">
              <div className="flex-1 bg-white/[0.04] rounded-2xl px-4 py-2 text-xs text-[#55556a]">Type a message…</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need</h2>
          <p className="mt-3 text-[#9999b0] max-w-xl mx-auto">Packed with powerful features to make your conversations seamless and enjoyable.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative bg-[#0e0e12] border border-white/[0.06] rounded-3xl p-6 hover:border-white/[0.1] transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} items-center justify-center mb-4 text-white shadow-lg`}
                style={{ boxShadow: `0 8px 25px ${f.glow}` }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[#9999b0] leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-[1px] rounded-b-3xl bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}/>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-br from-violet-600/20 to-pink-600/10 border border-violet-500/20 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none"/>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to connect?</h2>
          <p className="text-[#9999b0] mb-8 max-w-md mx-auto">Join the NexChat community. Free forever, no credit card needed.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 btn-gradient rounded-2xl text-white font-semibold text-sm shadow-xl shadow-violet-900/30 hover:scale-[1.03] transition-all duration-200"
          >
            Create Free Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>
      </section>

      <AdBanner/>
    </div>
  );
}
