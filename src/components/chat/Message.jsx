import React, { useState, useRef } from 'react';
import { ADMIN_UID } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import { deleteMessage, deletePrivateMessage } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';
import ConfirmationModal from '../common/ConfirmationModal';

const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(' ', '\u202f'); // narrow no-break space before AM/PM
};

const isAdmin = (uid) => uid === ADMIN_UID;

// Colour derived from display name – stable per user
const getAvatarColor = (name = '') => {
    const palette = [
        ['#7C3AED', '#A78BFA'], // violet
        ['#2563EB', '#60A5FA'], // blue
        ['#059669', '#34D399'], // emerald
        ['#D97706', '#FCD34D'], // amber
        ['#DB2777', '#F9A8D4'], // pink
        ['#DC2626', '#FCA5A5'], // red
        ['#7C3AED', '#C4B5FD'], // purple-lite
        ['#0891B2', '#67E8F9'], // cyan
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
};

// Compact avatar circle used inside message list
const MsgAvatar = ({ displayName }) => {
    const [from, to] = getAvatarColor(displayName);
    const initial = (displayName || '?').charAt(0).toUpperCase();
    return (
        <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 select-none shadow-sm"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            aria-label={displayName}
        >
            {initial}
        </div>
    );
};

export const Message = ({
    message,
    isMyMessage,
    usersCache,
    currentUser,
    selectedChatPartner,
    chatId,
    showAvatar = true,
    isConsecutive = false,
}) => {
    const [longPressing, setLongPressing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const longPressTimer = useRef(null);
    const menuRef = useRef(null);

    const senderUid = message.senderUid || message.uid;
    const senderInfo = usersCache?.[senderUid];
    const senderName = message.displayName || message.senderDisplayName || senderInfo?.displayName || getDefaultName(senderUid);
    const fromAdmin = isAdmin(senderUid);
    const time = formatTime(message.timestamp);

    // ── Long-press on mobile to show delete ────────────────────────────────
    const onTouchStart = () => {
        if (!isMyMessage) return;
        longPressTimer.current = setTimeout(() => {
            setShowMenu(true);
            setLongPressing(true);
        }, 420);
    };
    const onTouchEnd = () => {
        clearTimeout(longPressTimer.current);
        setLongPressing(false);
    };

    const handleDelete = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);
        try {
            if (selectedChatPartner) await deletePrivateMessage(chatId, message.id);
            else await deleteMessage(message.id);
        } catch (e) {
            console.error('Delete failed', e);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    // Bubble shape: rounded-3xl with one flat corner pointing toward avatar
    const myBubble   = 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-[20px] rounded-br-[5px]';
    const otherBubble = fromAdmin
        ? 'bg-gradient-to-br from-red-900/90 to-red-800/80 text-white rounded-[20px] rounded-bl-[5px] border border-red-700/30'
        : 'bg-[#1c1c1e] text-gray-100 rounded-[20px] rounded-bl-[5px] border border-white/[0.05]';
    // For consecutive messages, all corners rounded
    const consecutiveMy    = 'rounded-[20px] rounded-br-[20px]';
    const consecutiveOther = 'rounded-[20px]';

    return (
        <>
            <div
                className={`
                    flex items-end gap-2 px-3
                    ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}
                    ${isConsecutive ? 'mt-[2px]' : 'mt-3'}
                `}
            >
                {/* Avatar column */}
                <div className="w-7 flex-shrink-0 flex items-end">
                    {!isMyMessage && showAvatar && <MsgAvatar displayName={senderName} />}
                </div>

                {/* Bubble + meta column */}
                <div
                    className={`flex flex-col max-w-[72%] md:max-w-[55%] ${isMyMessage ? 'items-end' : 'items-start'}`}
                >
                    {/* Sender name (group / global, non-consecutive, other) */}
                    {!isMyMessage && !isConsecutive && (
                        <div className="flex items-center gap-1.5 mb-[3px] ml-1">
                            <span className="text-[12px] font-semibold text-gray-400 leading-none">
                                {senderName}
                            </span>
                            {fromAdmin && <AdminBadge />}
                        </div>
                    )}

                    {/* Bubble */}
                    <div
                        className={`
                            relative group
                            ${isMyMessage
                                ? isConsecutive ? `${myBubble} ${consecutiveMy}` : myBubble
                                : isConsecutive ? `${otherBubble} ${consecutiveOther}` : otherBubble
                            }
                            ${isDeleting ? 'opacity-40' : ''}
                            transition-opacity duration-200 select-none
                        `}
                        onMouseEnter={() => isMyMessage && setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchMove={onTouchEnd}
                    >
                        {/* Message text – padding-right leaves room for timestamp */}
                        <p className="text-[15px] leading-[1.45] break-words whitespace-pre-wrap px-3.5 pt-[9px] pb-[22px] pr-[54px]">
                            {message.message}
                        </p>

                        {/* Timestamp + status row – absolutely placed inside bubble */}
                        <div className={`
                            absolute bottom-[7px] right-[10px]
                            flex items-center gap-1
                            pointer-events-none
                        `}>
                            <span className="text-[11px] leading-none whitespace-nowrap opacity-60">
                                {time}
                            </span>
                            {/* Double tick for own messages */}
                            {isMyMessage && (
                                <svg className="w-3.5 h-3.5 opacity-70 flex-shrink-0" viewBox="0 0 16 11" fill="none">
                                    <path d="M1 6l4 4L15 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                                </svg>
                            )}
                        </div>

                        {/* Delete button – hover only (desktop), long-press (mobile) */}
                        {isMyMessage && showMenu && !isDeleting && (
                            <button
                                ref={menuRef}
                                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                                className={`
                                    absolute -top-3 ${isMyMessage ? '-left-8' : '-right-8'}
                                    w-7 h-7 rounded-full bg-[#1c1c1e] border border-white/10
                                    flex items-center justify-center
                                    text-gray-400 hover:text-red-400 hover:border-red-500/30
                                    shadow-lg transition-all duration-150
                                    animate-pop-in
                                `}
                                title="Delete message"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}

                        {/* Deleting spinner */}
                        {isDeleting && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-[inherit]">
                                <svg className="w-4 h-4 animate-spin text-white/60" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Message"
                message="Delete this message for everyone? This can't be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default Message;