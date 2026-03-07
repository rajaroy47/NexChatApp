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
    setShowSettingsModal 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [visualViewportHeight, setVisualViewportHeight] = useState(null);
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const wrapperRef = useRef(null);

    // ── Perfect mobile keyboard handling ──────────────────────────────────────
    // Uses visualViewport API to track keyboard position precisely.
    // The wrapper sticks to the top of the virtual keyboard on ALL mobile browsers.
    useEffect(() => {
        if (!window.visualViewport) return;

        const onViewportChange = () => {
            const vvHeight = window.visualViewport.height;
            const vvOffsetTop = window.visualViewport.offsetTop;
            // Calculate what the bottom offset should be so input sits right above keyboard
            const bottomOffset = window.innerHeight - vvHeight - vvOffsetTop;
            setVisualViewportHeight({ height: vvHeight, bottom: Math.max(0, bottomOffset) });

            // Scroll chat to bottom after keyboard animation
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

    // Bottom offset from visualViewport (pushes input above keyboard)
    const bottomStyle = visualViewportHeight
        ? { bottom: visualViewportHeight.bottom, position: 'fixed', left: 0, right: 0, zIndex: 100 }
        : {};

    return (
        <>
            {/* Emoji picker floats above input */}
            {showEmojiPicker && (
                <div
                    style={visualViewportHeight
                        ? { position: 'fixed', bottom: (visualViewportHeight.bottom + 64), left: 0, right: 0, zIndex: 110 }
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

            {/* ── Input bar – fixed above keyboard ────────────────────────────── */}
            <div
                ref={wrapperRef}
                className="nexchat-input-bar"
                style={bottomStyle}
            >
                {/* Warning banners */}
                {currentUser && !isVerified && (
                    <div className="px-3 pt-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                            <p className="text-xs text-amber-400 flex-1">Verify your email to start chatting</p>
                            <button className="text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors">Resend</button>
                        </div>
                    </div>
                )}
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
                            nexchat-icon-btn flex-shrink-0 mb-0.5
                            ${showEmojiPicker ? 'text-violet-400 bg-violet-500/15' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
                            disabled:opacity-30 disabled:cursor-not-allowed
                        `}
                        aria-label="Emoji"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="1.8"/>
                            <path strokeLinecap="round" strokeWidth="1.8" d="M8 13s1.5 2.5 4 2.5 4-2.5 4-2.5"/>
                            <circle cx="9" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
                            <circle cx="15" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
                        </svg>
                    </button>

                    {/* Text input – pill shaped like WhatsApp */}
                    <div className={`
                        flex-1 relative flex items-center
                        bg-[#1E1E1E] rounded-3xl border
                        transition-all duration-200
                        ${isFocused ? 'border-violet-500/60 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]' : 'border-white/[0.06]'}
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
                            style={{ fontSize: '16px' /* prevents iOS zoom */ }}
                            className="
                                flex-1 min-w-0 bg-transparent text-[15px] text-white
                                placeholder-gray-600 px-4 py-2.5
                                focus:outline-none disabled:opacity-30
                                disabled:cursor-not-allowed
                            "
                        />
                        {input.length > 0 && (
                            <span className="absolute right-3.5 text-[11px] text-gray-600 tabular-nums select-none">
                                {input.length}
                            </span>
                        )}
                    </div>

                    {/* Send / Mic button */}
                    {input.trim() ? (
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="nexchat-send-btn flex-shrink-0 mb-0.5"
                            aria-label="Send"
                        >
                            <svg className="w-5 h-5 translate-x-0.5 -translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={!isVerified}
                            className="nexchat-icon-btn text-gray-400 hover:text-gray-200 hover:bg-white/5 flex-shrink-0 mb-0.5 disabled:opacity-30"
                            aria-label="Voice message"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    )}
                </form>

                {/* Safe-area spacer for iOS home indicator */}
                <div style={{ height: 'env(safe-area-inset-bottom, 0px)', backgroundColor: 'inherit' }} />
            </div>
        </>
    );
};

export default ChatInput;