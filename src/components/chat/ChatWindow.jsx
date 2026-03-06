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
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  /* Track window resize and keyboard */
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      
      // Detect keyboard on mobile
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const isKeyboardOpen = viewportHeight < windowHeight * 0.8;
        setKeyboardVisible(isKeyboardOpen);
      }
    };

    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  /* Track input bar height */
  useEffect(() => {
    const findInputBar = () => {
      // Try multiple selectors to find the input bar
      const bar = document.querySelector('.nc-input-bar') || 
                  document.querySelector('footer.sticky') ||
                  document.querySelector('[class*="ChatInput"]') ||
                  document.querySelector('form[class*="flex"]');
      
      if (!bar) return;
      
      const ro = new ResizeObserver(([e]) => {
        const height = e.contentRect.height;
        setInputHeight(height + 8); // Add safe padding
      });
      
      ro.observe(bar);
      return () => ro.disconnect();
    };

    // Give time for DOM to render
    const timer = setTimeout(findInputBar, 100);
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
    
    const threshold = 50; // Lower threshold for mobile
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    
    setAtBottom(near); 
    setShowFab(!near && !keyboardVisible); // Hide FAB when keyboard is visible
    
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

  /* Handle iOS safe areas */
  useEffect(() => {
    // Add safe area padding to body if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }
  }, []);

  const groups = groupByDate(messages);

  // Calculate dynamic styles
  const scrollContainerStyle = {
    paddingBottom: keyboardVisible ? inputHeight : inputHeight + 'px',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'contain',
    height: keyboardVisible ? '100%' : '100%',
    maxHeight: keyboardVisible ? `calc(100vh - ${inputHeight}px)` : '100%'
  };

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden bg-[#0A0A0A]">
      {/* Scrollable area */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        style={scrollContainerStyle}
      >
        {/* Empty state – DM */}
        {!messages.length && selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 text-center">
            <div className="relative mb-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[3px] shadow-[0_8px_24px_rgba(124,58,237,0.3)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-violet-400">
                    {selectedChatPartner.displayName?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#111] ${selectedChatPartner.state === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1.5">
              {selectedChatPartner.displayName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              {selectedChatPartner.state === 'online' ? 'Active now' : 'Start the conversation'}
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span className="text-[11px] text-gray-400">End-to-end encrypted</span>
            </div>
          </div>
        )}

        {/* Empty state – global */}
        {!messages.length && !selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-12 px-4 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 flex items-center justify-center mb-5 shadow-[0_8px_32px_rgba(124,58,237,0.3)]">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M7 8V6a2 2 0 012-2h9a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Global Chat</h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-[240px]">
              Everyone in NexChat can see your messages here
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="px-3 sm:px-4 py-3">
            {groups.map(g => (
              <div key={g.date} className="mb-4">
                {/* Date pill */}
                <div className="sticky top-2 z-10 flex justify-center my-3">
                  <span className="px-4 py-1.5 rounded-full text-[11px] font-medium text-gray-400 bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                    {dateLabel(g.date)}
                  </span>
                </div>
                
                {/* Messages */}
                <div className="space-y-[2px]">
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
            ))}
          </div>
        )}

        {/* Scroll anchor */}
        <div id="nc-end" ref={endRef} className="h-0" />
      </div>

      {/* New messages pill - positioned absolutely */}
      {newCount > 0 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-slide-down">
          <button
            onClick={() => { 
              scrollToEnd('smooth'); 
              setNewCount(0); 
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-xl active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
            </svg>
            <span>{newCount} new message{newCount > 1 ? 's' : ''}</span>
          </button>
        </div>
      )}

      {/* Scroll FAB - adjusted for mobile */}
      {showFab && !newCount && (
        <button
          onClick={() => scrollToEnd('smooth')}
          style={{ 
            bottom: keyboardVisible ? inputHeight + 10 : inputHeight + 10,
            right: '16px'
          }}
          className="fixed z-40 w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shadow-lg hover:bg-[#252525] active:scale-90 transition-all sm:right-5"
          aria-label="Scroll to bottom"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;