// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import EmojiPicker from '../common/EmojiPicker';
// import { setTypingStatus, getChatId } from "../../firebase/db";

// export const ChatInput = ({ 
//     input, 
//     setInput, 
//     handleSend, 
//     currentUser, 
//     selectedChatPartner,
//     showEmojiPicker,
//     setShowEmojiPicker,
//     currentDisplayName,
//     getDefaultName,
//     setShowSettingsModal 
// }) => {

//     const [isFocused, setIsFocused] = useState(false);
//     const [visualViewportHeight, setVisualViewportHeight] = useState(null);

//     const inputRef = useRef(null);
//     const formRef = useRef(null);
//     const wrapperRef = useRef(null);

//     const typingTimeoutRef = useRef(null);

//     /* Generate Chat ID */
//     const chatId = currentUser && selectedChatPartner
//         ? getChatId(currentUser.uid, selectedChatPartner.uid)
//         : null;

//     /* ───────── Mobile Keyboard Handling ───────── */
//     useEffect(() => {

//         if (!window.visualViewport) return;

//         const onViewportChange = () => {

//             const vvHeight = window.visualViewport.height;
//             const vvOffsetTop = window.visualViewport.offsetTop;

//             const bottomOffset = window.innerHeight - vvHeight - vvOffsetTop;

//             setVisualViewportHeight({
//                 height: vvHeight,
//                 bottom: Math.max(0, bottomOffset)
//             });

//             if (bottomOffset > 50) {
//                 setTimeout(() => {
//                     document
//                         .getElementById('chat-messages-end')
//                         ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
//                 }, 80);
//             }
//         };

//         window.visualViewport.addEventListener('resize', onViewportChange);
//         window.visualViewport.addEventListener('scroll', onViewportChange);

//         return () => {
//             window.visualViewport.removeEventListener('resize', onViewportChange);
//             window.visualViewport.removeEventListener('scroll', onViewportChange);
//         };

//     }, []);

//     /* ───────── Emoji Select ───────── */
//     const handleEmojiSelect = useCallback((emoji) => {

//         setInput(prev => prev + emoji);
//         setTimeout(() => inputRef.current?.focus(), 0);

//     }, [setInput]);

//     /* ───────── Typing Status ───────── */
//     const handleTyping = (value) => {

//         if (!chatId || !currentUser) return;

//         setTypingStatus(chatId, currentUser.uid, value.length > 0);

//         if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

//         typingTimeoutRef.current = setTimeout(() => {
//             setTypingStatus(chatId, currentUser.uid, false);
//         }, 2000);
//     };

//     /* ───────── Enter Send ───────── */
//     const handleKeyDown = (e) => {

//         if (e.key === 'Enter' && !e.shiftKey) {

//             e.preventDefault();

//             handleSend(e);

//             setInput("");

//             if (chatId && currentUser) {
//                 setTypingStatus(chatId, currentUser.uid, false);
//             }

//             setTimeout(() => {
//                 inputRef.current?.focus();
//             }, 10);
//         }
//     };

//     /* ───────── Close Emoji Picker ───────── */
//     useEffect(() => {

//         const handleClickOutside = (e) => {

//             if (formRef.current && !formRef.current.contains(e.target)) {
//                 setShowEmojiPicker(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         return () =>
//             document.removeEventListener('mousedown', handleClickOutside);

//     }, [setShowEmojiPicker]);

//     const isVerified = currentUser?.emailVerified;
//     const isDisabled = !isVerified || !input.trim();

//     const needsDisplayName =
//         getDefaultName?.(currentUser?.email) === currentDisplayName &&
//         !selectedChatPartner &&
//         isVerified;

//     const placeholder = !isVerified
//         ? 'Verify your email to chat...'
//         : selectedChatPartner
//             ? `Message ${selectedChatPartner.displayName}…`
//             : 'Message everyone…';

//     const bottomStyle = visualViewportHeight
//         ? {
//             bottom: visualViewportHeight.bottom,
//             position: 'fixed',
//             left: 0,
//             right: 0,
//             zIndex: 100
//         }
//         : {};

//     return (
//         <>
//             {showEmojiPicker && (
//                 <div
//                     style={visualViewportHeight
//                         ? {
//                             position: 'fixed',
//                             bottom: visualViewportHeight.bottom + 70,
//                             left: 0,
//                             right: 0,
//                             zIndex: 110
//                         }
//                         : {
//                             position: 'absolute',
//                             bottom: '100%',
//                             left: 0,
//                             right: 0,
//                             zIndex: 110,
//                             marginBottom: 8
//                         }
//                     }
//                     className="px-2 sm:px-3"
//                 >
//                     <div className="max-w-md sm:max-w-lg mx-auto">
//                         <EmojiPicker
//                             onEmojiSelect={handleEmojiSelect}
//                             onClose={() => setShowEmojiPicker(false)}
//                         />
//                     </div>
//                 </div>
//             )}

