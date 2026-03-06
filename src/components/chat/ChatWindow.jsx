import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';

const dateLabel = (str) => {
  const d = new Date(str), now = new Date();
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (str === now.toDateString()) return 'Today';
  if (str === yest.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
};

const groupByDate = (msgs) => {
  const out = []; let date = null, batch = [];
  [...msgs].sort((a, b) => a.timestamp - b.timestamp).forEach(m => {
    const d = new Date(m.timestamp).toDateString();
    if (d !== date) { if (batch.length) out.push({ date, msgs: batch }); date = d; batch = [m]; }
    else batch.push(m);
  });
  if (batch.length) out.push({ date, msgs: batch });
  return out;
};

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
  const endRef = useRef(null);
  const scrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const [newCount, setNewCount] = useState(0);
  const [prevLen, setPrevLen] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const [inputHeight, setInputHeight] = useState(64);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  /* Track keyboard visibility */
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const isKeyboardOpen = viewportHeight < windowHeight * 0.8;
        setKeyboardVisible(isKeyboardOpen);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  /* Track input bar height */
  useEffect(() => {
    const findInputBar = () => {
      const bar = document.querySelector('.nc-input-bar') || 
                  document.querySelector('footer') ||
                  document.querySelector('[class*="ChatInput"]');
      
      if (!bar) return;
      
      const ro = new ResizeObserver(([e]) => {
        setInputHeight(e.contentRect.height + 8);
      });
      
      ro.observe(bar);
      return () => ro.disconnect();
    };

    const timer = setTimeout(findInputBar, 200);
    return () => clearTimeout(timer);
  }, []);

  const scrollToEnd = useCallback((b = 'smooth') => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: b, block: 'end' });
    }
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current; 
    if (!el) return;
    
    const threshold = 50;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    
    setAtBottom(near); 
    setShowFab(!near && !keyboardVisible);
    
    if (near) setNewCount(0);
  }, [keyboardVisible]);

  /* Auto-scroll logic */
  useEffect(() => {
    const len = messages.length;
    if (len <= prevLen) { 
      setPrevLen(len); 
      return; 
    }
    
    const last = messages[len - 1];
    const mine = last && (last.senderUid || last.uid) === currentUser?.uid;
    
    if (atBottom || mine) { 
      scrollToEnd('smooth'); 
      setNewCount(0); 
    } else {
      setNewCount(c => c + (len - prevLen));
    }
    
    setPrevLen(len);
  }, [messages, atBottom, prevLen, scrollToEnd, currentUser?.uid]);

  /* Reset on chat switch */
  useEffect(() => { 
    scrollToEnd('auto'); 
    setNewCount(0); 
  }, [selectedChatPartner, scrollToEnd]);

  const groups = groupByDate(messages);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0A0A0A] w-full max-w-full">
      {/* Scrollable area - FIXED for mobile */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth w-full"
        style={{
          paddingBottom: keyboardVisible ? inputHeight : inputHeight + 'px',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          height: '100%',
          maxHeight: keyboardVisible ? `calc(100vh - ${inputHeight}px)` : '100%'
        }}
      >
        {/* Messages Container - FIXED for mobile */}
        <div className="w-full px-2 sm:px-4 py-3">
          {groups.length > 0 ? (
            groups.map(g => (
              <div key={g.date} className="mb-4 w-full">
                {/* Date pill - responsive */}
                <div className="sticky top-2 z-10 flex justify-center my-3 w-full">
                  <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-gray-400 bg-black/50 backdrop-blur-md border border-white/10 shadow-lg whitespace-nowrap">
                    {dateLabel(g.date)}
                  </span>
                </div>
                
                {/* Messages - full width */}
                <div className="space-y-[2px] w-full">
                  {g.msgs.map((m, i) => {
                    const prev = g.msgs[i - 1];
                    const same = prev && 
                      (prev.senderUid || prev.uid) === (m.senderUid || m.uid) && 
                      m.timestamp - prev.timestamp < 300000;
                    
                    return (
                      <Message
                        key={m.id}
                        message={m}
                        isMyMessage={(m.senderUid || m.uid) === currentUser?.uid}
                        usersCache={usersCache}
                        currentUser={currentUser}
                        selectedChatPartner={selectedChatPartner}
                        chatId={chatId}
                        showAvatar={!same}
                        isConsecutive={same}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            /* Empty State - GLOBAL CHAT FIXED for mobile */
            !selectedChatPartner && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4 text-center">
                {/* Icon - responsive sizing */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 flex items-center justify-center mb-6 shadow-xl">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M7 8V6a2 2 0 012-2h9a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  </svg>
                </div>

                {/* Title - responsive text */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Global Chat
                </h3>

                {/* Description - responsive width */}
                <p className="text-sm sm:text-base text-gray-500 max-w-[280px] sm:max-w-sm mb-6">
                  Connect with everyone in the NexChat community
                </p>

                {/* Features grid - responsive */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-[320px] sm:max-w-md mx-auto">
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-2xl mb-2">🌍</span>
                    <span className="text-[11px] sm:text-xs text-gray-400">Public</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-2xl mb-2">⚡</span>
                    <span className="text-[11px] sm:text-xs text-gray-400">Real-time</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-2xl mb-2">🔒</span>
                    <span className="text-[11px] sm:text-xs text-gray-400">Secure</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-2xl mb-2">👥</span>
                    <span className="text-[11px] sm:text-xs text-gray-400">Community</span>
                  </div>
                </div>

                {/* Start chatting prompt */}
                <div className="mt-8 text-xs sm:text-sm text-gray-600">
                  Be the first to start the conversation! 💬
                </div>
              </div>
            )
          )}

          {/* Private chat empty state - FIXED for mobile */}
          {messages.length === 0 && selectedChatPartner && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4 text-center">
              {/* Avatar with online status */}
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[3px] shadow-xl">
                  <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-violet-400">
                      {selectedChatPartner.displayName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <span className={`absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-[#111] ${selectedChatPartner.state === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
              </div>

              {/* User info */}
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {selectedChatPartner.displayName}
              </h3>
              <p className="text-sm text-gray-500 mb-8">
                {selectedChatPartner.state === 'online' ? '🟢 Active now' : '⚪ Offline'}
              </p>

              {/* Security badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-full border border-white/10">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span className="text-xs text-gray-400">End-to-end encrypted</span>
              </div>

              {/* Start chat prompt */}
              <p className="mt-8 text-xs text-gray-600">
                Send a message to start the conversation
              </p>
            </div>
          )}

          {/* Scroll anchor */}
          <div id="nc-end" ref={endRef} className="h-1" />
        </div>
      </div>

      {/* New messages pill - responsive positioning */}
      {newCount > 0 && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-slide-down px-4 w-full max-w-[300px] sm:max-w-sm">
          <button
            onClick={() => { 
              scrollToEnd('smooth'); 
              setNewCount(0); 
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-xl active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
            </svg>
            <span className="truncate">{newCount} new message{newCount > 1 ? 's' : ''}</span>
          </button>
        </div>
      )}

      {/* Scroll FAB - responsive positioning */}
      {showFab && !newCount && (
        <button
          onClick={() => scrollToEnd('smooth')}
          style={{ 
            bottom: keyboardVisible ? inputHeight + 8 : inputHeight + 8,
            right: 'max(16px, env(safe-area-inset-right))'
          }}
          className="fixed z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shadow-lg hover:bg-[#252525] active:scale-90 transition-all"
          aria-label="Scroll to bottom"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;