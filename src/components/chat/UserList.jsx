import React, { useCallback, useState } from 'react';
import { ADMIN_EMAIL } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';

const formatLastSeen = (timestamp) => {
    if (!timestamp) return '';
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'active now';
    const m = Math.floor(diff / 60);
    if (m < 60) return `active ${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `active ${h}h ago`;
    const d = Math.floor(h / 24);
    return `active ${d}d ago`;
};

const isAdmin = (email) => email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

export const UserList = ({ 
    allRegisteredUsers, 
    selectedChatPartner, 
    setSelectedChatPartner, 
    setShowUsers, 
    currentUser,
    usersCache,
    showUsers
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const currentUserInfo = usersCache[currentUser?.uid];
    const currentDisplayName = currentUserInfo?.displayName || 'Guest';
    const isClientAdmin = isAdmin(currentUser?.email);

    const filteredUsers = allRegisteredUsers.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users: online first, then by last active
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a.state === 'online' && b.state !== 'online') return -1;
        if (a.state !== 'online' && b.state === 'online') return 1;
        return (b.lastChanged || 0) - (a.lastChanged || 0);
    });

    const getFullUserList = useCallback(() => {
        const onlineCount = allRegisteredUsers.filter(u => u.state === 'online').length;

        // Global Chat Option - Instagram style
        const globalChatButton = (
            <button
                key="global-chat-btn"
                onClick={() => {
                    setSelectedChatPartner(null);
                    setShowUsers(false); 
                }}
                className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-2
                    ${selectedChatPartner === null 
                        ? 'bg-purple-500/20 border border-purple-500/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }
                `}
            >
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0C0C0C]" />
                </div>
                <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${selectedChatPartner === null ? 'text-white' : 'text-gray-300'}`}>
                        Global Chat
                    </p>
                    <p className="text-xs text-gray-500">
                        {onlineCount} online • {allRegisteredUsers.length} members
                    </p>
                </div>
            </button>
        );

        // User List Items - Instagram style
        const userListItems = sortedUsers.map((info) => {
            const isSelected = selectedChatPartner?.id === info.id;
            const isOnline = info.state === 'online';
            const isUserAdmin = isAdmin(info.email); 
            const lastSeen = info.lastChanged ? formatLastSeen(info.lastChanged) : '';

            return (
                <div 
                    key={info.id} 
                    onClick={() => {
                        setSelectedChatPartner(info);
                        setShowUsers(false); 
                    }}
                    className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                        ${isSelected 
                            ? 'bg-purple-500/20' 
                            : 'hover:bg-white/5'
                        }
                    `}
                >
                    {/* Avatar with Status - Instagram style */}
                    <div className="relative">
                        <Avatar user={info} size="md" />
                        {isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse" />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-white truncate">
                                {info.displayName}
                            </p>
                            {isUserAdmin && isClientAdmin && <AdminBadge size="sm" />}
                        </div>
                        <p className="text-xs text-gray-500">
                            {isOnline ? 'Active now' : lastSeen}
                        </p>
                    </div>

                    {/* Unread Badge - You can add unread count logic */}
                    {Math.random() > 0.7 && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                </div>
            );
        });

        return [globalChatButton, ...userListItems];
    }, [sortedUsers, selectedChatPartner, isClientAdmin, setSelectedChatPartner, setShowUsers, allRegisteredUsers.length]);

    return (
        <>
            {/* Mobile Backdrop - Instagram style */}
            {showUsers && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 md:hidden animate-fade-in"
                    onClick={() => setShowUsers(false)}
                />
            )}

            {/* User List Panel - Instagram style sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-80 bg-[#0C0C0C] 
                transform transition-transform duration-300 ease-out
                ${showUsers ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col border-r border-white/5
            `}>
                {/* Header - Instagram style */}
                <div className="sticky top-0 bg-[#0C0C0C] z-10">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-semibold text-white">Chats</h2>
                            <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-gray-400">
                                {allRegisteredUsers.length}
                            </span>
                        </div>
                        <button 
                            onClick={() => setShowUsers(false)} 
                            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search Bar - Instagram style */}
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search"
                                className="w-full px-4 py-2.5 pl-10 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                            />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* User List - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                    <div className="space-y-1">
                        {getFullUserList()}
                    </div>
                </div>

                {/* Current User - Instagram style footer */}
                <div className="sticky bottom-0 bg-[#0C0C0C] border-t border-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar user={{ displayName: currentDisplayName }} size="sm" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {currentDisplayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {currentUser?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserList;