import React, { useState, useCallback } from 'react';
import { ADMIN_EMAIL } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';

const isAdmin = (e) => e?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

const ago = (ts) => {
  if (!ts) return '';
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export const UserList = ({
  allRegisteredUsers, selectedChatPartner,
  setSelectedChatPartner, setShowUsers,
  currentUser, usersCache, showUsers,
}) => {
  const [q, setQ] = useState('');

  const myInfo = usersCache?.[currentUser?.uid];
  const myName = myInfo?.displayName || getDefaultName(currentUser?.email);

  const others = allRegisteredUsers.filter(u => u.id !== currentUser?.uid);
  const onlineCount = others.filter(u => u.state === 'online').length;

  const list = others
    .filter(u => !q || u.displayName?.toLowerCase().includes(q.toLowerCase()) || u.email?.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (a.state === 'online' && b.state !== 'online') return -1;
      if (b.state === 'online' && a.state !== 'online') return 1;
      return (b.lastChanged || 0) - (a.lastChanged || 0);
    });

  const pick = useCallback((u) => { setSelectedChatPartner(u); setShowUsers(false); }, [setSelectedChatPartner, setShowUsers]);

  return (
    <>
      {/* Mobile backdrop */}
      {showUsers && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" onClick={() => setShowUsers(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] sm:w-[300px] md:w-[260px] lg:w-[300px]
        flex flex-col bg-[#0e0e0e] border-r border-white/[0.05]
        transition-transform duration-300 ease-out
        ${showUsers ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* ── Header ── */}
        <div className="flex-shrink-0 border-b border-white/[0.05]">
          {/* Title row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-white tracking-tight">Chats</h2>
              {onlineCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {onlineCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowUsers(false)}
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3 relative">
            <svg className="absolute left-5.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" style={{ left: '1.1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search"
              style={{ fontSize: '16px', paddingLeft: '2rem' }}
              className="w-full py-2 pr-3 bg-white/[0.04] border border-white/[0.07] rounded-xl text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* ── List ── */}
        <div className="flex-1 overflow-y-auto nc-scroll">
          {/* Global Chat */}
          <div className="px-2 pt-2">
            <button
              onClick={() => pick(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-left ${selectedChatPartner === null ? 'bg-violet-600/15 ring-1 ring-violet-500/20' : 'hover:bg-white/[0.04] active:bg-white/[0.07]'}`}
            >
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-900/40">
                <svg className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0e0e0e] animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[13px] font-semibold leading-tight ${selectedChatPartner === null ? 'text-white' : 'text-gray-200'}`}>Global Chat</span>
                  <span className="text-[10px] text-emerald-500 font-medium flex-shrink-0">LIVE</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{onlineCount} online · {others.length} members</p>
              </div>
            </button>
          </div>

          {/* DMs section */}
          {list.length > 0 && (
            <p className="px-5 pt-3 pb-1 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Direct Messages</p>
          )}

          <div className="px-2 space-y-0.5 pb-2">
            {list.map(u => {
              const online = u.state === 'online';
              const sel = selectedChatPartner?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => pick(u)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-left ${sel ? 'bg-violet-600/15 ring-1 ring-violet-500/20' : 'hover:bg-white/[0.04] active:bg-white/[0.07]'}`}
                >
                  <Avatar user={u} size="md" online={online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-[13px] font-medium truncate leading-tight ${sel ? 'text-white' : 'text-gray-200'}`}>{u.displayName}</span>
                        {isAdmin(u.email) && <AdminBadge size="sm" />}
                      </div>
                      {!online && u.lastChanged && (
                        <span className="text-[10px] text-gray-600 flex-shrink-0">{ago(u.lastChanged)}</span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${online ? 'text-emerald-500' : 'text-gray-600'}`}>
                      {online ? 'Active now' : 'Offline'}
                    </p>
                  </div>
                </button>
              );
            })}

            {list.length === 0 && (
              <div className="py-10 text-center">
                {q ? (
                  <p className="text-[12px] text-gray-600">No results for "<span className="text-gray-400">{q}</span>"</p>
                ) : (
                  <p className="text-[12px] text-gray-600">No users yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Me / footer ── */}
        <div className="flex-shrink-0 border-t border-white/[0.05] p-3">
          <div className="flex items-center gap-2.5 px-2">
            <Avatar user={{ displayName: myName }} size="sm" online />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-white truncate leading-tight">{myName}</p>
              <p className="text-[10px] text-emerald-500">Active now</p>
            </div>
            {currentUser?.emailVerified && (
              <svg className="w-4 h-4 text-violet-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserList;