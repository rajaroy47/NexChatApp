import React, { useState, useEffect } from 'react';
import { useMessages, usePrivateMessages, useUsersStatus, useUsersCache } from '../firebase/hooks';
import { authMethods } from '../firebase/auth';
import { sendMessage, sendPrivateMessage, getChatId, getDefaultName, updateOnlineStatus } from '../firebase/db';
import { ADMIN_EMAIL } from '../firebase/config';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import UserList from '../components/chat/UserList';
import SettingsModal from '../components/common/SettingsModal';

const isAdmin = (email) => email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

export const ChatPage = ({ currentUser }) => {
    const [input, setInput] = useState('');
    const [showUsers, setShowUsers] = useState(false);
    const [selectedChatPartner, setSelectedChatPartner] = useState(null); 
    const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
    const [showSettingsModal, setShowSettingsModal] = useState(false); 

    const globalMessages = useMessages();
    const usersStatusData = useUsersStatus(currentUser); 
    const usersCache = useUsersCache(); 

    const currentUserInfo = usersCache[currentUser.uid];
    const currentDisplayName = currentUserInfo ? currentUserInfo.displayName : getDefaultName(currentUser.email);
    const isClientAdmin = isAdmin(currentUser.email); 
    

    useEffect(() => {
        if (currentUserInfo && getDefaultName(currentUser.email) === currentUserInfo.displayName) {
            setShowSettingsModal(true);
        }
    }, [currentUserInfo, currentUser.email]);

    const chatId = selectedChatPartner 
        ? getChatId(currentUser.uid, selectedChatPartner.id) 
        : null;
    
    const privateMessages = usePrivateMessages(chatId); 
    const activeMessages = selectedChatPartner ? privateMessages : globalMessages;

    useEffect(() => {
        setShowEmojiPicker(false);
        if (!showSettingsModal) {
            setShowSettingsModal(false);
        }
    }, [selectedChatPartner]);

    const allRegisteredUsers = Object.values(usersCache)
        .filter(u => u.id !== currentUser.uid)
        .map(user => {
            const status = usersStatusData[user.id] || { state: 'offline', lastChanged: null, email: user.email };
            return {
                id: user.id,
                email: user.email,
                displayName: user.displayName, 
                state: status.state,
                lastChanged: status.lastChanged
            };
        })
        .sort((a, b) => {
            if (a.state === 'online' && b.state !== 'online') return -1;
            if (a.state !== 'online' && b.state === 'online') return 1;
            return (b.lastChanged || 0) - (a.lastChanged || 0);
        });

    const handleSend = (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.emailVerified || !input.trim()) return;
        
        if (getDefaultName(currentUser.email) === currentDisplayName && !selectedChatPartner) {
            setShowSettingsModal(true);
            return;
        }

        if (selectedChatPartner) {
            sendPrivateMessage(
                currentUser.uid,
                currentDisplayName,
                selectedChatPartner.id,
                input
            ).then(() => setInput(''));
        } else {
            sendMessage(currentUser.uid, currentDisplayName, input)
                .then(() => setInput(''))
                .catch(error => console.error("Error sending message:", error));
        }
        setShowEmojiPicker(false);
    };

    const handleLogout = () => {
        updateOnlineStatus(currentUser.uid, currentUser.email, false);
        authMethods.logout().catch(console.error);
    };
    
    const chatTitle = selectedChatPartner 
        ? `Chatting with: ${selectedChatPartner.displayName}` 
        : 'Global Chat ✨';

    return (
        <div className="flex h-screen w-screen bg-dark-bg font-inter md:flex-row flex-col">
            
            {showSettingsModal && (
                <SettingsModal 
                    currentUser={currentUser} 
                    usersCache={usersCache}
                    onClose={() => setShowSettingsModal(false)}
                    isInitialSetup={getDefaultName(currentUser.email) === currentDisplayName}
                />
            )}

            {/* UserList with higher z-index */}
            <UserList 
                allRegisteredUsers={allRegisteredUsers}
                selectedChatPartner={selectedChatPartner}
                setSelectedChatPartner={setSelectedChatPartner}
                setShowUsers={setShowUsers}
                currentUser={currentUser}
                usersCache={usersCache}
                showUsers={showUsers}
            />
            
            <div className="flex-1 flex flex-col min-w-0 w-full" style={{ background: '#0a0a0a' }}>
                
                {/* Modern header */}
                <header className="flex items-center gap-3 px-4 py-3 bg-[#0c0c0c] border-b border-white/[0.05] sticky top-0 z-20">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setShowUsers(true)}
                        className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
                        aria-label="Show user list"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Chat info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {selectedChatPartner ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
                                        {selectedChatPartner.displayName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-[15px] font-semibold text-white leading-tight truncate">{selectedChatPartner.displayName}</h1>
                                        <p className={`text-[11px] leading-tight ${selectedChatPartner.state === 'online' ? 'text-emerald-500' : 'text-gray-600'}`}>
                                            {selectedChatPartner.state === 'online' ? 'Active now' : 'Offline'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-[15px] font-semibold text-white leading-tight">Global Chat</h1>
                                        <p className="text-[11px] text-emerald-500 leading-tight">Everyone · Live</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Settings"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                <ChatWindow 
                    messages={activeMessages}
                    currentUser={currentUser}
                    usersCache={usersCache}
                    selectedChatPartner={selectedChatPartner}
                    chatId={chatId} // Add this line
                />

                <ChatInput 
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    currentUser={currentUser}
                    selectedChatPartner={selectedChatPartner}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    currentDisplayName={currentDisplayName}
                    getDefaultName={getDefaultName}
                    
                />
            </div>
            
            {/* Overlay with lower z-index - FIXED: Changed from z-30 to z-35 */}
            {showUsers && (
                <div 
                    className="fixed inset-0 bg-black opacity-90 z-35 md:hidden" 
                    onClick={() => setShowUsers(false)}
                ></div>
            )}
        </div>
    );
};

export default ChatPage;