import React, { useCallback } from 'react';
import { ADMIN_EMAIL } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';

const timeAgo = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') return '';
    
    const diff = Math.floor((Date.now() - timestamp) / 1000);

    if (diff < 60) return diff + "s ago";
    const m = Math.floor(diff / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
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
    const currentUserInfo = usersCache[currentUser.uid];
    const currentDisplayName = currentUserInfo ? currentUserInfo.displayName : 'Guest';
    const isClientAdmin = isAdmin(currentUser.email);

    const getFullUserList = useCallback(() => {
        const userListItems = allRegisteredUsers.map((info) => {
            const isSelected = selectedChatPartner && selectedChatPartner.id === info.id;
            const isOnline = info.state === 'online';
            const isUserAdmin = isAdmin(info.email); 
            const userDisplay = info.displayName;
            const lastSeen = info.lastChanged ? timeAgo(info.lastChanged) : '';

            return (
                <div 
                    key={info.id} 
                    onClick={() => {
                        setSelectedChatPartner(info);
                        setShowUsers(false); 
                    }}
                    className={`flex items-center p-3 rounded-xl transition-colors cursor-pointer 
                        ${isSelected ? 'bg-purple-900 ring-2 ring-purple-500' : 'hover:bg-gray-800'}
                    `}
                >
                    <Avatar user={info} /> 
                    <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-100 truncate flex items-center">
                            {userDisplay}
                            {isUserAdmin && isClientAdmin && <AdminBadge />} 
                        </p>
                        <div className="flex items-center justify-between">
                            <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'} font-medium flex items-center`}>
                                <span className={`w-2 h-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full mr-1`}></span> 
                                {isOnline ? 'Online' : 'Offline'}
                            </p>
                            {!isOnline && lastSeen && (
                                <p className="text-xs text-gray-400 ml-2">
                                    Last seen {lastSeen}
                                </p>
                            )}
                        </div>
                    </div>
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
                className={`w-full flex items-center p-3 rounded-xl transition-colors font-bold text-left mb-4 shadow-md
                    ${isGlobalSelected ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" /><path d="M15 7v2a4 4 0 01-4 4H9.863L9 16.27l.142.362.001.001.2.6.2.6v.001c.421 1.25.962 2.25 1.542 3.25l.4.8c.2.4.5.7.9 1s.8.4 1.2.4h.001c.6 0 1.1-.2 1.5-.5l.4-.8c.6-1.0 1.1-2.0 1.5-3.25h.001v-.001l.2-.6.2-.6.142-.362L17 11.27V9a4 4 0 00-4-4h-2a4 4 0 00-4 4v2.27l1.142.362.2.6.2.6v.001c.421 1.25.962 2.25 1.542 3.25l.4.8c.2.4.5.7.9 1s.8.4 1.2.4h.001z" /></svg>
                Global Chat 🌐
            </button>
        );

        return [globalChatButton, ...userListItems];
    }, [allRegisteredUsers, selectedChatPartner, isClientAdmin, setSelectedChatPartner, setShowUsers]); 

    return (
        <div className={`fixed inset-0 z-40 bg-chat-panel shadow-2xl transition-transform duration-300 ease-in-out md:static md:w-80 md:translate-x-0 md:border-r border-gray-700 p-4 overflow-y-auto ${showUsers ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3 sticky top-0 bg-chat-panel z-10">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span> All Users
                </h2>
                <button 
                    onClick={() => setShowUsers(false)} 
                    className="md:hidden text-gray-400 hover:text-white p-2 text-2xl"
                    aria-label="Close user list"
                >
                    &times;
                </button>
            </div>
            <div className="space-y-2">
                {getFullUserList()} 
                <div className="text-center text-xs text-gray-500 pt-4">Your Name: <span className="font-mono text-purple-400 break-all">{currentDisplayName}</span></div>
            </div>
        </div>
    );
};

export default UserList;