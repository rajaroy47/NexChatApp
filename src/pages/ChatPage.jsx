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
            
            <div className="flex-1 flex flex-col min-w-0 w-full bg-dark-bg">
                
                <header className="flex justify-between items-center p-4 bg-chat-panel shadow-md border-b border-gray-700 sticky top-0 z-20">
                  
                    <button 
                        onClick={() => setShowUsers(true)} 
                        className="md:hidden p-2 text-white hover:text-purple-300 rounded-lg bg-gray-800"
                        aria-label="Show user list"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <h1 className="text-xl font-bold text-white flex-1 text-center">{chatTitle}</h1>
                    
                    <div className='flex items-center space-x-2'>
                        <button 
                            onClick={() => setShowSettingsModal(true)}
                            className="p-2 text-gray-400 hover:text-purple-400 transition duration-150 rounded-lg border border-gray-600 hover:bg-gray-700"
                            title="User Settings"
                        >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 animate-spin"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.983 1.907a1 1 0 00-1.966 0l-.254 1.53a7.025 7.025 0 00-1.277.74L7.01 2.792a1 1 0 00-1.42 1.42l1.385 1.475a7.028 7.028 0 00-.74 1.277l-1.53.254a1 1 0 000 1.966l1.53.254c.177.458.416.889.74 1.277L5.59 12.57a1 1 0 101.42 1.42l1.475-1.385c.388.324.819.563 1.277.74l.254 1.53a1 1 0 001.966 0l.254-1.53a7.025 7.025 0 001.277-.74l1.475 1.385a1 1 0 001.42-1.42l-1.385-1.475c.324-.388.563-.819.74-1.277l1.53-.254a1 1 0 000-1.966l-1.53-.254a7.028 7.028 0 00-.74-1.277l1.385-1.475a1 1 0 00-1.42-1.42l-1.475 1.385a7.025 7.025 0 00-1.277-.74l-.254-1.53zM10 13a3 3 0 110-6 3 3 0 010 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-bold text-red-400 hover:text-red-300 py-2 px-3 transition duration-150 rounded-lg border border-red-500 hover:bg-red-900"
                            title="Logout"
                        >
                            Logout
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