//             <div
//                 ref={wrapperRef}
//                 className="nexchat-input-bar w-full max-w-full"
//                 style={bottomStyle}
//             >

//                 <form
//                     ref={formRef}
//                     onSubmit={(e) => {

//                         e.preventDefault();

//                         handleSend(e);

//                         setInput("");

//                         if (chatId && currentUser) {
//                             setTypingStatus(chatId, currentUser.uid, false);
//                         }

//                         setTimeout(() => {
//                             inputRef.current?.focus();
//                         }, 10);

//                     }}
//                     className="flex items-end gap-2 px-2 sm:px-3 py-2.5"
//                 >

//                     <button
//                         type="button"
//                         onClick={() => setShowEmojiPicker(p => !p)}
//                         disabled={!isVerified}
//                         className="nexchat-icon-btn flex-shrink-0 mb-0.5 text-gray-400 hover:text-gray-200 text-lg"
//                     >
//                         🙂
//                     </button>

//                     <div className="flex-1 min-w-0 relative flex items-center bg-[#1E1E1E] rounded-3xl border border-white/[0.06]">

//                         <input
//                             ref={inputRef}
//                             type="text"
//                             name="message"
//                             value={input}
//                             onChange={(e) => {

//                                 const value = e.target.value;
//                                 setInput(value);
//                                 handleTyping(value);

//                             }}
//                             onKeyDown={handleKeyDown}
//                             onFocus={() => setIsFocused(true)}
//                             onBlur={() => {

//                                 setIsFocused(false);

//                                 if (chatId && currentUser) {
//                                     setTypingStatus(chatId, currentUser.uid, false);
//                                 }

//                             }}
//                             placeholder={placeholder}
//                             disabled={!isVerified}
//                             autoComplete="off"
//                             autoCorrect="off"
//                             autoCapitalize="off"
//                             spellCheck="false"
//                             inputMode="text"
//                             enterKeyHint="send"
//                             style={{ fontSize: '16px' }}
//                             className="flex-1 min-w-0 bg-transparent text-white px-3 sm:px-4 py-2.5 focus:outline-none text-sm sm:text-base"
//                         />

//                         {input.length > 0 && (
//                             <span className="absolute right-3 text-xs text-gray-500">
//                                 {input.length}
//                             </span>
//                         )}

//                     </div>

//                     {input.trim() && (
//                         <button
//                             type="submit"
//                             disabled={isDisabled}
//                             className="nexchat-send-btn flex-shrink-0 mb-0.5 text-lg"
//                         >
//                             ➤
//                         </button>
//                     )}

//                 </form>

//                 <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />

//             </div>
//         </>
//     );
// };

