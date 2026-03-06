import React, { useRef, useEffect, useState } from 'react';
import Message from './Message';

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="relative h-full bg-[#0A0A0A]">
            <main 
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto custom-scrollbar px-4 py-6 space-y-4"
            >
                {messages
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .map((msg, index) => {
                        const prevMsg = messages[index - 1];
                        const showDate = !prevMsg || 
                            new Date(msg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

                        return (
                            <React.Fragment key={msg.id}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-white/5 rounded-full border border-white/10">
                                            {new Date(msg.timestamp).toLocaleDateString('en-US', { 
                                                weekday: 'short', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                )}
                                <Message
                                    message={msg}
                                    isMyMessage={(msg.senderUid || msg.uid) === currentUser.uid}
                                    usersCache={usersCache}
                                    currentUser={currentUser}
                                    selectedChatPartner={selectedChatPartner}
                                    chatId={chatId}
                                />
                            </React.Fragment>
                        );
                    })}
                <div ref={messagesEndRef} />

                {/* Empty State */}
                {messages.length === 0 && selectedChatPartner && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                        <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Private Conversation
                        </h3>
                        <p className="text-sm text-gray-400 max-w-sm">
                            This is the beginning of your private chat with{' '}
                            <span className="text-purple-400 font-medium">
                                {selectedChatPartner.displayName}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full" />
                            End-to-end encrypted
                        </p>
                    </div>
                )}
            </main>

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 animate-slide-in-up"
                    aria-label="Scroll to bottom"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ChatWindow;