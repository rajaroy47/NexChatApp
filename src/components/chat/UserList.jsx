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
    ['#7C3AED','#A78BFA'],['#2563EB','#60A5FA'],['#059669','#34D399'],
    ['#D97706','#FCD34D'],['#DB2777','#F9A8D4'],['#DC2626','#FCA5A5'],
    ['#0891B2','#67E8F9'],['#7C2D12','#FCA5A5'],
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return p[Math.abs(h) % p.length];
};

const UserAvatar = ({ name, online, size = 'md' }) => {
  const [from, to] = getColor(name);
  const sz = size === 'lg' ? 'w-11 h-11 text-sm' : size === 'sm' ? 'w-8 h-8 text-[11px]' : 'w-10 h-10 text-[13px]';
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
        <span className={`absolute -bottom-px -right-px ${dotSz} rounded-full border-2 border-[#0c0c0f] ${online ? 'bg-emerald-500' : 'bg-[#55556a]'}`}/>
      )}
    </div>
  );
};

export const UserList = ({
  allRegisteredUsers, selectedChatPartner, setSelectedChatPartner,
  setShowUsers, currentUser, usersCache, showUsers, onSettings, onLogout
}) => {
  const [search, setSearch] = useState('');
  const currentInfo = usersCache?.[currentUser?.uid];
  const myName = currentInfo?.displayName || getDefaultName(currentUser?.email);

  const others = allRegisteredUsers.filter(u => u.id !== currentUser?.uid);
  const filtered = others.filter(u =>
    !search || u.displayName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (a.state === 'online' && b.state !== 'online') return -1;
    if (b.state === 'online' && a.state !== 'online') return 1;
    return (b.lastChanged || 0) - (a.lastChanged || 0);
  });
  const onlineCount = others.filter(u => u.state === 'online').length;

  const pick = useCallback((user) => {
    setSelectedChatPartner(user);
    setShowUsers(false);
  }, [setSelectedChatPartner, setShowUsers]);

  return (
    <>
      {/* Mobile backdrop */}
      {showUsers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowUsers(false)}/>
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[300px] md:w-[280px] lg:w-[300px] flex flex-col
        bg-[#0c0c0f] border-r border-white/[0.05]
        transform transition-transform duration-300 ease-out
        ${showUsers ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-5 pb-3">
          {/* Logo row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight leading-none">NexChat</h2>
                <p className="text-[10px] text-[#55556a] mt-0.5">Messages</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onlineCount > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"/>
                  {onlineCount}
                </span>
              )}
              <button
                onClick={() => setShowUsers(false)}
                className="md:hidden w-8 h-8 ml-1 rounded-xl flex items-center justify-center text-[#55556a] hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55556a] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              style={{ fontSize: '16px' }}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/[0.04] text-[13px] text-white placeholder-[#55556a] border border-white/[0.06] focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-white">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto nexchat-scrollbar px-2 py-1">
          {/* Global Chat */}
          <button
            onClick={() => pick(null)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-150 text-left mb-1
              ${selectedChatPartner === null
                ? 'bg-violet-600/15 border border-violet-500/25'
                : 'hover:bg-white/[0.04] active:bg-white/[0.07] border border-transparent'}
            `}
          >
            <div className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-600 to-pink-600 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0c0f] animate-pulse"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[14px] font-semibold text-white leading-tight">Global Chat</span>
                <span className="text-[11px] text-emerald-500 flex-shrink-0 font-medium">live</span>
              </div>
              <p className="text-[12px] text-[#55556a] truncate">{onlineCount} online · {others.length} members</p>
            </div>
          </button>

          {/* DM label */}
          {sorted.length > 0 && (
            <div className="px-3 py-2 mt-2">
              <span className="text-[10px] font-bold text-[#55556a] uppercase tracking-[1px]">Direct Messages</span>
            </div>
          )}

          {/* Users */}
          <div className="space-y-0.5">
            {sorted.map(user => {
              const selected = selectedChatPartner?.id === user.id;
              const online = user.state === 'online';
              const admin = isAdmin(user.email);
              return (
                <button
                  key={user.id}
                  onClick={() => pick(user)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 text-left
                    ${selected
                      ? 'bg-violet-600/15 border border-violet-500/25'
                      : 'hover:bg-white/[0.04] active:bg-white/[0.06] border border-transparent'}
                  `}
                >
                  <UserAvatar name={user.displayName} online={online}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-[2px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[14px] font-medium text-gray-200 truncate leading-tight">{user.displayName}</span>
                        {admin && <AdminBadge/>}
                      </div>
                      <span className="text-[11px] text-[#55556a] flex-shrink-0 ml-1">
                        {online ? '' : formatLastSeen(user.lastChanged)}
                      </span>
                    </div>
                    <p className={`text-[12px] truncate ${online ? 'text-emerald-500' : 'text-[#55556a]'}`}>
                      {online ? '● Active now' : 'Tap to message'}
                    </p>
                  </div>
                </button>
              );
            })}

            {sorted.length === 0 && search && (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#55556a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <p className="text-[13px] text-[#55556a]">No results for "{search}"</p>
              </div>
            )}
            {sorted.length === 0 && !search && (
              <div className="py-10 text-center">
                <p className="text-[13px] text-[#55556a]">No other users yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - current user */}
        <div className="flex-shrink-0 border-t border-white/[0.05] p-3">
          <div className="flex items-center gap-2.5 px-2">
            <UserAvatar name={myName} online={true} size="sm"/>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate leading-tight">{myName}</p>
              <p className="text-[11px] text-emerald-500">Active</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onSettings}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[#55556a] hover:text-white hover:bg-white/[0.05] transition-colors"
                title="Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserList;