// export default ChatInput;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import EmojiPicker from '../common/EmojiPicker';
import { setTypingStatus } from "../../firebase/db";

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

    const typingTimeoutRef = useRef(null);

    /* ───────── Mobile Keyboard Handling ───────── */
    useEffect(() => {
        if (!window.visualViewport) return;

        const onViewportChange = () => {

            const vvHeight = window.visualViewport.height;
            const vvOffsetTop = window.visualViewport.offsetTop;

            const bottomOffset = window.innerHeight - vvHeight - vvOffsetTop;

            setVisualViewportHeight({
                height: vvHeight,
                bottom: Math.max(0, bottomOffset)
            });

            if (bottomOffset > 50) {
                setTimeout(() => {
                    document
                        .getElementById('chat-messages-end')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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

    /* ───────── Emoji Select ───────── */
    const handleEmojiSelect = useCallback((emoji) => {
        setInput(prev => prev + emoji);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [setInput]);

    /* ───────── Typing Status ───────── */
    const handleTyping = (value) => {

        if (!currentUser || !selectedChatPartner) return;

        setTypingStatus(currentUser.uid, selectedChatPartner.uid, value.length > 0);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setTypingStatus(currentUser.uid, selectedChatPartner.uid, false);
        }, 2000);
    };

    /* ───────── Refocus after send (keeps mobile keyboard open) ───────── */
    useEffect(() => {
        // When input is cleared after sending, re-focus to keep keyboard open
        if (input === '' && inputRef.current) {
            // Small delay lets the parent state flush before refocusing
            const t = setTimeout(() => inputRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [input]);

    /* ───────── Enter Send ───────── */
    const handleKeyDown = (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {

            e.preventDefault();
            handleSend(e);

            if (currentUser && selectedChatPartner) {
                setTypingStatus(currentUser.uid, selectedChatPartner.uid, false);
            }
        }
    };

    /* ───────── Close Emoji Picker ───────── */
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (formRef.current && !formRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);

    }, [setShowEmojiPicker]);

    const isVerified = currentUser?.emailVerified;
    const isDisabled = !isVerified || !input.trim();

    const needsDisplayName =
        getDefaultName?.(currentUser?.email) === currentDisplayName &&
        !selectedChatPartner &&
        isVerified;

    const placeholder = !isVerified
        ? '✉️ Verify your email to chat...'
        : selectedChatPartner
            ? `Message ${selectedChatPartner.displayName}…`
            : 'Message everyone…';

    const bottomStyle = visualViewportHeight
        ? {
            bottom: visualViewportHeight.bottom,
            position: 'fixed',
            left: 0,
            right: 0,
            zIndex: 100
        }
        : {};

    return (
        <>
            {/* ───────── Emoji Picker ───────── */}
            {showEmojiPicker && (
                <div
                    style={visualViewportHeight
                        ? {
                            position: 'fixed',
                            bottom: visualViewportHeight.bottom + 70,
                            left: 0,
                            right: 0,
                            zIndex: 110
                        }
                        : {
                            position: 'absolute',
                            bottom: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 110,
                            marginBottom: 8
                        }
                    }
                    className="px-2 sm:px-3"
                >
                    <div className="max-w-md sm:max-w-lg mx-auto">
                        <EmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            onClose={() => setShowEmojiPicker(false)}
                        />
                    </div>
                </div>
            )}

            {/* ───────── Input Bar ───────── */}
            <div
                ref={wrapperRef}
                className="nexchat-input-bar w-full max-w-full"
                style={bottomStyle}
            >

                {/* Verify Notice */}
                {currentUser && !isVerified && (
                    <div className="px-3 pt-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                            <p className="text-xs text-amber-400 flex-1">
                                Verify your email to start chatting
                            </p>
                        </div>
                    </div>
                )}

                {/* Display Name Notice */}
                {needsDisplayName && (
                    <div className="px-3 pt-2">
                        <button
                            onClick={() => setShowSettingsModal?.(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse flex-shrink-0" />
                            <p className="text-xs text-violet-400 flex-1 text-left">
                                Set your display name to send messages
                            </p>
                        </button>
                    </div>
                )}

                {/* ───────── Input Form ───────── */}
                <form
                    ref={formRef}
                    onSubmit={(e) => {

                        handleSend(e);

                        if (currentUser && selectedChatPartner) {
                            setTypingStatus(currentUser.uid, selectedChatPartner.uid, false);
                        }

                    }}
                    className="flex items-end gap-2 px-2 sm:px-3 py-2.5"
                >

                    {/* Emoji Button */}
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(p => !p)}
                        disabled={!isVerified}
                        className="nexchat-icon-btn flex-shrink-0 mb-0.5 text-gray-400 hover:text-gray-200 text-lg"
                    >
                        🙂
                    </button>

                    {/* Input Box */}
                    <div className="flex-1 min-w-0 relative flex items-center bg-[#1E1E1E] rounded-3xl border border-white/[0.06]">

                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => {

                                const value = e.target.value;
                                setInput(value);
                                handleTyping(value);

                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => {

                                setIsFocused(false);

                                if (currentUser && selectedChatPartner) {
                                    setTypingStatus(currentUser.uid, selectedChatPartner.uid, false);
                                }

                            }}
                            placeholder={placeholder}
                            disabled={!isVerified}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="sentences"
                            spellCheck={false}
                            name="nexchat-msg"
                            id="nexchat-msg"
                            enterKeyHint="send"
                            style={{ fontSize: '16px' }}
                            className="flex-1 min-w-0 bg-transparent text-white px-3 sm:px-4 py-2.5 focus:outline-none text-sm sm:text-base"
                        />

                        {input.length > 0 && (
                            <span className="absolute right-3 text-xs text-gray-500">
                                {input.length}
                            </span>
                        )}

                    </div>

                    {/* Send Button */}
                    {input.trim() && (
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="nexchat-send-btn flex-shrink-0 mb-0.5 text-lg"
                        >
                            ➤
                        </button>
                    )}

                </form>

                {/* iPhone Safe Area */}
                <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />

            </div>
        </>
    );
};

export default ChatInput;
