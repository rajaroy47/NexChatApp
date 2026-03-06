import React, { useCallback, useState } from 'react';
import { ADMIN_EMAIL } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';

const timeAgo = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') return '';
    
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'just now';
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
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

    const getFullUserList = useCallback(() => {
        const onlineCount = allRegisteredUsers.filter(u => u.state === 'online').length;

        const userListItems = filteredUsers.map((info) => {
            const isSelected = selectedChatPartner?.id === info.id;
            const isOnline = info.state === 'online';
            const isUserAdmin = isAdmin(info.email); 
            const lastSeen = info.lastChanged ? timeAgo(info.lastChanged) : '';

            return (
                <div 
                    key={info.id} 
                    onClick={() => {
                        setSelectedChatPartner(info);
                        setShowUsers(false); 
                    }}
                    className={`
                        group relative flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer
                        ${isSelected 
                            ? 'bg-gradient-to-r from-purple-600/20 to-purple-600/5 border border-purple-500/30' 
                            : 'hover:bg-white/5 border border-transparent'
                        }
                    `}
                >
                    {/* Online Indicator */}
                    <div className="relative">
                        <Avatar user={info} size="md" />
                        <span className={`
                            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0A]
                            ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}
                        `} />
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-semibold text-gray-100 truncate">
                                {info.displayName}
                            </p>
                            {isUserAdmin && isClientAdmin && <AdminBadge size="sm" />}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                            {!isOnline && lastSeen && (
                                <>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-xs text-gray-500">
                                        {lastSeen}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Active Indicator */}
                    {isSelected && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                    )}
                </div>
            );
        });

        const isGlobalSelected = selectedChatPartner === null;

        const globalChatButton = (
            <button
                key="global-chat-btn"
                onClick={() => {
                    setSelectedChatPartner(null);
                    setShowUsers(false); 
                }}
                className={`
                    relative w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 mb-4 overflow-hidden
                    ${isGlobalSelected 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-white/5'
                    }
                `}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                </div>

                {/* Icon */}
                <div className={`
                    relative w-10 h-10 rounded-xl flex items-center justify-center
                    ${isGlobalSelected ? 'bg-white/20' : 'bg-white/5'}
                `}>
                    <svg className={`w-5 h-5 ${isGlobalSelected ? 'text-white' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative flex-1 text-left">
                    <p className={`text-sm font-semibold ${isGlobalSelected ? 'text-white' : 'text-gray-100'}`}>
                        Global Chat
                    </p>
                    <p className={`text-xs ${isGlobalSelected ? 'text-white/70' : 'text-gray-400'}`}>
                        {onlineCount} online now
                    </p>
                </div>

                {/* Active Indicator */}
                {isGlobalSelected && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
            </button>
        );

        return [globalChatButton, ...userListItems];
    }, [filteredUsers, selectedChatPartner, isClientAdmin, setSelectedChatPartner, setShowUsers, allRegisteredUsers]);

    return (
        <>
            {/* Backdrop for mobile */}
            {showUsers && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={() => setShowUsers(false)}
                />
            )}

            {/* User List Panel */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40 w-80 bg-[#0C0C0C] border-r border-white/5
                transform transition-transform duration-300 ease-out
                ${showUsers ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        <h2 className="text-lg font-semibold text-white">Users</h2>
                        <span className="px-1.5 py-0.5 text-xs bg-white/5 rounded-full text-gray-300">
                            {allRegisteredUsers.length}
                        </span>
                    </div>
                    <button 
                        onClick={() => setShowUsers(false)} 
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="Close user list"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-1">
                    {getFullUserList()}
                </div>

                {/* Current User Info */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <Avatar user={{ displayName: currentDisplayName }} size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {currentDisplayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {currentUser?.email}
                            </p>
                        </div>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserList;