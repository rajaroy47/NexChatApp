import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';

export const ChatWindow = ({
    messages,
    currentUser,
    usersCache,
    selectedChatPartner,
    chatId,
    isPartnerTyping, // NEW: boolean – show typing bubble inside message stream
}) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [newMsgCount, setNewMsgCount] = useState(0);
    const [prevLen, setPrevLen] = useState(0);
    const [inputBarH, setInputBarH] = useState(68);

    // Track real input bar height (grows with keyboard / emoji picker)
    useEffect(() => {
        const bar = document.querySelector('.nexchat-input-bar');
        if (!bar) return;
        const ro = new ResizeObserver(entries => {
            for (const e of entries) setInputBarH(e.contentRect.height + 16);
        });
        ro.observe(bar);
        return () => ro.disconnect();
    }, []);

    // Keyboard visibility sync
    useEffect(() => {
        if (!window.visualViewport) return;
        const onVV = () => {
            const diff = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
            if (diff < 50 && containerRef.current) {
                containerRef.current.style.paddingBottom = `${inputBarH}px`;
            }
        };
        window.visualViewport.addEventListener('resize', onVV);
        return () => window.visualViewport.removeEventListener('resize', onVV);
    }, [inputBarH]);

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

    // Scroll to bottom when typing indicator appears/disappears
    useEffect(() => {
        if (isPartnerTyping && isAtBottom) scrollToBottom('smooth');
    }, [isPartnerTyping, isAtBottom, scrollToBottom]);

    // Jump to bottom on chat switch
    useEffect(() => {
        scrollToBottom('auto');
        setNewMsgCount(0);
    }, [selectedChatPartner, scrollToBottom]);

    // ── Date grouping ──────────────────────────────────────────────────────────
    const formatDateLabel = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        const yday = new Date(today); yday.setDate(today.getDate() - 1);
        if (dateStr === today.toDateString()) return 'Today';
        if (dateStr === yday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString('en-US', {
            day: 'numeric', month: 'long',
            year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

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
        <div className="relative flex-1 flex flex-col min-h-0 bg-[#111111] overflow-hidden">

            {/* Scrollable message area */}
            <main
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto overflow-x-hidden nexchat-scrollbar"
                style={{
                    paddingBottom: inputBarH,
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(139,92,246,0.2) transparent',
                }}
            >
                {/* Subtle cross-hatch texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.018]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* ── Empty state: private chat ─── */}
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
                            <span className={`
                                absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#111]
                                ${selectedChatPartner.state === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-gray-600'}
                            `} />
                        </div>
                        <h3 className="text-[17px] font-semibold text-white mb-1">{selectedChatPartner.displayName}</h3>
                        <p className="text-[13px] text-gray-500 mb-6">
                            {selectedChatPartner.state === 'online' ? 'Active now' : 'Tap to start a conversation'}
                        </p>
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/[0.07]">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                            </svg>
                            <span className="text-[12px] text-gray-500">Messages are private</span>
                        </div>
                    </div>
                )}

                {/* ── Empty state: global chat ─── */}
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

                {/* ── Message groups ─── */}
                <div className="py-3">
                    {grouped.map((group) => (
                        <div key={group.date}>
                            {/* Date pill */}
                            <div className="sticky top-2 z-10 flex justify-center my-3 pointer-events-none">
                                <span className="px-3 py-[5px] rounded-full text-[11px] font-medium text-gray-400 tracking-wide bg-[#111]/90 backdrop-blur-md border border-white/[0.07] shadow-sm">
                                    {formatDateLabel(group.date)}
                                </span>
                            </div>

                            <div className="space-y-[2px]">
                                {group.messages.map((msg, i) => {
                                    const prev = group.messages[i - 1];
                                    const sameSender = prev &&
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

                    {/* ── Inline typing indicator bubble ─── */}
                    {isPartnerTyping && (
                        <div className="flex items-end gap-2 px-3 mt-3 animate-msgIn">
                            {/* Mini avatar */}
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
                            >
                                {(selectedChatPartner?.displayName || '?').charAt(0).toUpperCase()}
                            </div>
                            {/* Dots bubble */}
                            <div className="flex items-center gap-[4px] px-4 py-3 rounded-[20px] rounded-bl-[5px] bg-[#1c1c1e] border border-white/[0.06]">
                                <span className="w-[6px] h-[6px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '0ms' }} />
                                <span className="w-[6px] h-[6px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '180ms' }} />
                                <span className="w-[6px] h-[6px] rounded-full bg-violet-400 animate-typingDot" style={{ animationDelay: '360ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Scroll anchor */}
                <div id="chat-messages-end" ref={messagesEndRef} className="h-1" />
            </main>

            {/* ── New messages pill ── */}
            {newMsgCount > 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                    <button
                        onClick={() => { scrollToBottom('smooth'); setNewMsgCount(0); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white text-[13px] font-semibold shadow-lg shadow-violet-900/40 hover:bg-violet-700 active:scale-95 transition-all"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
                        </svg>
                        {newMsgCount} new {newMsgCount === 1 ? 'message' : 'messages'}
                    </button>
                </div>
            )}

            {/* ── Scroll-to-bottom FAB ── */}
            {showScrollBtn && !newMsgCount && (
                <button
                    onClick={() => scrollToBottom('smooth')}
                    style={{ bottom: inputBarH + 12 }}
                    className="absolute right-4 z-20 w-10 h-10 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center shadow-xl hover:bg-[#252525] active:scale-90 transition-all"
                    aria-label="Scroll to bottom"
                >
                    <svg className="w-[18px] h-[18px] text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7-7-7" />
                    </svg>
                </button>
            )}

            <style>{`
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
                    30% { transform: translateY(-5px); opacity: 1; }
                }
                .animate-typingDot { animation: typingDot 1.2s infinite ease-in-out both; }

                @keyframes msgIn {
                    from { opacity: 0; transform: translateY(10px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-msgIn { animation: msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }

                .nexchat-scrollbar::-webkit-scrollbar { width: 3px; }
                .nexchat-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .nexchat-scrollbar::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ChatWindow;