import React, { useState } from 'react';
import { updateDisplayName, getDefaultName } from '../../firebase/db';
import { updateUserPassword } from '../../firebase/auth';
import { ADMIN_EMAIL } from '../../firebase/config';
import Avatar from './Avatar';
import AdminBadge from './AdminBadge';

const SOCIAL = [
  { name: 'Instagram', url: 'https://www.instagram.com/raja_roy47', color: '#E1306C',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg> },
  { name: 'GitHub', url: 'https://github.com/rajaroy47', color: '#fff',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajaroy47', color: '#0A66C2',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

const isAdminEmail = (e) => e?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-[12px] font-medium text-gray-400 mb-1.5">{label}</label>}
    <input
      {...props}
      className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
    />
  </div>
);

const Msg = ({ text }) => {
  if (!text) return null;
  const ok = text.startsWith('✅');
  const err = text.startsWith('❌');
  return (
    <p className={`text-[12px] px-3 py-2 rounded-xl border ${ok ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : err ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
      {text}
    </p>
  );
};

export const SettingsModal = ({ currentUser, usersCache, onClose, isInitialSetup = false }) => {
  const [tab, setTab] = useState('profile');
  const [busy, setBusy] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const info = usersCache?.[currentUser?.uid] || {};
  const fallback = getDefaultName(currentUser?.email);
  const [name, setName] = useState(info.displayName || fallback);
  const [pw, setPw] = useState({ cur: '', next: '', confirm: '' });

  const saveProfile = async () => {
    const n = name.trim();
    if (n === info.displayName) { setProfileMsg('⚠️ Name is unchanged'); return; }
    if (n.length < 3 || n.length > 20) { setProfileMsg('❌ Name must be 3–20 characters'); return; }
    setBusy(true);
    try {
      await updateDisplayName(currentUser.uid, n);
      setProfileMsg('✅ Display name updated!');
      if (isInitialSetup) setTimeout(onClose, 1200);
    } catch (e) { setProfileMsg(`❌ ${e.message}`); }
    finally { setBusy(false); }
  };

  const savePassword = async () => {
    if (pw.next.length < 6) { setPassMsg('❌ Password must be at least 6 chars'); return; }
    if (pw.next !== pw.confirm) { setPassMsg('❌ Passwords do not match'); return; }
    setBusy(true);
    try {
      await updateUserPassword(currentUser, pw.cur, pw.next);
      setPassMsg('✅ Password updated!');
      setPw({ cur: '', next: '', confirm: '' });
    } catch (e) { setPassMsg(`❌ ${e.message}`); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[#111] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-nc-slide-up">
        {/* Accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-violet-500 to-pink-500 flex-shrink-0" />

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-2.5 pb-0 sm:hidden flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-[17px] font-semibold text-white leading-tight">
              {isInitialSetup ? 'Set up your profile 👋' : 'Settings'}
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {isInitialSetup ? 'Choose a display name to get started' : 'Manage your account'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User pill */}
        <div className="mx-5 mb-3 flex-shrink-0 flex items-center gap-3 px-3 py-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
          <Avatar user={{ displayName: info.displayName || fallback }} size="md" online />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">{info.displayName || fallback}</p>
            <p className="text-[11px] text-gray-500 truncate">{currentUser?.email}</p>
          </div>
          {isAdminEmail(currentUser?.email) && <AdminBadge size="sm" />}
        </div>

        {/* Tabs */}
        {!isInitialSetup && (
          <div className="flex gap-1.5 mx-5 mb-3 flex-shrink-0 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            {['profile', 'security'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all ${tab === t ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto nc-scroll px-5 pb-5 space-y-3">
          {(tab === 'profile' || isInitialSetup) && (
            <>
              <Input
                label="Display name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Raja Roy"
                maxLength={20}
                style={{ fontSize: '16px' }}
              />
              <p className="text-[11px] text-gray-600 -mt-1">3–20 characters · Currently: <span className="text-violet-400">{info.displayName || fallback}</span></p>
              <Msg text={profileMsg} />
              <button
                onClick={saveProfile}
                disabled={busy || name.trim().length < 3}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white text-[14px] font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
              >
                {busy ? 'Saving…' : 'Save Changes'}
              </button>

              {!isInitialSetup && (
                <div className="pt-3 border-t border-white/[0.05]">
                  <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">Developer</p>
                  <div className="grid grid-cols-3 gap-2">
                    {SOCIAL.map(s => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all">
                        <span className="text-gray-400 group-hover:text-white transition-colors" style={{ color: s.color }}>{s.icon}</span>
                        <span className="text-[11px] text-gray-500 group-hover:text-gray-300">{s.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'security' && !isInitialSetup && (
            <>
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-[12px] text-amber-400">You'll need your current password to change it</p>
              </div>
              <Input label="Current password" type="password" value={pw.cur} onChange={e => setPw(p => ({ ...p, cur: e.target.value }))} placeholder="Current password" style={{ fontSize: '16px' }} />
              <Input label="New password" type="password" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} placeholder="Min. 6 characters" style={{ fontSize: '16px' }} />
              <Input label="Confirm password" type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" style={{ fontSize: '16px' }} />
              <Msg text={passMsg} />
              <button
                onClick={savePassword}
                disabled={busy || !pw.cur || pw.next.length < 6 || pw.next !== pw.confirm}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-[14px] font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
              >
                {busy ? 'Updating…' : 'Update Password'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;