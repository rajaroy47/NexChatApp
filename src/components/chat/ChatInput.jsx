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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [visualViewportHeight, setVisualViewportHeight] = useState(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mobile keyboard handling via visualViewport API
  useEffect(() => {
    if (!window.visualViewport) return;
    const onViewportChange = () => {
      const vvHeight = window.visualViewport.height;
      const vvOffsetTop = window.visualViewport.offsetTop;
      const bottomOffset = window.innerHeight - vvHeight - vvOffsetTop;
      setVisualViewportHeight({ height: vvHeight, bottom: Math.max(0, bottomOffset) });
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

  // Close emoji picker when clicking outside (but NOT when clicking inside the picker)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowEmojiPicker]);

  const handleEmojiSelect = useCallback((emoji) => {
    setInput(prev => prev + emoji);
    // Return focus to input after inserting emoji
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [setInput]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const isVerified = currentUser?.emailVerified;
  const isDisabled = !isVerified || !input.trim();
  const needsDisplayName =
    getDefaultName?.(currentUser?.email) === currentDisplayName &&
    !selectedChatPartner &&
    isVerified;

  const placeholder = !isVerified
    ? '✉️ Verify your email to chat…'
    : selectedChatPartner
    ? `Message ${selectedChatPartner.displayName}…`
    : 'Message everyone…';

  const bottomStyle = visualViewportHeight
    ? { bottom: visualViewportHeight.bottom, position: 'fixed', left: 0, right: 0, zIndex: 100 }
    : {};

  const emojiPickerBottom = visualViewportHeight
    ? { position: 'fixed', bottom: visualViewportHeight.bottom + 64, left: 0, right: 0, zIndex: 110 }
    : { position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 110, marginBottom: 8 };

  return (
    <>
      {/* Emoji picker floats above input */}
      {showEmojiPicker && (
        <div style={emojiPickerBottom} className="px-3 flex justify-start">
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      {/* Input bar */}
      <div
        ref={wrapperRef}
        className="nexchat-input-bar bg-[#0e0e0e] border-t border-white/[0.06]"
        style={bottomStyle}
      >
        {/* Email verification warning */}
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
          className="flex items-center gap-2 px-3 py-2.5"
        >
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(p => !p)}
            disabled={!isVerified}
            aria-label="Emoji"
            className={`
              flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150
              ${showEmojiPicker
                ? 'text-violet-400 bg-violet-500/15'
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }
              disabled:opacity-30 disabled:cursor-not-allowed
            `}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
              <path strokeLinecap="round" strokeWidth="1.8" d="M8 13.5s1.5 2 4 2 4-2 4-2" />
              <circle cx="9" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </button>

          {/* Image upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isVerified}
            aria-label="Attach image"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

          {/* Text input */}
          <div className={`
            flex-1 relative flex items-center
            bg-[#1a1a1a] rounded-2xl border transition-all duration-200
            ${isFocused ? 'border-violet-500/50 shadow-[0_0_0_3px_rgba(139,92,246,0.07)]' : 'border-white/[0.07]'}
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
              className="flex-1 min-w-0 bg-transparent text-[15px] text-white placeholder-gray-600 px-4 py-2.5 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
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
              aria-label="Send"
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white transition-all duration-150 shadow-md shadow-violet-900/40 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
            >
              <svg className="w-4 h-4 translate-x-[1px] -translate-y-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              disabled={!isVerified}
              aria-label="Voice message"
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-all duration-150 disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </form>

        {/* iOS safe area inset */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </>
  );
};

export default ChatInput;