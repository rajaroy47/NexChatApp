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
    getDefaultName,
    setShowSettingsModal 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const formRef = useRef(null);

    const handleEmojiSelect = (emoji) => {
        setInput(prevInput => prevInput + emoji);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

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
            ? `Message @${selectedChatPartner.displayName}` 
            : "Message Global Chat";

    return (
        <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-white/5">
            {/* Emoji Picker - Instagram style above input */}
            {showEmojiPicker && (
                <div className="absolute bottom-full left-0 right-0 mb-2 px-4 z-50">
                    <div className="max-w-md mx-auto">
                        <EmojiPicker 
                            onEmojiSelect={handleEmojiSelect} 
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </div>
                </div>
            )}

            {/* Warning Messages - WhatsApp style banners */}
            {currentUser && !isVerified && (
                <div className="px-4 pt-2">
                    <div className="flex items-center gap-2 p-2.5 bg-red-500/10 rounded-lg border border-red-500/20">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <p className="text-xs text-red-400 flex-1">
                            Verify your email to start chatting
                        </p>
                        <button className="text-xs text-red-400 hover:text-red-300 font-medium">
                            Resend
                        </button>
                    </div>
                </div>
            )}

            {getDefaultName(currentUser?.email) === currentDisplayName && !selectedChatPartner && isVerified && (
                <div className="px-4 pt-2">
                    <div 
                        onClick={() => setShowSettingsModal?.(true)}
                        className="flex items-center gap-2 p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 cursor-pointer hover:bg-purple-500/20 transition-colors"
                    >
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                        <p className="text-xs text-purple-400 flex-1">
                            Set a display name to start chatting
                        </p>
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            )}

            {/* Input Form - Instagram style */}
            <form 
                ref={formRef}
                onSubmit={handleSend} 
                className="flex items-center gap-2 p-2"
            >
                {/* Emoji Button - Instagram style */}
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(prev => !prev)}
                    disabled={!isVerified}
                    className={`
                        w-10 h-10 flex items-center justify-center rounded-full transition-all
                        ${showEmojiPicker 
                            ? 'text-purple-400 bg-purple-500/10' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                        disabled:opacity-50
                    `}
                >
                    <span className="text-xl">😊</span>
                </button>

                {/* Input Field - WhatsApp style */}
                <div className="flex-1 relative">
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
                        className={`
                            w-full px-4 py-2.5 bg-[#1A1A1A] rounded-full text-white placeholder-gray-500
                            focus:outline-none transition-all
                            ${isFocused ? 'ring-2 ring-purple-500/30' : ''}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        autoComplete="off"
                    />

                    {/* Character count - Instagram style */}
                    {input.length > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            {input.length}
                        </span>
                    )}
                </div>

                {/* Send Button - WhatsApp style */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`
                        w-10 h-10 flex items-center justify-center rounded-full transition-all
                        ${!isDisabled 
                            ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-95' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <svg 
                        className="w-5 h-5" 
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
                </button>
            </form>
        </div>
    );
};

export default ChatInput;