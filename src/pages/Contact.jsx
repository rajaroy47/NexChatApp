import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-violet-600/8 rounded-full filter blur-[100px]"/>
      </div>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Contact</span>
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-[#9999b0]">Have a question or feedback? We'd love to hear from you.</p>
        </div>

        {sent ? (
          <div className="bg-[#0e0e12] border border-emerald-500/20 rounded-3xl p-10 text-center animate-pop-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Message sent!</h2>
            <p className="text-[#9999b0] text-sm">Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        ) : (
          <div className="bg-[#0e0e12] border border-white/[0.07] rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500"/>
            <form onSubmit={handleSubmit} className="p-7 space-y-4">
              {[
                { key: 'name', label: 'Name', type: 'text', ph: 'Your name' },
                { key: 'email', label: 'Email', type: 'email', ph: 'your@email.com' },
              ].map(({ key, label, type, ph }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-[#9999b0] uppercase tracking-wide block mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={ph}
                    required
                    style={{ fontSize: '16px' }}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-[#9999b0] uppercase tracking-wide block mb-1.5">Message</label>
                <textarea
                  value={form.msg}
                  onChange={e => setForm(p => ({ ...p, msg: e.target.value }))}
                  placeholder="Your message..."
                  required
                  rows={5}
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 transition-all text-sm resize-none"
                />
              </div>
              <button type="submit" className="w-full py-3.5 btn-gradient rounded-2xl text-white font-semibold text-sm hover:scale-[1.02] transition-all shadow-lg">
                Send Message
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: '📧', label: 'Email', val: 'contact@nexchat.app' },
            { icon: '💬', label: 'Discord', val: 'NexChat Community' },
            { icon: '🐦', label: 'Twitter', val: '@nexchat' },
          ].map(({ icon, label, val }) => (
            <div key={label} className="bg-[#0e0e12] border border-white/[0.06] rounded-2xl p-4 text-center">
              <span className="text-xl block mb-2">{icon}</span>
              <p className="text-xs font-semibold text-[#9999b0] mb-1">{label}</p>
              <p className="text-xs text-[#55556a]">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
