import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    // State Management
    const [input, setInput] = useState('');
    const [showUsers, setShowUsers] = useState(false);
    const [selectedChatPartner, setSelectedChatPartner] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    // Refs
    const chatContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Custom Hooks
    const globalMessages = useMessages();
    const usersStatusData = useUsersStatus(currentUser);
    const usersCache = useUsersCache();

    // Derived Data
    const currentUserInfo = usersCache[currentUser?.uid];
    const currentDisplayName = currentUserInfo?.displayName || getDefaultName(currentUser?.email);
    const isClientAdmin = isAdmin(currentUser?.email);

    // Effects
    useEffect(() => {
        if (currentUserInfo && getDefaultName(currentUser.email) === currentUserInfo.displayName) {
            setShowSettingsModal(true);
        }
    }, [currentUserInfo, currentUser.email]);

    useEffect(() => {
        setShowEmojiPicker(false);
    }, [selectedChatPartner]);

    // Chat ID and Messages
    const chatId = selectedChatPartner 
        ? getChatId(currentUser.uid, selectedChatPartner.id) 
        : null;
    
    const privateMessages = usePrivateMessages(chatId);
    const activeMessages = selectedChatPartner ? privateMessages : globalMessages;

    // Processed Users List with Enhanced Data
    const allRegisteredUsers = Object.values(usersCache)
        .filter(u => u.id !== currentUser.uid)
        .map(user => {
            const status = usersStatusData[user.id] || { state: 'offline', lastChanged: null, email: user.email };
            const isPartner = selectedChatPartner?.id === user.id;
            
            return {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                state: status.state,
                lastChanged: status.lastChanged,
                isPartner,
                // Add typing indicator (you'd need to implement this in your backend)
                isTyping: false,
                // Add unread count (you'd need to implement this)
                unreadCount: 0
            };
        })
        .sort((a, b) => {
            if (a.state === 'online' && b.state !== 'online') return -1;
            if (a.state !== 'online' && b.state === 'online') return 1;
            return (b.lastChanged || 0) - (a.lastChanged || 0);
        });

    // Handlers
    const handleSend = useCallback((e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.emailVerified || !input.trim()) return;
        
        if (getDefaultName(currentUser.email) === currentDisplayName && !selectedChatPartner) {
            setShowSettingsModal(true);
            return;
        }

        const messageContent = input.trim();

        if (selectedChatPartner) {
            sendPrivateMessage(
                currentUser.uid,
                currentDisplayName,
                selectedChatPartner.id,
                messageContent
            ).then(() => {
                setInput('');
                // Reset typing indicator
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            });
        } else {
            sendMessage(currentUser.uid, currentDisplayName, messageContent)
                .then(() => setInput(''))
                .catch(error => console.error("Error sending message:", error));
        }
        setShowEmojiPicker(false);
    }, [currentUser, currentDisplayName, input, selectedChatPartner]);

    const handleTyping = useCallback((value) => {
        setInput(value);
        
        // Typing indicator logic
        if (!selectedChatPartner) return;
        
        if (!isTyping) {
            setIsTyping(true);
            // You would emit typing event here
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            // You would emit stop typing event here
        }, 1000);
    }, [selectedChatPartner, isTyping]);

    const handleLogout = useCallback(() => {
        updateOnlineStatus(currentUser.uid, currentUser.email, false);
        authMethods.logout().catch(console.error);
    }, [currentUser]);

    const handleSelectPartner = useCallback((partner) => {
        setSelectedChatPartner(partner);
        setShowUsers(false);
    }, []);

    // Cleanup
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const chatTitle = selectedChatPartner 
        ? `Chatting with: ${selectedChatPartner.displayName}` 
        : 'Global Chat';

    return (
        <div className="flex h-screen w-screen bg-[#0A0A0A] font-['Inter'] md:flex-row flex-col overflow-hidden">
            
            {/* Settings Modal */}
            {showSettingsModal && (
                <SettingsModal 
                    currentUser={currentUser} 
                    usersCache={usersCache}
                    onClose={() => setShowSettingsModal(false)}
                    isInitialSetup={getDefaultName(currentUser.email) === currentDisplayName}
                />
            )}

            {/* User List Panel */}
            <UserList 
                allRegisteredUsers={allRegisteredUsers}
                selectedChatPartner={selectedChatPartner}
                setSelectedChatPartner={handleSelectPartner}
                setShowUsers={setShowUsers}
                currentUser={currentUser}
                usersCache={usersCache}
                showUsers={showUsers}
            />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 w-full bg-[#0A0A0A] relative">
                
                {/* Header */}
                <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0C0C0C] border-b border-white/5 sticky top-0 z-20 backdrop-blur-sm">
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setShowUsers(true)} 
                        className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                        aria-label="Show user list"
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                    </button>
                    
                    {/* Chat Title with Animation */}
                    <div className="flex-1 text-center">
                        <h1 className="inline-flex items-center gap-2 text-lg sm:text-xl font-semibold">
                            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {chatTitle}
                            </span>
                            {selectedChatPartner && (
                                <span className={`w-2 h-2 rounded-full ${
                                    selectedChatPartner.state === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                                }`} />
                            )}
                        </h1>
                    </div>
                    
                    {/* Header Actions */}
                    <div className="flex items-center gap-2">
                        {/* Settings Button */}
                        <button 
                            onClick={() => setShowSettingsModal(true)}
                            className="group relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                            title="Settings"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </button>

                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout} 
                            className="group relative w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                            title="Logout"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </header>

                {/* Chat Window */}
                <div ref={chatContainerRef} className="flex-1 overflow-hidden">
                    <ChatWindow 
                        messages={activeMessages}
                        currentUser={currentUser}
                        usersCache={usersCache}
                        selectedChatPartner={selectedChatPartner}
                        chatId={chatId}
                    />
                </div>

                {/* Chat Input */}
                <ChatInput 
                    input={input}
                    setInput={handleTyping}
                    handleSend={handleSend}
                    currentUser={currentUser}
                    selectedChatPartner={selectedChatPartner}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    currentDisplayName={currentDisplayName}
                    getDefaultName={getDefaultName}
                />

                {/* Typing Indicator (optional) */}
                {isTyping && selectedChatPartner && (
                    <div className="absolute bottom-24 left-6 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-xs text-gray-400">
                            <span className="font-medium text-purple-400">{currentDisplayName}</span> is typing...
                        </p>
                    </div>
                )}
            </div>
            
            {/* Mobile Overlay */}
            {showUsers && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden animate-fade-in" 
                    onClick={() => setShowUsers(false)}
                />
            )}
        </div>
    );
};

export default ChatPage;