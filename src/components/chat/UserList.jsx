import React, { useCallback, useState, useRef, useEffect } from 'react';
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
    if (d < 7) return `active ${d}d ago`;
    return `active ${Math.floor(d / 7)}w ago`;
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
    const [showCurrentUserMenu, setShowCurrentUserMenu] = useState(false);
    const userListRef = useRef(null);
    const currentUserRef = useRef(null);
    
    // Get current user info
    const currentUserInfo = usersCache[currentUser?.uid];
    const currentDisplayName = currentUserInfo?.displayName || getDefaultName(currentUser?.email);
    const isClientAdmin = isAdmin(currentUser?.email);

    // Filter out current user from the list
    const otherUsers = allRegisteredUsers.filter(user => user.id !== currentUser?.uid);

    // Filter users based on search
    const filteredUsers = otherUsers.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort users: online first, then by last active
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (a.state === 'online' && b.state !== 'online') return -1;
        if (a.state !== 'online' && b.state === 'online') return 1;
        return (b.lastChanged || 0) - (a.lastChanged || 0);
    });

    // Calculate online count
    const onlineCount = otherUsers.filter(u => u.state === 'online').length;

    // Handle click outside current user menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (currentUserRef.current && !currentUserRef.current.contains(e.target)) {
                setShowCurrentUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getFullUserList = useCallback(() => {
        // Global Chat Option - Enhanced Instagram style
        const globalChatButton = (
            <button
                key="global-chat-btn"
                onClick={() => {
                    setSelectedChatPartner(null);
                    setShowUsers(false); 
                }}
                className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-3
                    ${selectedChatPartner === null 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }
                    group relative overflow-hidden
                `}
            >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
                
                {/* Icon with gradient */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                    </div>
                    {/* Live indicator */}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${selectedChatPartner === null ? 'text-white' : 'text-gray-300'}`}>
                        Global Chat
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">{onlineCount} online</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-gray-500">{otherUsers.length} members</span>
                    </div>
                </div>

                {/* Active indicator */}
                {selectedChatPartner === null && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full" />
                )}
            </button>
        );

        // User List Items - Enhanced Instagram style
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
                        relative flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer
                        ${isSelected 
                            ? 'bg-purple-500/20 border border-purple-500/30' 
                            : 'hover:bg-white/5 border border-transparent'
                        }
                        group
                    `}
                >
                    {/* Avatar with Status - Enhanced */}
                    <div className="relative">
                        <Avatar user={info} size="md" />
                        {isOnline ? (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse" />
                        ) : (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gray-500 rounded-full border-2 border-[#0C0C0C]" />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
                                {info.displayName}
                            </p>
                            {isUserAdmin && <AdminBadge size="sm" />}
                        </div>
                        <p className="text-xs text-gray-500">
                            {isOnline ? (
                                <span className="text-green-400">Active now</span>
                            ) : (
                                lastSeen
                            )}
                        </p>
                    </div>

                    {/* Active indicator for selected user */}
                    {isSelected && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                    )}

                    {/* Unread indicator (demo) - you can replace with actual unread count */}
                    {Math.random() > 0.8 && (
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    )}
                </div>
            );
        });

        return [globalChatButton, ...userListItems];
    }, [sortedUsers, selectedChatPartner, setSelectedChatPartner, setShowUsers, onlineCount, otherUsers.length]);

    return (
        <>
            {/* Mobile Backdrop - Enhanced */}
            {showUsers && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={() => setShowUsers(false)}
                />
            )}

            {/* User List Panel - Enhanced Instagram style sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-80 bg-[#0C0C0C] 
                transform transition-transform duration-300 ease-out
                ${showUsers ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col border-r border-white/5
            `}>
                {/* Header - Fixed at top */}
                <div className="sticky top-0 bg-[#0C0C0C] z-20 border-b border-white/5">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                            <h2 className="text-lg font-semibold text-white">Messages</h2>
                            <span className="px-2 py-0.5 text-xs bg-white/5 rounded-full text-gray-400">
                                {otherUsers.length}
                            </span>
                        </div>
                        <button 
                            onClick={() => setShowUsers(false)} 
                            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Search Bar - Enhanced */}
                    <div className="p-4 pt-0">
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full px-4 py-2.5 pl-10 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                            />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            
                            {/* Clear search button */}
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-2.5 text-gray-500 hover:text-white"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* User List - Scrollable area (only this scrolls) */}
                <div 
                    ref={userListRef}
                    className="flex-1 overflow-y-auto custom-scrollbar"
                >
                    <div className="px-2 py-2 space-y-1">
                        {getFullUserList()}
                        
                        {/* No results message */}
                        {sortedUsers.length === 0 && searchTerm && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-500">No users found</p>
                                <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Current User - Fixed at bottom with enhanced design */}
                <div 
                    ref={currentUserRef}
                    className="relative bg-[#0C0C0C] border-t border-white/5"
                >
                    {/* Current user button */}
                    <button
                        onClick={() => setShowCurrentUserMenu(!showCurrentUserMenu)}
                        className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                    >
                        <div className="relative">
                            <Avatar user={{ displayName: currentDisplayName }} size="sm" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0C0C0C] animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-medium text-white truncate">
                                {currentDisplayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {currentUser?.email}
                            </p>
                        </div>
                        
                        {/* Menu toggle icon */}
                        <svg 
                            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${showCurrentUserMenu ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Current user menu (optional) */}
                    {showCurrentUserMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-[#1A1A1A] rounded-xl border border-white/5 shadow-xl overflow-hidden animate-slide-in-up">
                            <div className="p-2 space-y-1">
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>Settings</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserList;