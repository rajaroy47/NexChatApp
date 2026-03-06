import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const [prevLen, setPrevLen] = useState(0);
  const [inputBarH, setInputBarH] = useState(68);

  // Track input bar height for padding
  useEffect(() => {
    const bar = document.querySelector('.nexchat-input-bar');
    if (!bar) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setInputBarH(e.contentRect.height + 8);
    });
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 80;
    setShowScrollBtn(!atBottom);
    setIsAtBottom(atBottom);
    if (atBottom) setNewMsgCount(0);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    const len = messages.length;
    if (len <= prevLen) { setPrevLen(len); return; }
    const last = messages[len - 1];
    const isOwn = last && (last.senderUid || last.uid) === currentUser?.uid;
    if (isAtBottom || isOwn) {
      scrollToBottom('smooth');
      setNewMsgCount(0);
    } else {
      setNewMsgCount(c => c + (len - prevLen));
    }
    setPrevLen(len);
  }, [messages, isAtBottom, prevLen, scrollToBottom, currentUser?.uid]);

  // Jump to bottom on chat switch
  useEffect(() => {
    scrollToBottom('auto');
    setNewMsgCount(0);
  }, [selectedChatPartner, scrollToBottom]);

  // Date label formatting
  const formatDateLabel = (dateStr) => {
    const today = new Date().toDateString();
    const yday = new Date(Date.now() - 86400000).toDateString();
    if (dateStr === today) return 'Today';
    if (dateStr === yday) return 'Yesterday';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      day: 'numeric', month: 'long',
      year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  // Group messages by date
  const grouped = (() => {
    const out = [];
    let curDate = null, curGroup = [];
    [...messages].sort((a, b) => a.timestamp - b.timestamp).forEach(msg => {
      const d = new Date(msg.timestamp).toDateString();
      if (d !== curDate) {
        if (curGroup.length) out.push({ date: curDate, messages: curGroup });
        curDate = d; curGroup = [msg];
      } else {
        curGroup.push(msg);
      }
    });
    if (curGroup.length) out.push({ date: curDate, messages: curGroup });
    return out;
  })();

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden" style={{ background: '#0a0a0a' }}>

      {/* Scrollable message area */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden nexchat-scrollbar"
        style={{
          paddingBottom: inputBarH,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Empty state – private chat */}
        {messages.length === 0 && selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 text-center">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                  <span className="text-2xl font-bold text-violet-400">
                    {selectedChatPartner.displayName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#111] ${selectedChatPartner.state === 'online' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-1">{selectedChatPartner.displayName}</h3>
            <p className="text-[13px] text-gray-500 mb-6">
              {selectedChatPartner.state === 'online' ? 'Active now' : 'Start a conversation'}
            </p>
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/[0.07]">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span className="text-[12px] text-gray-500">Messages are private</span>
            </div>
          </div>
        )}

        {/* Empty state – global chat */}
        {messages.length === 0 && !selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-20 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 mb-5 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.25)]">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M7 8V6a2 2 0 012-2h9a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <h3 className="text-[17px] font-semibold text-white mb-2">Global Chat</h3>
            <p className="text-[13px] text-gray-500 max-w-[220px]">Say hello! Everyone connected can see your messages.</p>
          </div>
        )}

        {/* Messages grouped by date */}
        <div className="py-2">
          {grouped.map((group) => (
            <div key={group.date}>
              {/* Date pill */}
              <div className="sticky top-2 z-10 flex justify-center my-3">
                <span className="px-3 py-[5px] rounded-full text-[11px] font-medium text-gray-400 tracking-wide bg-[#111]/90 backdrop-blur-md border border-white/[0.07]">
                  {formatDateLabel(group.date)}
                </span>
              </div>

              {/* Message rows */}
              <div className="space-y-[2px]">
                {group.messages.map((msg, i) => {
                  const prev = group.messages[i - 1];
                  const sameSender =
                    prev &&
                    (prev.senderUid || prev.uid) === (msg.senderUid || msg.uid) &&
                    msg.timestamp - prev.timestamp < 300_000;
                  return (
                    <Message
                      key={msg.id}
                      message={msg}
                      isMyMessage={(msg.senderUid || msg.uid) === currentUser?.uid}
                      usersCache={usersCache}
                      currentUser={currentUser}
                      selectedChatPartner={selectedChatPartner}
                      chatId={chatId}
                      showAvatar={!sameSender}
                      isConsecutive={sameSender}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div id="chat-messages-end" ref={messagesEndRef} className="h-1" />
      </main>

      {/* New messages notification */}
      {newMsgCount > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => { scrollToBottom('smooth'); setNewMsgCount(0); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-[13px] font-semibold shadow-lg hover:bg-violet-500 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
            </svg>
            {newMsgCount} new {newMsgCount === 1 ? 'message' : 'messages'}
          </button>
        </div>
      )}

      {/* Scroll-to-bottom FAB */}
      {showScrollBtn && !newMsgCount && (
        <button
          onClick={() => scrollToBottom('smooth')}
          style={{ bottom: inputBarH + 12 }}
          className="absolute right-4 z-20 w-9 h-9 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center shadow-xl hover:bg-[#252525] active:scale-90 transition-all"
          aria-label="Scroll to bottom"
        >
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;