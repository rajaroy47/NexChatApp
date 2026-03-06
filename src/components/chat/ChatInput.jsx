import React, { useState, useRef, useEffect } from 'react';
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
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const formRef = useRef(null);

    const handleEmojiSelect = (emoji) => {
        setInput(prevInput => prevInput + emoji);
        // Focus back on input after emoji selection
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    // Close emoji picker on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (formRef.current && !formRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setShowEmojiPicker]);

    const isVerified = currentUser?.emailVerified;
    const isDisabled = !isVerified || !input.trim();
    const placeholder = !isVerified 
        ? "Verify your email to start chatting..."
        : selectedChatPartner 
            ? `Message ${selectedChatPartner.displayName}...` 
            : "Type your message in Global Chat...";

    return (
        <footer className="relative bg-gradient-to-t from-[#0C0C0C] to-transparent pt-4">
            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 z-50">
                    <EmojiPicker 
                        onEmojiSelect={handleEmojiSelect} 
                        onClose={() => setShowEmojiPicker(false)}
                    />
                </div>
            )}
            
            <form 
                ref={formRef}
                onSubmit={handleSend} 
                className="relative flex items-end gap-2 px-4 pb-4"
            >
                {/* Input Container with Glass Effect */}
                <div className={`
                    flex-1 flex items-end gap-2 bg-[#1A1A1A] rounded-2xl border-2 transition-all duration-300
                    ${isFocused 
                        ? 'border-purple-500/50 bg-[#222] shadow-lg shadow-purple-500/10' 
                        : 'border-white/5 hover:border-white/10'
                    }
                    ${!isVerified ? 'opacity-75' : ''}
                `}>
                    {/* Emoji Button */}
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                        disabled={!isVerified}
                        className={`
                            relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300
                            ${showEmojiPicker 
                                ? 'text-purple-400 scale-110' 
                                : 'text-gray-400 hover:text-white hover:scale-110'
                            }
                            disabled:opacity-50 disabled:hover:scale-100
                        `}
                        aria-label="Toggle emoji picker"
                    >
                        <span className="text-xl transform transition-transform group-hover:rotate-12">😊</span>
                        {showEmojiPicker && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full" />
                        )}
                    </button>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={!isVerified}
                        className="flex-1 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
                        autoComplete="off"
                    />

                    {/* Character Count (optional) */}
                    {input.length > 0 && (
                        <span className="pr-3 text-xs text-gray-500">
                            {input.length}
                        </span>
                    )}
                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`
                        relative group w-12 h-12 flex items-center justify-center rounded-2xl
                        bg-gradient-to-r from-purple-600 to-pink-600
                        transition-all duration-300 transform
                        ${!isDisabled 
                            ? 'hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95' 
                            : 'opacity-50 cursor-not-allowed'
                        }
                    `}
                    aria-label="Send message"
                >
                    {/* Paper Airplane Icon */}
                    <svg 
                        className="w-5 h-5 text-white transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                        />
                    </svg>

                    {/* Ripple Effect on Hover */}
                    <span className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors" />
                </button>
            </form>

            {/* Warning Messages */}
            {currentUser && !isVerified && (
                <div className="mx-4 mb-2 animate-slide-in-up">
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <p className="text-xs text-red-400">
                            ⚠️ Email not verified. Please check your inbox to enable messaging.
                        </p>
                    </div>
                </div>
            )}

            {getDefaultName(currentUser?.email) === currentDisplayName && !selectedChatPartner && isVerified && (
                <div className="mx-4 mb-2 animate-slide-in-up">
                    <div 
                        onClick={() => setShowSettingsModal?.(true)}
                        className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl cursor-pointer hover:bg-purple-500/20 transition-colors"
                    >
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        <p className="text-xs text-purple-400 flex-1">
                            ⚡ Set a custom display name to start chatting in Global Chat
                        </p>
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default ChatInput;