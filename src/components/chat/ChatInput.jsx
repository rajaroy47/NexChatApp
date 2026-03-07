import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    setShowSettingsModal,
    isPartnerTyping, // NEW: pass true when the other user is typing
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [visualViewportOffset, setVisualViewportOffset] = useState({ height: null, bottom: 0 });
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const wrapperRef = useRef(null);

    // ── Perfect mobile keyboard handling ─────────────────────────────────────
    useEffect(() => {
        if (!window.visualViewport) return;
        const onViewportChange = () => {
            const vvHeight = window.visualViewport.height;
            const vvOffsetTop = window.visualViewport.offsetTop;
            const bottomOffset = window.innerHeight - vvHeight - vvOffsetTop;
            setVisualViewportOffset({ height: vvHeight, bottom: Math.max(0, bottomOffset) });
            if (bottomOffset > 50) {
                setTimeout(() => {
                    document.getElementById('chat-messages-end')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 80);
            }
        };
        window.visualViewport.addEventListener('resize', onViewportChange);
        window.visualViewport.addEventListener('scroll', onViewportChange);
        return () => {
            window.visualViewport.removeEventListener('resize', onViewportChange);
            window.visualViewport.removeEventListener('scroll', onViewportChange);
        };
    }, []);

    const handleEmojiSelect = useCallback((emoji) => {
        setInput(prev => prev + emoji);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [setInput]);

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
    const needsDisplayName = getDefaultName?.(currentUser?.email) === currentDisplayName && !selectedChatPartner && isVerified;

    const placeholder = !isVerified
        ? '✉️ Verify your email to chat...'
        : selectedChatPartner
            ? `Message ${selectedChatPartner.displayName}…`
            : 'Message everyone…';

    const bottomStyle = visualViewportOffset.height
        ? { bottom: visualViewportOffset.bottom, position: 'fixed', left: 0, right: 0, zIndex: 100 }
        : {};

    const hasInput = input.trim().length > 0;

    return (
        <>
            {/* Emoji picker floats above input */}
            {showEmojiPicker && (
                <div
                    style={visualViewportOffset.height
                        ? { position: 'fixed', bottom: (visualViewportOffset.bottom + 64), left: 0, right: 0, zIndex: 110 }
                        : { position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 110, marginBottom: 8 }
                    }
                    className="px-3"
                >
                    <div className="max-w-lg mx-auto">
                        <EmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </div>
                </div>
            )}

            {/* ── Typing indicator – shown above input bar ─────────────────────── */}
            {isPartnerTyping && (
                <div
                    className="px-4 pb-1 flex items-center gap-2"
                    style={visualViewportOffset.height ? {
                        position: 'fixed',
                        bottom: visualViewportOffset.bottom + 64,
                        left: 0, right: 0, zIndex: 99,
                        padding: '0 16px 6px',
                    } : {}}
                >
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl rounded-bl-[5px] bg-[#1c1c1e] border border-white/[0.06] w-fit shadow-sm animate-fadeIn">
                        <span className="text-[12px] text-gray-400 font-medium">
                            {selectedChatPartner?.displayName || 'Someone'} is typing
                        </span>
                        <span className="flex items-center gap-[3px]">
                            <span className="w-[5px] h-[5px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '0ms' }} />
                            <span className="w-[5px] h-[5px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '180ms' }} />
                            <span className="w-[5px] h-[5px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '360ms' }} />
                        </span>
                    </div>
                </div>
            )}

            {/* ── Input bar ────────────────────────────────────────────────────── */}
            <div
                ref={wrapperRef}
                className="nexchat-input-bar bg-[#0c0c0c] border-t border-white/[0.05]"
                style={bottomStyle}
            >
                {/* Verification warning */}
                {currentUser && !isVerified && (
                    <div className="px-3 pt-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                            <p className="text-xs text-amber-400 flex-1">Verify your email to start chatting</p>
                            <button className="text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors">Resend</button>
                        </div>
                    </div>
                )}

                {/* Display name nudge */}
                {needsDisplayName && (
                    <div className="px-3 pt-2">
                        <button
                            onClick={() => setShowSettingsModal?.(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
                            <p className="text-xs text-violet-400 flex-1 text-left">Set your display name to send messages</p>
                            <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Main input row */}
                <form
                    ref={formRef}
                    onSubmit={handleSend}
                    className="flex items-end gap-2 px-3 py-2.5"
                >
                    {/* Emoji button */}
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(p => !p)}
                        disabled={!isVerified}
                        className={`
                            w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 transition-all duration-200
                            ${showEmojiPicker
                                ? 'text-violet-400 bg-violet-500/15 ring-1 ring-violet-500/30'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 active:scale-90'
                            }
                            disabled:opacity-30 disabled:cursor-not-allowed
                        `}
                        aria-label="Emoji"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="10"/>
                            <path strokeLinecap="round" d="M8 13s1.5 2.5 4 2.5 4-2.5 4-2.5"/>
                            <circle cx="9" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
                            <circle cx="15" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
                        </svg>
                    </button>

                    {/* Text input pill */}
                    <div className={`
                        flex-1 relative flex items-center
                        bg-[#1a1a1a] rounded-[24px] border
                        transition-all duration-200
                        ${isFocused
                            ? 'border-violet-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]'
                            : 'border-white/[0.07]'
                        }
                    `}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            disabled={!isVerified}
                            autoComplete="off"
                            autoCorrect="on"
                            enterKeyHint="send"
                            style={{ fontSize: '16px' }}
                            className="
                                flex-1 min-w-0 bg-transparent text-[15px] text-white
                                placeholder-gray-600 px-4 py-[10px]
                                focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed
                            "
                        />
                        {input.length > 0 && (
                            <span className="absolute right-3.5 text-[10px] text-gray-700 tabular-nums select-none">
                                {input.length}
                            </span>
                        )}
                    </div>

                    {/* Send / Mic button */}
                    {hasInput ? (
                        <button
                            type="submit"
                            disabled={isDisabled}
                            aria-label="Send"
                            className="
                                w-9 h-9 rounded-full flex-shrink-0 mb-0.5 flex items-center justify-center
                                bg-gradient-to-br from-violet-600 to-violet-700
                                text-white shadow-lg shadow-violet-900/40
                                hover:from-violet-500 hover:to-violet-600
                                active:scale-90 transition-all duration-150
                                disabled:opacity-40 disabled:cursor-not-allowed
                                animate-scaleIn
                            "
                        >
                            <svg className="w-4 h-4 translate-x-[1px] -translate-y-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={!isVerified}
                            aria-label="Voice message"
                            className="
                                w-9 h-9 rounded-full flex-shrink-0 mb-0.5 flex items-center justify-center
                                text-gray-500 hover:text-gray-300 hover:bg-white/5
                                active:scale-90 transition-all duration-150
                                disabled:opacity-30 disabled:cursor-not-allowed
                            "
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    )}
                </form>

                {/* iOS safe-area spacer */}
                <div style={{ height: 'env(safe-area-inset-bottom, 0px)', backgroundColor: 'inherit' }} />
            </div>

            {/* Tailwind keyframe classes via style tag */}
            <style>{`
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
                .animate-typingDot { animation: typingDot 1.2s infinite ease-in-out both; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease both; }

                @keyframes scaleIn {
                    from { transform: scale(0.7); opacity: 0; }
                    to   { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both; }
            `}</style>
        </>
    );
};

export default ChatInput;