import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [prevMessagesLength, setPrevMessagesLength] = useState(0);
    const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);

    // Smart scroll to bottom - WhatsApp style
    const scrollToBottom = useCallback((behavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior,
                block: "end"
            });
        }
    }, []);

    // Handle scroll events - Instagram style
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;
        
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const bottomThreshold = 100; // pixels from bottom
        const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
        
        setShowScrollButton(!isNearBottom);
        setIsAtBottom(isNearBottom);
        
        // Hide new message indicator when user scrolls to bottom
        if (isNearBottom && showNewMessageIndicator) {
            setShowNewMessageIndicator(false);
        }
    }, [showNewMessageIndicator]);

    // Auto-scroll logic - WhatsApp style
    useEffect(() => {
        const messagesLength = messages.length;
        
        // Only auto-scroll if:
        // 1. User was at bottom before new messages arrived
        // 2. It's a new message (not initial load)
        // 3. It's your own message (always scroll)
        const lastMessage = messages[messagesLength - 1];
        const isOwnMessage = lastMessage && (lastMessage.senderUid || lastMessage.uid) === currentUser?.uid;
        
        if (messagesLength > prevMessagesLength) {
            if (isAtBottom || isOwnMessage) {
                scrollToBottom("smooth");
                setShowNewMessageIndicator(false);
            } else {
                // Show "New messages" indicator - Instagram style
                setShowNewMessageIndicator(true);
            }
        }
        
        setPrevMessagesLength(messagesLength);
    }, [messages, isAtBottom, prevMessagesLength, scrollToBottom, currentUser?.uid]);

    // Initial scroll to bottom
    useEffect(() => {
        scrollToBottom("auto");
    }, [selectedChatPartner, scrollToBottom]);

    // Format date headers - WhatsApp style
    const formatDateHeader = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateString === today.toDateString()) {
            return 'TODAY';
        } else if (dateString === yesterday.toDateString()) {
            return 'YESTERDAY';
        } else {
            return date.toLocaleDateString('en-US', { 
                day: 'numeric',
                month: 'long',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            }).toUpperCase();
        }
    };

    // Group messages by date for WhatsApp-style headers
    const groupMessagesByDate = (messages) => {
        const groups = [];
        let currentDate = null;
        let currentGroup = [];

        messages.sort((a, b) => a.timestamp - b.timestamp).forEach((msg) => {
            const msgDate = new Date(msg.timestamp).toDateString();
            
            if (msgDate !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({ date: currentDate, messages: currentGroup });
                }
                currentDate = msgDate;
                currentGroup = [msg];
            } else {
                currentGroup.push(msg);
            }
        });

        if (currentGroup.length > 0) {
            groups.push({ date: currentDate, messages: currentGroup });
        }

        return groups;
    };

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="relative h-full bg-[#0A0A0A] flex flex-col">
            {/* Main Chat Area - Only this scrolls */}
            <main 
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
                style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className="px-4 py-4">
                    {messageGroups.map((group, groupIndex) => (
                        <div key={group.date} className="relative">
                            {/* Date Header - WhatsApp style sticky */}
                            <div className="sticky top-2 z-10 flex justify-center mb-4">
                                <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                                    <span className="text-[11px] font-semibold text-gray-300 tracking-wider">
                                        {formatDateHeader(group.date)}
                                    </span>
                                </div>
                            </div>

                            {/* Messages with grouping logic */}
                            <div className="space-y-1">
                                {group.messages.map((msg, msgIndex) => {
                                    const prevMsg = group.messages[msgIndex - 1];
                                    const isConsecutive = prevMsg && 
                                        (prevMsg.senderUid || prevMsg.uid) === (msg.senderUid || msg.uid) &&
                                        msg.timestamp - prevMsg.timestamp < 300000; // 5 minutes threshold
                                    
                                    const showAvatar = !isConsecutive;

                                    return (
                                        <Message
                                            key={msg.id}
                                            message={msg}
                                            isMyMessage={(msg.senderUid || msg.uid) === currentUser?.uid}
                                            usersCache={usersCache}
                                            currentUser={currentUser}
                                            selectedChatPartner={selectedChatPartner}
                                            chatId={chatId}
                                            showAvatar={showAvatar}
                                            isConsecutive={isConsecutive}
                                        />
                                    );
                                })}
                            </div>

                            {/* Unread divider - WhatsApp style */}
                            {groupIndex === messageGroups.length - 1 && group.messages.some(msg => 
                                !msg.read && (msg.senderUid || msg.uid) !== currentUser?.uid
                            ) && (
                                <div className="flex items-center gap-2 my-4">
                                    <div className="flex-1 h-px bg-blue-500/30" />
                                    <span className="text-[10px] font-medium text-blue-400 tracking-wider">
                                        NEW
                                    </span>
                                    <div className="flex-1 h-px bg-blue-500/30" />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} className="h-0" />

                    {/* Empty State - Instagram style */}
                    {messages.length === 0 && selectedChatPartner && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                            {/* Profile Picture */}
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center">
                                        <span className="text-3xl text-purple-400 font-medium">
                                            {selectedChatPartner.displayName?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0A0A0A]" />
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2">
                                {selectedChatPartner.displayName}
                            </h3>
                            
                            <p className="text-sm text-gray-500 max-w-xs mb-8">
                                You're connected on NexChat
                            </p>

                            {/* Security badges - Instagram style */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="text-xs text-gray-400">Messages and calls are end-to-end encrypted</span>
                                </div>
                            </div>

                            {/* Welcome message */}
                            <div className="mt-8 text-xs text-gray-600">
                                Say hi to {selectedChatPartner.displayName}!
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* New Message Indicator - Instagram style */}
            {showNewMessageIndicator && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
                    <button
                        onClick={() => scrollToBottom("smooth")}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full shadow-lg hover:bg-purple-700 transition-all animate-slide-in-up flex items-center gap-2"
                    >
                        <span>New messages</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Scroll to Bottom Button - Instagram style */}
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-6 right-6 group z-20"
                    aria-label="Scroll to bottom"
                >
                    <div className="relative">
                        {/* Button background with glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Button */}
                        <div className="relative w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-all transform group-hover:scale-110">
                            {/* Unread count badge */}
                            {messages.length - prevMessagesLength > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 border-2 border-[#0A0A0A]">
                                    {messages.length - prevMessagesLength}
                                </span>
                            )}
                            
                            {/* Arrow Icon */}
                            <svg 
                                className="w-5 h-5 text-white transform group-hover:translate-y-0.5 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2.5} 
                                    d="M19 14l-7 7-7-7m14-6l-7 7-7-7" 
                                />
                            </svg>
                        </div>
                    </div>
                </button>
            )}

            {/* Typing Indicator Area - WhatsApp style */}
            {selectedChatPartner && false && ( // Replace false with actual typing state
                <div className="absolute bottom-4 left-6 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] rounded-full border border-white/5">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-400">
                            {selectedChatPartner.displayName} is typing...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;