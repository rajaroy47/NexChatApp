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
  const [inputH, setInputH] = useState(64);

  /* Track input bar height so we can pad accordingly */
  useEffect(() => {
    const bar = document.querySelector('.nc-input-bar');
    if (!bar) return;
    const ro = new ResizeObserver(([e]) => setInputH(e.contentRect.height + 4));
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const scrollToEnd = useCallback((b = 'smooth') => {
    endRef.current?.scrollIntoView({ behavior: b, block: 'end' });
  }, []);

  const onScroll = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(near); setShowFab(!near);
    if (near) setNewCount(0);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    const len = messages.length;
    if (len <= prevLen) { setPrevLen(len); return; }
    const last = messages[len - 1];
    const mine = last && (last.senderUid || last.uid) === currentUser?.uid;
    if (atBottom || mine) { scrollToEnd('smooth'); setNewCount(0); }
    else setNewCount(c => c + (len - prevLen));
    setPrevLen(len);
  }, [messages, atBottom, prevLen, scrollToEnd, currentUser?.uid]);

  /* Reset on chat switch */
  useEffect(() => { scrollToEnd('auto'); setNewCount(0); }, [selectedChatPartner, scrollToEnd]);

  const groups = groupByDate(messages);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* ── Scrollable area ── */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden nc-scroll"
        style={{ paddingBottom: inputH, WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        {/* Empty state – DM */}
        {!messages.length && selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-16 px-6 text-center">
            <div className="relative mb-4">
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-0.5 shadow-[0_0_28px_rgba(124,58,237,0.3)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                  <span className="text-2xl font-bold text-violet-400">{selectedChatPartner.displayName?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#111] ${selectedChatPartner.state === 'online' ? 'bg-emerald-500' : 'bg-gray-600'}`} />
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1">{selectedChatPartner.displayName}</h3>
            <p className="text-[12px] text-gray-500 mb-5">{selectedChatPartner.state === 'online' ? 'Active now' : 'Start the conversation'}</p>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.05] border border-white/[0.07]">
              <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              <span className="text-[11px] text-gray-500">End-to-end private</span>
            </div>
          </div>
        )}

        {/* Empty state – global */}
        {!messages.length && !selectedChatPartner && (
          <div className="flex flex-col items-center justify-center min-h-full py-16 px-6 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-violet-600 via-pink-600 to-orange-500 flex items-center justify-center mb-4 shadow-[0_0_32px_rgba(124,58,237,0.25)]">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1M7 8V6a2 2 0 012-2h9a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              </svg>
            </div>
            <h3 className="text-[16px] font-semibold text-white mb-1.5">Global Chat</h3>
            <p className="text-[12px] text-gray-500 max-w-[200px]">Everyone connected can see your messages.</p>
          </div>
        )}

        {/* Messages */}
        <div className="py-2">
          {groups.map(g => (
            <div key={g.date}>
              {/* Date pill */}
              <div className="sticky top-2 z-10 flex justify-center my-2.5">
                <span className="px-3 py-[5px] rounded-full text-[10px] font-medium text-gray-400 bg-[#111]/90 backdrop-blur-md border border-white/[0.07]">
                  {dateLabel(g.date)}
                </span>
              </div>
              <div className="space-y-[2px]">
                {g.msgs.map((m, i) => {
                  const prev = g.msgs[i - 1];
                  const same = prev && (prev.senderUid || prev.uid) === (m.senderUid || m.uid) && m.timestamp - prev.timestamp < 300_000;
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

        <div id="nc-end" ref={endRef} className="h-1" />
      </div>

      {/* New messages pill */}
      {newCount > 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => { scrollToEnd(); setNewCount(0); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-600 text-white text-[12px] font-semibold shadow-lg shadow-violet-900/50 active:scale-95 transition-all nc-slide-down"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" /></svg>
            {newCount} new
          </button>
        </div>
      )}

      {/* Scroll FAB */}
      {showFab && !newCount && (
        <button
          onClick={() => scrollToEnd()}
          style={{ bottom: inputH + 10 }}
          className="absolute right-3 sm:right-4 z-20 w-9 h-9 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white shadow-lg hover:bg-[#252525] active:scale-90 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;