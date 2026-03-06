import React, { useState, useRef, useEffect, useCallback } from 'react';
import EmojiPicker from '../common/EmojiPicker';

export const ChatInput = ({
  input, setInput, handleSend,
  currentUser, selectedChatPartner,
  showEmojiPicker, setShowEmojiPicker,
  currentDisplayName, getDefaultName,
  setShowSettingsModal,
}) => {
  const [focused, setFocused] = useState(false);
  const [vvBottom, setVvBottom] = useState(0); // keyboard offset in px
  const inputRef = useRef(null);
  const formRef = useRef(null);

  /* ── Visual Viewport: keeps bar glued above keyboard on ALL mobile browsers ── */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const bottom = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setVvBottom(bottom);
      if (bottom > 60) {
        // Keyboard just opened – nudge chat to bottom
        setTimeout(() => {
          document.getElementById('nc-end')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 80);
      }
    };

    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); };
  }, []);

  /* Dismiss emoji on outside click */
  useEffect(() => {
    const fn = (e) => { if (formRef.current && !formRef.current.contains(e.target)) setShowEmojiPicker(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [setShowEmojiPicker]);

  const addEmoji = useCallback((e) => {
    setInput(p => p + e);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [setInput]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  };

  const verified = currentUser?.emailVerified;
  const disabled = !verified || !input.trim();
  const needsName = getDefaultName?.(currentUser?.email) === currentDisplayName && !selectedChatPartner && verified;
  const ph = !verified
    ? 'Verify email to chat…'
    : selectedChatPartner
      ? `Message ${selectedChatPartner.displayName}…`
      : 'Message everyone…';

  /* Fixed positioning above keyboard */
  const barStyle = {
    position: 'fixed',
    left: 0, right: 0,
    bottom: vvBottom,
    zIndex: 100,
  };
  const emojiStyle = {
    position: 'fixed',
    left: 0, right: 0,
    bottom: vvBottom + 60,
    zIndex: 110,
    padding: '0 12px',
  };

  return (
    <>
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div style={emojiStyle}>
          <div className="max-w-sm mx-auto">
            <EmojiPicker onEmojiSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="nc-input-bar" style={barStyle}>
        {/* Banners */}
        {currentUser && !verified && (
          <div className="px-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <p className="text-[12px] text-amber-400 flex-1">Verify your email to start chatting</p>
              <button className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex-shrink-0">Resend</button>
            </div>
          </div>
        )}
        {needsName && (
          <div className="px-3 pt-2">
            <button
              onClick={() => setShowSettingsModal?.(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
              <p className="text-[12px] text-violet-400 flex-1 text-left">Set a display name to send messages</p>
              <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Form row */}
        <form ref={formRef} onSubmit={handleSend} className="flex items-end gap-2 px-2.5 sm:px-3 py-2.5">
          {/* Emoji toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(p => !p)}
            disabled={!verified}
            className={`w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-all mb-0.5 ${showEmojiPicker ? 'bg-violet-500/20 text-violet-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'} disabled:opacity-30`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="1.7"/>
              <path strokeLinecap="round" strokeWidth="1.7" d="M8 13.5s1.5 2 4 2 4-2 4-2"/>
              <circle cx="9" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
            </svg>
          </button>

          {/* Input pill */}
          <div className={`flex-1 relative flex items-center rounded-full border transition-all duration-150 ${focused ? 'bg-[#202020] border-violet-500/50 shadow-[0_0_0_3px_rgba(124,58,237,0.07)]' : 'bg-[#1a1a1a] border-white/[0.07]'}`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={ph}
              disabled={!verified}
              autoComplete="off"
              autoCorrect="on"
              spellCheck="true"
              enterKeyHint="send"
              style={{ fontSize: '16px' }} /* prevents iOS zoom */
              className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-[15px] text-white placeholder-gray-600 focus:outline-none disabled:opacity-30"
            />
            {input.length > 80 && (
              <span className="absolute right-3.5 text-[10px] text-gray-600 tabular-nums pointer-events-none">{input.length}</span>
            )}
          </div>

          {/* Send / Mic */}
          {input.trim() ? (
            <button
              type="submit"
              disabled={disabled}
              className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center flex-shrink-0 mb-0.5 transition-all active:scale-90 shadow-md shadow-violet-900/40 disabled:opacity-40"
            >
              <svg className="w-4 h-4 translate-x-px -translate-y-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              disabled={!verified}
              className="w-9 h-9 rounded-full text-gray-500 hover:text-gray-300 hover:bg-white/5 flex items-center justify-center flex-shrink-0 mb-0.5 transition-all disabled:opacity-30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7}
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
        </form>

        {/* iOS safe area */}
        <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </div>
    </>
  );
};

export default ChatInput;