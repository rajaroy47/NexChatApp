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
        hour: '2-digit', minute: '2-digit', hour12: true,
    }).replace(' ', '\u202f');
};

const isAdmin = (uid) => uid === ADMIN_UID;

// Stable colour per display name
const getAvatarColor = (name = '') => {
    const palette = [
        ['#7C3AED', '#A78BFA'],
        ['#2563EB', '#60A5FA'],
        ['#059669', '#34D399'],
        ['#D97706', '#FCD34D'],
        ['#DB2777', '#F9A8D4'],
        ['#DC2626', '#FCA5A5'],
        ['#7C3AED', '#C4B5FD'],
        ['#0891B2', '#67E8F9'],
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
};

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

    // Long-press on mobile
    const onTouchStart = () => {
        if (!isMyMessage) return;
        longPressTimer.current = setTimeout(() => setShowMenu(true), 420);
    };
    const onTouchEnd = () => clearTimeout(longPressTimer.current);

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

    // ── Bubble styles ──────────────────────────────────────────────────────────
    const myBase = 'bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-md shadow-violet-900/30';
    const otherBase = fromAdmin
        ? 'bg-gradient-to-br from-red-900/90 to-red-800/80 text-white border border-red-700/30'
        : 'bg-[#1c1c1e] text-gray-100 border border-white/[0.05]';

    // Corner pointing toward avatar for first-in-group
    const myRadius    = isConsecutive ? 'rounded-[20px]' : 'rounded-[20px] rounded-br-[6px]';
    const otherRadius = isConsecutive ? 'rounded-[20px]' : 'rounded-[20px] rounded-bl-[6px]';

    return (
        <>
            <div
                className={`
                    flex items-end gap-2 px-3
                    ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}
                    ${isConsecutive ? 'mt-[2px]' : 'mt-3'}
                `}
                style={{ animation: 'msgIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}
            >
                {/* Avatar column – always reserves 28px width so bubbles align */}
                <div className="w-7 flex-shrink-0 flex items-end justify-center">
                    {!isMyMessage && showAvatar && <MsgAvatar displayName={senderName} />}
                </div>

                {/* Content column */}
                <div className={`flex flex-col max-w-[72%] sm:max-w-[65%] md:max-w-[55%] ${isMyMessage ? 'items-end' : 'items-start'}`}>

                    {/* Sender name for non-consecutive other messages */}
                    {!isMyMessage && !isConsecutive && (
                        <div className="flex items-center gap-1.5 mb-[3px] ml-1">
                            <span className="text-[12px] font-semibold text-gray-400 leading-none">{senderName}</span>
                            {fromAdmin && <AdminBadge />}
                        </div>
                    )}

                    {/* Bubble */}
                    <div
                        className={`
                            relative group
                            ${isMyMessage ? `${myBase} ${myRadius}` : `${otherBase} ${otherRadius}`}
                            ${isDeleting ? 'opacity-40' : 'opacity-100'}
                            transition-opacity duration-200 select-none cursor-default
                        `}
                        onMouseEnter={() => isMyMessage && setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onTouchMove={onTouchEnd}
                    >
                        {/* Text – right padding reserves space for timestamp */}
                        <p className="text-[15px] leading-[1.45] break-words whitespace-pre-wrap px-3.5 pt-[9px] pb-[24px] pr-[52px]">
                            {message.message}
                        </p>

                        {/* Timestamp + double tick pinned inside bubble */}
                        <div className="absolute bottom-[7px] right-[10px] flex items-center gap-[3px] pointer-events-none">
                            <span className={`text-[11px] leading-none whitespace-nowrap ${isMyMessage ? 'text-white/55' : 'text-gray-500'}`}>
                                {time}
                            </span>
                            {isMyMessage && (
                                <svg className="w-[14px] h-[14px] text-white/65 flex-shrink-0" viewBox="0 0 16 11" fill="none">
                                    <path d="M1 6l4 4L15 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
                                </svg>
                            )}
                        </div>

                        {/* Delete button – hover (desktop) / long-press (mobile) */}
                        {isMyMessage && showMenu && !isDeleting && (
                            <button
                                ref={menuRef}
                                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                                className="
                                    absolute -top-3 -left-8
                                    w-7 h-7 rounded-full
                                    bg-[#1c1c1e] border border-white/10
                                    flex items-center justify-center
                                    text-gray-400 hover:text-red-400 hover:border-red-500/30
                                    shadow-lg transition-all duration-150
                                "
                                style={{ animation: 'popIn 0.15s cubic-bezier(0.34,1.56,0.64,1) both' }}
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
                            <div className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/20">
                                <svg className="w-4 h-4 animate-spin text-white/60" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation modal */}
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

            <style>{`
                @keyframes msgIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.6); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
};

export default Message;