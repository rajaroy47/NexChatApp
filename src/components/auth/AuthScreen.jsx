import React, { useState } from 'react';
import { authMethods } from '../../firebase/auth';
import { saveUserInfo, getDefaultName } from '../../firebase/db';

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-violet-500/30 transition-all group"
  >
    <div className="text-[#9999b0] group-hover:text-white transition-colors">{icon}</div>
    <span className="text-[11px] text-[#55556a] group-hover:text-[#9999b0] transition-colors">{label}</span>
  </a>
);

const SOCIAL = [
  {
    label: 'Instagram', href: 'https://www.instagram.com/raja_roy47',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.5"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>,
  },
  {
    label: 'GitHub', href: 'https://github.com/rajaroy47',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://www.linkedin.com/in/rajaroy47',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
];

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    if (!email || !password) { setMessage('Email and password are required.'); setLoading(false); return; }
    try {
      if (isSigningUp) {
        const { user } = await authMethods.signup(email, password);
        await authMethods.sendVerification(user);
        setTimeout(async () => {
          try { await saveUserInfo(user.uid, user.email, displayName.trim()); } catch (e) { console.error(e); }
        }, 50);
        setMessage('✅ Check your email (including spam) to verify, then log in.');
      } else {
        const { user } = await authMethods.login(email, password);
        if (!user.emailVerified) {
          await authMethods.logout();
          setMessage('⚠️ Your email is not verified. Check your inbox.');
        }
      }
    } catch (e) {
      const msgs = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Try again.',
        'auth/email-already-in-use': 'Email already registered.',
        'auth/invalid-email': 'Invalid email format.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setMessage('❌ ' + (msgs[e.code] || e.message));
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!email) { setMessage('⚠️ Enter your email first.'); return; }
    setLoading(true);
    try {
      await authMethods.resetPassword(email);
      setMessage('✅ Password reset email sent!');
    } catch (e) { setMessage('❌ ' + e.message); }
    finally { setLoading(false); }
  };

  const msgColor = message.startsWith('✅') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    : message.startsWith('⚠️') ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    : message.startsWith('❌') ? 'bg-red-500/10 border-red-500/20 text-red-400'
    : 'bg-violet-500/10 border-violet-500/20 text-violet-400';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060608] px-4 py-8 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[100px] pointer-events-none"/>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full filter blur-[100px] pointer-events-none"/>

      <div className="w-full max-w-[400px] animate-fade-in-up">
        {/* Card */}
        <div className="bg-[#0e0e12] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500"/>

          <div className="p-7 sm:p-8">
            {/* Logo + Title */}
            <div className="text-center mb-7">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-900/40 animate-glow-pulse">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white tracking-tight">NexChat</h1>
                  <p className="text-xs text-[#55556a]">v2.1 · Futuristic Messaging</p>
                </div>
              </div>
              <p className="text-[#9999b0] text-sm">{isSigningUp ? 'Create your account' : 'Welcome back!'}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isSigningUp && (
                <div className="relative animate-fade-in-up">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Display name (optional)"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    maxLength={20}
                    style={{ fontSize: '16px' }}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </span>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ fontSize: '16px' }}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a] pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={isSigningUp ? 'new-password' : 'current-password'}
                  style={{ fontSize: '16px' }}
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9999b0] transition-colors"
                >
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>

              {message && (
                <div className={`p-3 rounded-2xl border text-sm ${msgColor} animate-fade-in-up`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl btn-gradient text-white font-semibold text-sm shadow-lg shadow-violet-900/30 hover:shadow-violet-600/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Processing...</>
                  : isSigningUp ? 'Create Account' : 'Sign In'
                }
              </button>
            </form>

            {/* Switch mode / forgot */}
            <div className="mt-5 flex flex-col items-center gap-2">
              <button
                onClick={() => { setIsSigningUp(p => !p); setMessage(''); }}
                className="text-sm text-[#9999b0] hover:text-white transition-colors"
              >
                {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
                <span className="text-violet-400 font-medium hover:text-violet-300">
                  {isSigningUp ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
              {!isSigningUp && (
                <button onClick={handleReset} className="text-sm text-[#55556a] hover:text-[#9999b0] transition-colors">
                  Forgot password?
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/[0.05]"/>
              <span className="text-xs text-[#55556a]">Developer</span>
              <div className="flex-1 h-px bg-white/[0.05]"/>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL.map(s => <SocialLink key={s.label} {...s} />)}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#55556a] mt-5">
          Built with <span className="animate-heartbeat text-red-500">❤️</span> by Raja
        </p>
      </div>
    </div>
  );
}
