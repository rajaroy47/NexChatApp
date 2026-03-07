import React, { useState, useEffect } from "react";
import { updateDisplayName, getDefaultName } from "../../firebase/db";
import { updateUserPassword } from "../../firebase/auth";
import { ADMIN_EMAIL } from "../../firebase/config";

const isAdmin = (email) =>
  email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

const getAvatarColor = (name = "") => {
  const palette = [
    ["#7C3AED", "#A78BFA"],
    ["#2563EB", "#60A5FA"],
    ["#059669", "#34D399"],
    ["#D97706", "#FCD34D"],
    ["#DB2777", "#F9A8D4"],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/raja_roy47",
    color: "from-pink-500 to-red-500",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/rajaroy47",
    color: "from-gray-600 to-gray-800",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/rajaroy47",
    color: "from-blue-500 to-blue-700",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// Eye icons for password visibility
const EyeIcon = ({ visible }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {visible ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    )}
  </svg>
);

export const SettingsModal = ({
  currentUser,
  usersCache,
  onClose,
  isInitialSetup = false,
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState({ profile: "", password: "" });

  const userInfo =
    usersCache?.[currentUser?.uid] || {
      displayName: getDefaultName(currentUser?.email),
    };

  const [newDisplayName, setNewDisplayName] = useState(
    userInfo.displayName || ""
  );

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [from, to] = getAvatarColor(userInfo.displayName || "");

  // Lock body scroll when modal opens
  useEffect(() => {
    // Save original overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup function to restore scroll
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []); // Empty dependency array means this runs once when modal mounts

  const msgCls = (msg) =>
    msg.startsWith("✅")
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      : msg.startsWith("⚠️")
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
      : "bg-red-500/10 border-red-500/20 text-red-400";

  const handleUpdateDisplayName = async () => {
    const trimmed = newDisplayName.trim();
    if (trimmed.length < 3 || trimmed.length > 20) {
      return setMessages((p) => ({
        ...p,
        profile: "❌ Name must be 3–20 characters",
      }));
    }

    setLoading(true);
    try {
      await updateDisplayName(currentUser.uid, trimmed);
      setMessages((p) => ({ ...p, profile: "✅ Display name updated!" }));
      setTimeout(() => {
        if (isInitialSetup) onClose();
      }, 1500);
    } catch (e) {
      setMessages((p) => ({ ...p, profile: `❌ ${e.message}` }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current) {
      return setMessages((p) => ({
        ...p,
        password: "❌ Current password is required",
      }));
    }
    if (passwords.new.length < 6) {
      return setMessages((p) => ({
        ...p,
        password: "❌ New password must be at least 6 characters",
      }));
    }
    if (passwords.new !== passwords.confirm) {
      return setMessages((p) => ({
        ...p,
        password: "❌ New passwords do not match",
      }));
    }

    setLoading(true);
    try {
      await updateUserPassword(currentUser, passwords.current, passwords.new);
      setMessages((p) => ({ ...p, password: "✅ Password updated successfully!" }));
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (e) {
      setMessages((p) => ({ ...p, password: `❌ ${e.message}` }));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPw(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-2xl overflow-hidden animate-modal-pop">
        {/* Top gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500" />

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {isInitialSetup ? "Welcome! 👋" : "Settings"}
            </h2>
            <p className="text-xs text-[#55556a] mt-0.5">
              {isInitialSetup ? "Set up your profile to get started" : "Manage your account"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#9999b0] hover:text-white transition-colors active:scale-95"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        {!isInitialSetup && (
          <div className="flex gap-2 p-3 bg-white/[0.02] mx-4 mt-2 rounded-xl">
            {["profile", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMessages({ profile: "", password: "" });
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 nexchat-scrollbar">
          {/* User card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div
              className="w-14 h-14 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
              }}
            >
              {userInfo.displayName?.charAt(0).toUpperCase() || "?"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm text-white break-all font-medium">
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {isAdmin(currentUser?.email) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-[10px] font-bold text-red-400 uppercase tracking-wide">
                    ⚡ Admin
                  </span>
                )}
                {currentUser?.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-bold text-emerald-400">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* PROFILE TAB */}
          {(activeTab === "profile" || isInitialSetup) && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9999b0] uppercase tracking-wide mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                  placeholder="Enter display name"
                  maxLength={20}
                  style={{ fontSize: "16px" }}
                />
                <p className="text-xs text-[#55556a] mt-1.5">
                  {newDisplayName.length}/20 characters
                </p>
              </div>

              {messages.profile && (
                <div
                  className={`p-3 rounded-xl border text-sm ${msgCls(
                    messages.profile
                  )}`}
                >
                  {messages.profile}
                </div>
              )}

              <button
                onClick={handleUpdateDisplayName}
                disabled={loading || !newDisplayName.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && !isInitialSetup && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-400 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>You'll need your current password to change it</span>
                </p>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-[#9999b0] uppercase tracking-wide mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    placeholder="Enter current password"
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9999b0] p-1"
                    aria-label={showPw.current ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPw.current} />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-[#9999b0] uppercase tracking-wide mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    placeholder="Min. 6 characters"
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9999b0] p-1"
                    aria-label={showPw.new ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPw.new} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#9999b0] uppercase tracking-wide mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPw.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder-[#55556a] focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    placeholder="Confirm new password"
                    style={{ fontSize: "16px" }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9999b0] p-1"
                    aria-label={showPw.confirm ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPw.confirm} />
                  </button>
                </div>
              </div>

              {messages.password && (
                <div
                  className={`p-3 rounded-xl border text-sm ${msgCls(
                    messages.password
                  )}`}
                >
                  {messages.password}
                </div>
              )}

              <button
                onClick={handleUpdatePassword}
                disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

          {/* Developer section */}
          {!isInitialSetup && (
            <div className="pt-6 border-t border-white/[0.05]">
              <p className="text-xs text-center text-[#55556a] mb-4 font-semibold tracking-wider">
                CONNECT WITH DEVELOPER
              </p>

              <div className="flex justify-center gap-6">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1.5 text-[#55556a] hover:text-white transition-all"
                  >
                    <div className="p-2 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors">
                      {s.icon}
                    </div>
                    <span className="text-[9px] font-medium">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add animation keyframes to your global CSS */}
      <style jsx>{`
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-pop {
          animation: modalPop 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;