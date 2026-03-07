import React, { useState, useEffect } from 'react';
import { updateDisplayName, getDefaultName } from '../../firebase/db';
import { updateUserPassword } from '../../firebase/auth';
import { ADMIN_EMAIL } from '../../firebase/config';

const isAdmin = (email) => email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

const getAvatarColor = (name = '') => {
  const palette = [
    ['#7C3AED','#A78BFA'],['#2563EB','#60A5FA'],['#059669','#34D399'],
    ['#D97706','#FCD34D'],['#DB2777','#F9A8D4'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/raja_roy47', color: 'from-pink-500 to-red-500',
    icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><circle cx="12" cy="12" r="3.5"/><circle cx="18.406" cy="5.594" r="1.44"/></svg> },
  { name: 'GitHub', href: 'https://github.com/rajaroy47', color: 'from-gray-600 to-gray-800',
    icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rajaroy47', color: 'from-blue-500 to-blue-700',
    icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

export const SettingsModal = ({ currentUser, usersCache, onClose, isInitialSetup = false }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({ profile: '', password: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userInfo = usersCache?.[currentUser?.uid] || { displayName: getDefaultName(currentUser?.email) };
  const [newDisplayName, setNewDisplayName] = useState(userInfo.displayName || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const [from, to] = getAvatarColor(userInfo.displayName || '');

  const isDefaultName = (name) => name?.toLowerCase() === getDefaultName(currentUser?.email)?.toLowerCase();

  const handleUpdateDisplayName = async () => {
    const trimmed = newDisplayName.trim();
    if (trimmed === userInfo.displayName) { 
      setMessages(p => ({ ...p, profile: '⚠️ Name unchanged' })); 
      return; 
    }
    if (!isDefaultName(trimmed) && (trimmed.length < 3 || trimmed.length > 20)) {
      setMessages(p => ({ ...p, profile: '❌ Name must be 3–20 characters' })); 
      return;
    }
    setLoading(true);
    try {
      await updateDisplayName(currentUser.uid, trimmed);
      setMessages(p => ({ ...p, profile: '✅ Display name updated!' }));
      if (isInitialSetup) setTimeout(onClose, 1500);
    } catch (e) { 
      setMessages(p => ({ ...p, profile: `❌ ${e.message}` })); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.new.length < 6) { 
      setMessages(p => ({ ...p, password: '❌ Min 6 characters' })); 
      return; 
    }
    if (passwords.new !== passwords.confirm) { 
      setMessages(p => ({ ...p, password: '❌ Passwords do not match' })); 
      return; 
    }
    setLoading(true);
    try {
      await updateUserPassword(currentUser, passwords.current, passwords.new);
      setMessages(p => ({ ...p, password: '✅ Password updated!' }));
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (e) { 
      setMessages(p => ({ ...p, password: `❌ ${e.message}` })); 
    } finally { 
      setLoading(false); 
    }
  };

  const msgCls = (msg) => msg.startsWith('✅') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    : msg.startsWith('⚠️') ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    : 'bg-red-500/10 border-red-500/20 text-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`
        relative bg-[#0e0e12] border border-white/[0.08] shadow-2xl w-full 
        ${isMobile 
          ? 'rounded-t-3xl max-h-[90vh] animate-slide-up' 
          : 'rounded-3xl max-w-md max-h-[85vh] animate-scale-up'
        }
        overflow-hidden
      `}>
        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500"/>

        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isInitialSetup ? 'Set up your profile 👋' : 'Settings'}
              </h2>
              <p className="text-xs text-[#55556a] mt-0.5">
                {isInitialSetup ? 'Choose a display name to get started' : 'Manage your account'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-[#9999b0] hover:text-white transition-colors flex items-center justify-center active:scale-95"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          {!isInitialSetup && (
            <div className="flex gap-1.5 mt-3 sm:mt-4 bg-white/[0.03] rounded-2xl p-1">
              {['profile','security'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 py-2 px-2 sm:px-3 rounded-xl text-xs font-semibold capitalize transition-all
                    ${activeTab === tab 
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md' 
                      : 'text-[#9999b0] hover:text-white active:bg-white/5'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div 
          className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto nexchat-scrollbar" 
          style={{ maxHeight: isMobile ? 'calc(90vh - 120px)' : 'calc(85vh - 140px)' }}
        >
          {/* User card */}
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/[0.03] rounded-xl sm:rounded-2xl border border-white/[0.05] mb-4 sm:mb-5">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold text-white flex-shrink-0" 
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              {(userInfo.displayName || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#55556a]">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">{currentUser?.email}</p>
              {isAdmin(currentUser?.email) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-[10px] font-bold text-red-400 uppercase tracking-wide mt-1">
                  ⚡ Admin
                </span>
              )}
            </div>
            {currentUser?.emailVerified && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            )}
          </div>

          {/* Profile tab */}
          {(activeTab === 'profile' || isInitialSetup) && (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#9999b0] uppercase tracking-wide block mb-1.5 sm:mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={e => setNewDisplayName(e.target.value)}
                  placeholder="Enter display name (3–20 chars)"
                  maxLength={20}
                  style={{ fontSize: '16px' }}
                  className="
                    w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl 
                    bg-white/[0.04] border border-white/[0.08] text-white 
                    placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 
                    focus:bg-white/[0.06] transition-all text-sm
                  "
                />
                <p className="text-xs text-[#55556a] mt-1.5 flex flex-wrap items-center gap-1">
                  <span>Current:</span>
                  <span className="text-violet-400 truncate max-w-[150px] sm:max-w-[200px]">
                    {userInfo.displayName}
                  </span>
                  {isDefaultName(userInfo.displayName) && (
                    <span className="text-amber-500 whitespace-nowrap">(Default)</span>
                  )}
                </p>
              </div>
              
              {messages.profile && (
                <div className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm ${msgCls(messages.profile)}`}>
                  {messages.profile}
                </div>
              )}
              
              <button
                onClick={handleUpdateDisplayName}
                disabled={loading || newDisplayName.trim().length < 3}
                className="
                  w-full py-2.5 sm:py-3 btn-gradient text-white font-semibold 
                  rounded-xl sm:rounded-2xl hover:scale-[1.02] transition-all 
                  disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed 
                  text-sm active:scale-95
                "
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Security tab */}
          {activeTab === 'security' && !isInitialSetup && (
            <div className="space-y-3 sm:space-y-4">
              <div className="px-3 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>You'll need your current password to change it</span>
                </p>
              </div>
              
              {[
                { key: 'current', label: 'Current Password', ph: 'Enter current password' },
                { key: 'new', label: 'New Password', ph: 'Min. 6 characters' },
                { key: 'confirm', label: 'Confirm Password', ph: 'Confirm new password' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-[#9999b0] uppercase tracking-wide block mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw[key] ? 'text' : 'password'}
                      value={passwords[key]}
                      onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={ph}
                      style={{ fontSize: '16px' }}
                      className="
                        w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 
                        rounded-xl sm:rounded-2xl bg-white/[0.04] 
                        border border-white/[0.08] text-white 
                        placeholder-[#55556a] focus:outline-none 
                        focus:border-violet-500/50 focus:bg-white/[0.06] 
                        transition-all text-sm
                      "
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9999b0] p-1"
                      aria-label={showPw[key] ? 'Hide password' : 'Show password'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={showPw[key] 
                            ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                            : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          }
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {messages.password && (
                <div className={`px-3 py-2.5 rounded-xl border text-xs sm:text-sm ${msgCls(messages.password)}`}>
                  {messages.password}
                </div>
              )}
              
              <button
                onClick={handleUpdatePassword}
                disabled={loading || !passwords.current || passwords.new.length < 6 || passwords.new !== passwords.confirm}
                className="
                  w-full py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 
                  text-white font-semibold rounded-xl sm:rounded-2xl 
                  hover:scale-[1.02] transition-all disabled:opacity-50 
                  disabled:scale-100 disabled:cursor-not-allowed text-sm active:scale-95
                "
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* Social links */}
          {!isInitialSetup && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-white/[0.05]">
              <p className="text-xs font-semibold text-[#55556a] uppercase tracking-widest mb-2 sm:mb-3">
                Connect with Developer
              </p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {SOCIALS.map(s => (
                  <a 
                    key={s.name} 
                    href={s.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="
                      group relative flex flex-col items-center gap-1 p-2 sm:p-3 
                      bg-white/[0.03] hover:bg-white/[0.06] rounded-xl sm:rounded-2xl 
                      border border-white/[0.05] hover:border-white/[0.1] 
                      transition-all overflow-hidden active:scale-95
                    "
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${s.color} transition-opacity`}/>
                    <div className="relative text-[#9999b0] group-hover:text-white transition-colors">
                      {s.icon}
                    </div>
                    <span className="relative text-[9px] sm:text-[10px] text-[#55556a] group-hover:text-[#9999b0] transition-colors">
                      {s.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom safe area for mobile */}
        {isMobile && <div className="h-safe-bottom bg-transparent" />}
      </div>
    </div>
  );
};

export default SettingsModal;