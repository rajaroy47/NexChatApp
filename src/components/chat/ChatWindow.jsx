import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [prevMessagesLength, setPrevMessagesLength] = useState(0);
    const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Handle keyboard show/hide on mobile
    useEffect(() => {
        const handleResize = () => {
            // Visual Viewport API for accurate keyboard height
            if (window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const windowHeight = window.innerHeight;
                const keyboardOpen = viewportHeight < windowHeight;
                
                if (keyboardOpen) {
                    setKeyboardHeight(windowHeight - viewportHeight);
                    // Scroll to bottom when keyboard opens
                    setTimeout(() => scrollToBottom("smooth"), 100);
                } else {
                    setKeyboardHeight(0);
                }
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }, []);

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
        const bottomThreshold = 100;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;
        
        setShowScrollButton(!isNearBottom);
        setIsAtBottom(isNearBottom);
        
        if (isNearBottom && showNewMessageIndicator) {
            setShowNewMessageIndicator(false);
        }
    }, [showNewMessageIndicator]);

    // Auto-scroll logic - WhatsApp style
    useEffect(() => {
        const messagesLength = messages.length;
        const lastMessage = messages[messagesLength - 1];
        const isOwnMessage = lastMessage && (lastMessage.senderUid || lastMessage.uid) === currentUser?.uid;
        
        if (messagesLength > prevMessagesLength) {
            if (isAtBottom || isOwnMessage) {
                scrollToBottom("smooth");
                setShowNewMessageIndicator(false);
            } else {
                setShowNewMessageIndicator(true);
            }
        }
        
        setPrevMessagesLength(messagesLength);
    }, [messages, isAtBottom, prevMessagesLength, scrollToBottom, currentUser?.uid]);

    // Initial scroll
    useEffect(() => {
        scrollToBottom("auto");
    }, [selectedChatPartner, scrollToBottom]);

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
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: keyboardHeight > 0 ? '0' : 'env(safe-area-inset-bottom)'
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

                            {/* Messages */}
                            <div className="space-y-1">
                                {group.messages.map((msg, msgIndex) => {
                                    const prevMsg = group.messages[msgIndex - 1];
                                    const isConsecutive = prevMsg && 
                                        (prevMsg.senderUid || prevMsg.uid) === (msg.senderUid || msg.uid) &&
                                        msg.timestamp - prevMsg.timestamp < 300000;
                                    
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
                        </div>
                    ))}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} className="h-2" />

                    {/* Empty State */}
                    {messages.length === 0 && selectedChatPartner && (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
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

                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-gray-400">End-to-end encrypted</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* New Message Indicator */}
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

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-6 right-6 group z-20"
                    aria-label="Scroll to bottom"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 transition-all transform group-hover:scale-110">
                            {messages.length - prevMessagesLength > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 border-2 border-[#0A0A0A]">
                                    {messages.length - prevMessagesLength}
                                </span>
                            )}
                            <svg 
                                className="w-5 h-5 text-white transform group-hover:translate-y-0.5 transition-transform" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7m14-6l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </button>
            )}
        </div>
    );
};

export default ChatWindow;