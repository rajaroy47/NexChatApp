import React, { useCallback, useState } from 'react';
import { ADMIN_EMAIL } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import AdminBadge from '../common/AdminBadge';

const isAdmin = (email) => email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

const formatLastSeen = (ts) => {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getColor = (name = '') => {
  const p = [
    ['#7C3AED','#A78BFA'],
    ['#2563EB','#60A5FA'],
    ['#059669','#34D399'],
    ['#D97706','#FCD34D'],
    ['#DB2777','#F9A8D4'],
    ['#DC2626','#FCA5A5'],
    ['#0891B2','#67E8F9'],
    ['#7C2D12','#FCA5A5'],
  ];

  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }

  return p[Math.abs(h) % p.length];
};

const UserAvatar = ({ name, online, size = 'md' }) => {
  const [from, to] = getColor(name);

  const sz =
    size === 'lg'
      ? 'w-11 h-11 text-sm'
      : size === 'sm'
      ? 'w-8 h-8 text-[11px]'
      : 'w-10 h-10 text-[13px]';

  const dotSz = size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3';

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sz} rounded-full flex items-center justify-center font-bold text-white select-none`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {(name || '?').charAt(0).toUpperCase()}
      </div>

      {online !== undefined && (
        <span
          className={`absolute -bottom-px -right-px ${dotSz} rounded-full border-2 border-[#0c0c0f] ${
            online ? 'bg-emerald-500' : 'bg-[#55556a]'
          }`}
        />
      )}
    </div>
  );
};

export const UserList = ({
  allRegisteredUsers,
  selectedChatPartner,
  setSelectedChatPartner,
  setShowUsers,
  currentUser,
  usersCache,
  showUsers,
  onSettings,
  onLogout,
}) => {

  const [search, setSearch] = useState('');

  const currentInfo = usersCache?.[currentUser?.uid];
  const myName =
    currentInfo?.displayName || getDefaultName(currentUser?.email);

  const others = allRegisteredUsers.filter(
    (u) => u.id !== currentUser?.uid
  );

  const filtered = others.filter(
    (u) =>
      !search ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a.state === 'online' && b.state !== 'online') return -1;
    if (b.state === 'online' && a.state !== 'online') return 1;
    return (b.lastChanged || 0) - (a.lastChanged || 0);
  });

  const onlineCount = others.filter((u) => u.state === 'online').length;

  const pick = useCallback(
    (user) => {
      setSelectedChatPartner(user);
      setShowUsers(false);
    },
    [setSelectedChatPartner, setShowUsers]
  );

  return (
    <>
      {showUsers && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowUsers(false)}
        />
      )}

      <aside
        className={`
        min-w-0
        fixed md:static inset-y-0 left-0 z-50
        w-[85vw] sm:w-[320px] md:w-[280px] lg:w-[300px]
        max-w-[340px]
        flex flex-col
        bg-[#0c0c0f]
        border-r border-white/[0.05]
        overflow-hidden
        transform transition-transform duration-300 ease-out
        ${showUsers ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full md:translate-x-0'}
      `}
      >

        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-5 pb-3">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2.5">

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01"/>
                </svg>
              </div>

              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  NexChat
                </h2>
                <p className="text-[10px] text-[#55556a]">
                  Messages
                </p>
              </div>

            </div>

            <button
              onClick={() => setShowUsers(false)}
              className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center text-[#55556a] hover:text-white hover:bg-white/[0.05]"
            >
              ✕
            </button>

          </div>

          {/* Search */}
          <div className="relative">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              style={{ fontSize: '16px' }}
              className="w-full pl-4 pr-4 py-2.5 rounded-2xl bg-white/[0.04] text-[13px] text-white placeholder-[#55556a] border border-white/[0.06] focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
            />

          </div>

        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden nexchat-scrollbar px-2 py-1">

          {sorted.map((user) => {

            const selected = selectedChatPartner?.id === user.id;
            const online = user.state === 'online';
            const admin = isAdmin(user.email);

            return (
              <button
                key={user.id}
                onClick={() => pick(user)}
                className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all
                ${selected
                  ? 'bg-violet-600/15 border border-violet-500/25'
                  : 'hover:bg-white/[0.04]'}
              `}
              >

                <UserAvatar
                  name={user.displayName}
                  online={online}
                />

                <div className="flex-1 min-w-0">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[14px] font-medium text-gray-200 truncate">
                        {user.displayName}
                      </span>
                      {admin && <AdminBadge />}
                    </div>

                    <span className="text-[11px] text-[#55556a] ml-1">
                      {online ? '' : formatLastSeen(user.lastChanged)}
                    </span>

                  </div>

                  <p
                    className={`text-[12px] truncate ${
                      online
                        ? 'text-emerald-500'
                        : 'text-[#55556a]'
                    }`}
                  >
                    {online ? '● Active now' : 'Tap to message'}
                  </p>

                </div>

              </button>
            );

          })}

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/[0.05] p-3">

          <div className="flex items-center gap-2.5 px-2">

            <UserAvatar name={myName} online={true} size="sm"/>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">
                {myName}
              </p>
              <p className="text-[11px] text-emerald-500">
                Active
              </p>
            </div>

            <button
              onClick={onSettings}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#55556a] hover:text-white hover:bg-white/[0.05]"
            >
              ⚙
            </button>

            <button
              onClick={onLogout}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
            >
              ⎋
            </button>

          </div>

        </div>

      </aside>
    </>
  );
};

export default UserList;
