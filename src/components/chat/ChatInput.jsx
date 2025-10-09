import React, { useState } from 'react';
import EmojiPicker from '../common/EmojiPicker';

export const ChatInput = ({ 
    input, 
    setInput, 
    handleSend, 
    currentUser, 
    selectedChatPartner,
    showEmojiPicker,
    setShowEmojiPicker,
    currentDisplayName,
    getDefaultName 
}) => {
    const handleEmojiSelect = (emoji) => {
        setInput(prevInput => prevInput + emoji);
    };

    return (
        <footer className="p-4 bg-chat-panel border-t border-gray-700 shadow-xl sticky bottom-0 z-20 relative">
            {showEmojiPicker && (
                <EmojiPicker 
                    onEmojiSelect={handleEmojiSelect} 
                    onClose={() => setShowEmojiPicker(false)}
                />
            )}
            
            <form onSubmit={handleSend} className="flex space-x-3">
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    disabled={!currentUser.emailVerified}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition duration-200 disabled:bg-gray-500 disabled:opacity-50 text-2xl
                        ${showEmojiPicker ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                    `}
                    aria-label="Toggle emoji picker"
                >
                    😀
                </button>
                
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={currentUser.emailVerified ? (selectedChatPartner ? `Message ${selectedChatPartner.displayName}...` : "Type your message in Global Chat...") : "Please verify your email to send messages."}
                    className="flex-1 p-3 border border-gray-600 bg-gray-800 text-white rounded-full focus:ring-purple-500 focus:border-purple-500 transition duration-150 disabled:bg-gray-800 disabled:placeholder-gray-600 placeholder-gray-400"
                    disabled={!currentUser.emailVerified}
                />
                <button
                    type="submit"
                    disabled={!currentUser.emailVerified || !input.trim()}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white transition duration-200 transform active:scale-95 disabled:bg-gray-500 disabled:opacity-50"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45 -mt-0.5 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </form>
            {currentUser && !currentUser.emailVerified && (
                <p className="text-center text-xs text-red-300 mt-2 p-1 bg-red-900 rounded">
                    🚫 Your email address is not verified. Check your inbox to enable messaging.
                </p>
            )}
            {getDefaultName(currentUser.email) === currentDisplayName && !selectedChatPartner && currentUser.emailVerified && (
                 <p className="text-center text-xs text-red-300 mt-2 p-1 bg-purple-900 rounded cursor-pointer">
                    ⚠️ **Please set a custom Display Name** before sending messages to **Global Chat**! Click here to set it.
                </p>
            )}
        </footer>
    );
};

export default ChatInput;