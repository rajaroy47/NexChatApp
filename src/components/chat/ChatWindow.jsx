import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';
import { markMessageDelivered, markMessageRead } from "../../firebase/db";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/config";

export const ChatWindow = ({ messages, currentUser, usersCache, selectedChatPartner, chatId }) => {

const messagesEndRef = useRef(null);
const containerRef = useRef(null);

const [showScrollBtn, setShowScrollBtn] = useState(false);
const [isAtBottom, setIsAtBottom] = useState(true);
const [newMsgCount, setNewMsgCount] = useState(0);
const [prevLen, setPrevLen] = useState(0);
const [inputBarH, setInputBarH] = useState(68);
const [typingText, setTypingText] = useState("");



// =========================
// LISTEN FOR TYPING
// =========================

useEffect(() => {

    if (!selectedChatPartner || !currentUser) return;

    const typingRef = ref(
        db,
        `typing/${selectedChatPartner.uid}/${currentUser.uid}`
    );

    const unsubscribe = onValue(typingRef, (snap) => {

        if (snap.val()) {
            setTypingText(`${selectedChatPartner.displayName} is typing...`);
        } else {
            setTypingText("");
        }

    });

    return () => unsubscribe();

}, [selectedChatPartner, currentUser]);



// =========================
// AUTO MARK MESSAGE STATUS
// =========================

useEffect(() => {

    if (!messages || !chatId || !currentUser) return;

    messages.forEach((msg) => {

        const sender = msg.senderUid || msg.uid;

        if (!sender || !msg.id) return;

        if (sender !== currentUser.uid && msg.status === "sent") {
            markMessageDelivered(chatId, msg.id);
        }

        if (sender !== currentUser.uid && msg.status === "delivered") {
            markMessageRead(chatId, msg.id);
        }

    });

}, [messages, chatId, currentUser]);



// =========================
// TRACK INPUT BAR HEIGHT
// =========================

useEffect(() => {

    const bar = document.querySelector('.nexchat-input-bar');
    if (!bar) return;

    const ro = new ResizeObserver(entries => {

        for (const e of entries) {
            setInputBarH(e.contentRect.height + 16);
        }

    });

    ro.observe(bar);

    return () => ro.disconnect();

}, []);



// =========================
// VISUAL VIEWPORT FIX
// =========================

useEffect(() => {

    if (!window.visualViewport) return;

    const onVV = () => {

        const diff =
            window.innerHeight -
            window.visualViewport.height -
            window.visualViewport.offsetTop;

        if (diff < 50) {

            if (containerRef.current) {
                containerRef.current.style.paddingBottom = `${inputBarH}px`;
            }

        }

    };

    window.visualViewport.addEventListener('resize', onVV);

    return () =>
        window.visualViewport.removeEventListener('resize', onVV);

}, [inputBarH]);



// =========================
// SCROLL FUNCTIONS
// =========================

const scrollToBottom = useCallback((behavior = 'smooth') => {

    messagesEndRef.current?.scrollIntoView({
        behavior,
        block: 'end'
    });

}, []);



const handleScroll = useCallback(() => {

    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    const atBottom = scrollHeight - scrollTop - clientHeight < 80;

    setShowScrollBtn(!atBottom);
    setIsAtBottom(atBottom);

    if (atBottom) setNewMsgCount(0);

}, []);



// =========================
// AUTO SCROLL ON NEW MSG
// =========================

useEffect(() => {

    const len = messages.length;

    if (len <= prevLen) {
        setPrevLen(len);
        return;
    }

    const last = messages[len - 1];

    const isOwn =
        last && (last.senderUid || last.uid) === currentUser?.uid;

    if (isAtBottom || isOwn) {

        scrollToBottom('smooth');
        setNewMsgCount(0);

    } else {

        setNewMsgCount(c => c + (len - prevLen));

    }

    setPrevLen(len);

}, [messages, isAtBottom, prevLen, scrollToBottom, currentUser?.uid]);



// =========================
// CHAT SWITCH
// =========================

useEffect(() => {

    scrollToBottom('auto');
    setNewMsgCount(0);

}, [selectedChatPartner, scrollToBottom]);



// =========================
// DATE GROUPING
// =========================

const formatDateLabel = (dateStr) => {

    const d = new Date(dateStr);
    const today = new Date();
    const yday = new Date(today);

    yday.setDate(today.getDate() - 1);

    if (dateStr === today.toDateString()) return 'Today';
    if (dateStr === yday.toDateString()) return 'Yesterday';

    return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year:
            d.getFullYear() !== today.getFullYear()
                ? 'numeric'
                : undefined
    });

};



const grouped = (() => {

    const out = [];
    let curDate = null;
    let curGroup = [];

    [...messages]
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(msg => {

            const d = new Date(msg.timestamp).toDateString();

            if (d !== curDate) {

                if (curGroup.length)
                    out.push({ date: curDate, messages: curGroup });

                curDate = d;
                curGroup = [msg];

            } else {

                curGroup.push(msg);

            }

        });

    if (curGroup.length)
        out.push({ date: curDate, messages: curGroup });

    return out;

})();



// =========================
// RENDER
// =========================

return (

    <div className="relative flex-1 flex flex-col min-h-0 bg-nexchat-bg overflow-hidden">

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

            {typingText && (
                <div className="px-4 pt-2 text-xs text-gray-400 italic">
                    {typingText}
                </div>
            )}

            <div className="py-3">

                {grouped.map((group) => (

                    <div key={group.date}>

                        <div className="sticky top-2 z-10 flex justify-center my-3">

                            <span className="px-3 py-[5px] rounded-full text-[11px] font-medium text-gray-400 tracking-wide bg-[#111]/90 backdrop-blur-md border border-white/[0.07] shadow-sm">

                                {formatDateLabel(group.date)}

                            </span>

                        </div>

                        <div className="space-y-[2px]">

                            {group.messages.map((msg, i) => {

                                const prev = group.messages[i - 1];

                                const sameSender =
                                    prev &&
                                    (prev.senderUid || prev.uid) ===
                                    (msg.senderUid || msg.uid) &&
                                    msg.timestamp - prev.timestamp < 300000;

                                return (

                                    <Message
                                        key={msg.id}
                                        message={msg}
                                        isMyMessage={
                                            (msg.senderUid || msg.uid) ===
                                            currentUser?.uid
                                        }
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

            <div ref={messagesEndRef} className="h-1" />

        </main>

    </div>

);

};

export default ChatWindow;