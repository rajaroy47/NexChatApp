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
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385..." />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/rajaroy47",
    color: "from-blue-500 to-blue-700",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569..." />
      </svg>
    ),
  },
];

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

  const msgCls = (msg) =>
    msg.startsWith("✅")
      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
      : msg.startsWith("⚠️")
      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
      : "bg-red-500/10 border-red-500/20 text-red-400";

  const handleUpdateDisplayName = async () => {
    const trimmed = newDisplayName.trim();
    if (trimmed.length < 3)
      return setMessages((p) => ({
        ...p,
        profile: "❌ Name must be at least 3 characters",
      }));

    setLoading(true);
    try {
      await updateDisplayName(currentUser.uid, trimmed);
      setMessages((p) => ({ ...p, profile: "✅ Display name updated!" }));
    } catch (e) {
      setMessages((p) => ({ ...p, profile: `❌ ${e.message}` }));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.new.length < 6)
      return setMessages((p) => ({
        ...p,
        password: "❌ Min 6 characters",
      }));

    if (passwords.new !== passwords.confirm)
      return setMessages((p) => ({
        ...p,
        password: "❌ Passwords do not match",
      }));

    setLoading(true);
    try {
      await updateUserPassword(
        currentUser,
        passwords.current,
        passwords.new
      );
      setMessages((p) => ({ ...p, password: "✅ Password updated!" }));
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (e) {
      setMessages((p) => ({ ...p, password: `❌ ${e.message}` }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-2xl overflow-hidden">

        {/* top gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-pink-500 to-orange-500" />

        {/* header */}
        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isInitialSetup ? "Set up your profile 👋" : "Settings"}
            </h2>
            <p className="text-xs text-[#55556a]">
              Manage your account
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] hover:bg-white/[0.1]"
          >
            ✕
          </button>
        </div>

        {/* tabs */}
        {!isInitialSetup && (
          <div className="flex gap-2 p-3">
            {["profile", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 nexchat-scrollbar">

          {/* user card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: `linear-gradient(135deg, ${from}, ${to})`,
              }}
            >
              {userInfo.displayName?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm text-white break-all">
                {currentUser?.email}
              </p>
              {isAdmin(currentUser?.email) && (
                <span className="text-red-400 text-xs font-bold">
                  ⚡ Admin
                </span>
              )}
            </div>
          </div>

          {/* PROFILE TAB */}
          {(activeTab === "profile" || isInitialSetup) && (
            <>
              <input
                type="text"
                value={newDisplayName}
                onChange={(e) =>
                  setNewDisplayName(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                placeholder="Display name"
              />

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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && !isInitialSetup && (
            <>
              {["current", "new", "confirm"].map((k) => (
                <input
                  key={k}
                  type="password"
                  placeholder={`${k} password`}
                  value={passwords[k]}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      [k]: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white"
                />
              ))}

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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold"
              >
                Update Password
              </button>
            </>
          )}

          {/* developer section */}
          {!isInitialSetup && (
            <div className="pt-6 border-t border-white/[0.05]">
              <p className="text-xs text-center text-gray-500 mb-4">
                Connect with Developer
              </p>

              <div className="flex justify-center gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
                  >
                    {s.icon}
                    <span className="text-[10px]">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;