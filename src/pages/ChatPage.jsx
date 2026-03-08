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

  const chatId = selectedChatPartner ? getChatId(currentUser.uid, selectedChatPartner.id) : null;
  const privateMessages = usePrivateMessages(chatId);
  const activeMessages = selectedChatPartner ? privateMessages : globalMessages;

  useEffect(() => {
    setShowEmojiPicker(false);
  }, [selectedChatPartner]);

  const allRegisteredUsers = Object.values(usersCache)
    .filter(u => u.id !== currentUser.uid)
    .map(user => {
      const status = usersStatusData[user.id] || { state: 'offline', lastChanged: null, email: user.email };
      return { id: user.id, email: user.email, displayName: user.displayName, state: status.state, lastChanged: status.lastChanged };
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
      setShowSettingsModal(true); return;
    }
    if (selectedChatPartner) {
      sendPrivateMessage(currentUser.uid, currentDisplayName, selectedChatPartner.id, input).then(() => setInput(''));
    } else {
      sendMessage(currentUser.uid, currentDisplayName, input).then(() => setInput('').catch(console.error));
    }
    setShowEmojiPicker(false);
  };

  const handleLogout = () => {
    updateOnlineStatus(currentUser.uid, currentUser.email, false);
    authMethods.logout().catch(console.error);
  };

  const chatTitle = selectedChatPartner ? selectedChatPartner.displayName : 'Global Chat';
  const chatSubtitle = selectedChatPartner
    ? (selectedChatPartner.state === 'online' ? 'Active now' : 'Tap to message')
    : `${allRegisteredUsers.filter(u => u.state === 'online').length} online`;

  return (
    // <div className="flex h-screen w-screen bg-[#060608] overfl
    <div className="flex h-[100dvh] w-screen bg-[#060608] overflow-hidden">
      {showSettingsModal && (
        <SettingsModal
          currentUser={currentUser}
          usersCache={usersCache}
          onClose={() => setShowSettingsModal(false)}
          isInitialSetup={getDefaultName(currentUser.email) === currentDisplayName}
        />
      )}

      <UserList
        allRegisteredUsers={allRegisteredUsers}
        selectedChatPartner={selectedChatPartner}
        setSelectedChatPartner={setSelectedChatPartner}
        setShowUsers={setShowUsers}
        currentUser={currentUser}
        usersCache={usersCache}
        showUsers={showUsers}
        onSettings={() => setShowSettingsModal(true)}
        onLogout={handleLogout}
      />

      {/* <div className="flex-1 flex flex-col min-w-0 w-full"> */}
      <div className="flex-1 flex flex-col min-w-0 w-full h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-[#0e0e12]/95 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-20">
          {/* Mobile menu btn */}
          <button
            onClick={() => setShowUsers(true)}
            className="md:hidden w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#9999b0] hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Chat info */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {selectedChatPartner ? (
              <>
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-sm font-bold text-white">
                    {selectedChatPartner.displayName?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0e0e12] ${selectedChatPartner.state === 'online' ? 'bg-emerald-500' : 'bg-[#55556a]'}`}/>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{chatTitle}</p>
                  <p className={`text-xs ${selectedChatPartner.state === 'online' ? 'text-emerald-500' : 'text-[#55556a]'}`}>{chatSubtitle}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Global Chat</p>
                  <p className="text-xs text-emerald-500">{chatSubtitle} · Live</p>
                </div>
              </>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#9999b0] hover:text-white hover:border-violet-500/30 transition-all"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:flex w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 items-center justify-center text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </header>

        <ChatWindow
          messages={activeMessages}
          currentUser={currentUser}
          usersCache={usersCache}
          selectedChatPartner={selectedChatPartner}
          chatId={chatId}
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
          setShowSettingsModal={setShowSettingsModal}
        />
      </div>
    </div>
  );
};

export default ChatPage;
