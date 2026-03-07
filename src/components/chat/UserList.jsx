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
        ['#7C3AED', '#A78BFA'],
        ['#2563EB', '#60A5FA'],
        ['#059669', '#34D399'],
        ['#D97706', '#FCD34D'],
        ['#DB2777', '#F9A8D4'],
        ['#DC2626', '#FCA5A5'],
        ['#0891B2', '#67E8F9'],
        ['#7C2D12', '#FCA5A5'],
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return p[Math.abs(h) % p.length];
};

const UserAvatar = ({ name, size = 'md', online }) => {
    const [from, to] = getColor(name);
    const sz = size === 'lg'
        ? 'w-11 h-11 text-sm'
        : size === 'sm'
            ? 'w-8 h-8 text-[11px]'
            : 'w-10 h-10 text-[13px]';
    const dotSz = size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3';
    return (
        <div className="relative flex-shrink-0">
            <div
                className={`${sz} rounded-full flex items-center justify-center font-bold text-white select-none shadow-sm`}
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
                {(name || '?').charAt(0).toUpperCase()}
            </div>
            {online !== undefined && (
                <span className={`
                    absolute -bottom-[1px] -right-[1px] ${dotSz} rounded-full border-[2px] border-[#0c0c0c]
                    ${online ? 'bg-emerald-500 shadow-[0_0_5px_rgba(52,211,153,0.7)]' : 'bg-gray-600'}
                `} />
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
}) => {
    const [search, setSearch] = useState('');
    const currentInfo = usersCache?.[currentUser?.uid];
    const myName = currentInfo?.displayName || getDefaultName(currentUser?.email);

    const others = allRegisteredUsers.filter(u => u.id !== currentUser?.uid);
    const filtered = others.filter(u =>
        !search ||
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
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
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setShowUsers(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-[300px] md:w-[272px] lg:w-[300px]
                flex flex-col
                bg-[#0c0c0c] border-r border-white/[0.05]
                transform transition-transform duration-300 ease-out
                ${showUsers ? 'translate-x-0 shadow-[4px_0_40px_rgba(0,0,0,0.6)]' : '-translate-x-full md:translate-x-0'}
            `}>

                {/* ── Header ── */}
                <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-white/[0.04]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            {/* Gradient logo mark */}
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-md shadow-violet-900/40">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h2 className="text-[17px] font-semibold text-white tracking-[-0.3px]">Chats</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            {onlineCount > 0 && (
                                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                                    {onlineCount} online
                                </span>
                            )}
                            {/* Close btn – mobile only */}
                            <button
                                onClick={() => setShowUsers(false)}
                                className="md:hidden w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                                aria-label="Close"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search…"
                            style={{ fontSize: '16px' }}
                            className="
                                w-full bg-[#161616] text-[14px] text-white
                                placeholder-gray-600 rounded-xl
                                pl-9 pr-8 py-2
                                border border-white/[0.06]
                                focus:outline-none focus:border-violet-500/40 focus:bg-[#1a1a1a]
                                transition-all duration-200
                            "
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Scrollable list ── */}
                <div
                    className="flex-1 overflow-y-auto py-1"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(139,92,246,0.2) transparent',
                    }}
                >
                    {/* Global Chat */}
                    <div className="px-2 pt-1 pb-0.5">
                        <button
                            onClick={() => pick(null)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-150 text-left
                                ${selectedChatPartner === null
                                    ? 'bg-violet-600/15 ring-1 ring-violet-500/25'
                                    : 'hover:bg-white/[0.04] active:bg-white/[0.07]'
                                }
                            `}
                        >
                            <div className="relative w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-600 to-pink-600 shadow-md shadow-violet-900/40">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0c0c] animate-pulse" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className={`text-[14px] font-semibold leading-tight ${selectedChatPartner === null ? 'text-white' : 'text-gray-200'}`}>
                                        Global Chat
                                    </span>
                                    <span className="text-[10px] text-emerald-500 flex-shrink-0 font-medium">live</span>
                                </div>
                                <p className="text-[12px] text-gray-500 truncate">
                                    {onlineCount} online · {others.length} members
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Section label */}
                    {sorted.length > 0 && (
                        <div className="px-5 py-2 mt-1">
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[1px]">
                                Direct Messages
                            </span>
                        </div>
                    )}

                    {/* User rows */}
                    <div className="px-2 space-y-0.5 pb-2">
                        {sorted.map(user => {
                            const selected = selectedChatPartner?.id === user.id;
                            const online = user.state === 'online';
                            const admin = isAdmin(user.email);
                            return (
                                <button
                                    key={user.id}
                                    onClick={() => pick(user)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-[11px] rounded-2xl transition-all duration-150 text-left
                                        ${selected
                                            ? 'bg-violet-600/15 ring-1 ring-violet-500/25'
                                            : 'hover:bg-white/[0.04] active:bg-white/[0.07]'
                                        }
                                    `}
                                >
                                    <UserAvatar name={user.displayName} online={online} size="md" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-[2px]">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className={`text-[14px] font-medium truncate leading-tight ${selected ? 'text-white' : 'text-gray-200'}`}>
                                                    {user.displayName}
                                                </span>
                                                {admin && <AdminBadge />}
                                            </div>
                                            <span className="text-[11px] text-gray-600 flex-shrink-0 ml-1">
                                                {online ? '' : formatLastSeen(user.lastChanged)}
                                            </span>
                                        </div>
                                        <p className={`text-[12px] truncate ${online ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            {online ? 'Active now' : 'Tap to message'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}

                        {/* Empty: search */}
                        {sorted.length === 0 && search && (
                            <div className="py-12 text-center">
                                <div className="w-12 h-12 rounded-full bg-white/5 mx-auto mb-3 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-[13px] text-gray-500">No results for "{search}"</p>
                            </div>
                        )}

                        {/* Empty: no users */}
                        {sorted.length === 0 && !search && (
                            <div className="py-12 text-center">
                                <p className="text-[13px] text-gray-600">No other users yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── My profile footer ── */}
                <div className="flex-shrink-0 border-t border-white/[0.05] px-3 py-3">
                    <div className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-white/[0.03] transition-colors">
                        <UserAvatar name={myName} online={true} size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-white truncate leading-tight">{myName}</p>
                            <p className="text-[11px] text-emerald-500 leading-tight">You · Active</p>
                        </div>
                        {currentUser?.emailVerified && (
                            <div className="flex-shrink-0" title="Verified">
                                <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UserList;