import React, { useState, useRef } from 'react';
import { ADMIN_UID } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import { deleteMessage, deletePrivateMessage } from '../../firebase/db';
import ConfirmationModal from '../common/ConfirmationModal';

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '\u202f');
};

const isAdmin = (uid) => uid === ADMIN_UID;

const getAvatarColor = (name = '') => {
  const palette = [
    ['#7C3AED','#A78BFA'],['#2563EB','#60A5FA'],['#059669','#34D399'],
    ['#D97706','#FCD34D'],['#DB2777','#F9A8D4'],['#DC2626','#FCA5A5'],
    ['#7C3AED','#C4B5FD'],['#0891B2','#67E8F9'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const MsgAvatar = ({ displayName }) => {
  const [from, to] = getAvatarColor(displayName);
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 select-none"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {(displayName || '?').charAt(0).toUpperCase()}
    </div>
  );
};

const AdminBadge = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-[9px] font-bold text-red-400 uppercase tracking-wide">
    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.514 1.306L7.333 10h5.334l-2.424 5.664A1 1 0 019.072 16H4a1 1 0 01-.832-1.555L6.06 10H3a1 1 0 01-.832-1.555L9.243 3.03z" clipRule="evenodd"/></svg>
    Admin
  </span>
);

export const Message = ({
  message, isMyMessage, usersCache, currentUser, selectedChatPartner, chatId, showAvatar = true, isConsecutive = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const longPressTimer = useRef(null);

  const senderUid = message.senderUid || message.uid;
  const senderInfo = usersCache?.[senderUid];
  const senderName = message.displayName || message.senderDisplayName || senderInfo?.displayName || getDefaultName(senderUid);
  const fromAdmin = isAdmin(senderUid);
  const time = formatTime(message.timestamp);

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
    } catch (e) { console.error('Delete failed', e); }
    finally { setIsDeleting(false); setShowMenu(false); }
  };

  return (
    <>
      <div className={`flex items-end gap-2 px-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? 'mt-[3px]' : 'mt-3'}`}>
        {/* Avatar */}
        <div className="w-7 flex-shrink-0 flex items-end">
          {!isMyMessage && showAvatar && <MsgAvatar displayName={senderName}/>}
        </div>

        {/* Bubble column */}
        <div className={`flex flex-col max-w-[72%] md:max-w-[55%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
          {/* Sender name */}
          {!isMyMessage && !isConsecutive && (
            <div className="flex items-center gap-1.5 mb-[3px] ml-1">
              <span className="text-[12px] font-semibold text-[#9999b0] leading-none">{senderName}</span>
              {fromAdmin && <AdminBadge/>}
            </div>
          )}

          {/* Bubble */}
          <div
            className={`
              relative group
              ${isMyMessage
                ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-[18px] rounded-br-[4px]'
                : fromAdmin
                  ? 'bg-gradient-to-br from-red-900/80 to-red-800/70 text-white rounded-[18px] rounded-bl-[4px] border border-red-700/25'
                  : 'bg-[#1a1a20] text-gray-100 rounded-[18px] rounded-bl-[4px] border border-white/[0.05]'
              }
              ${isConsecutive ? (isMyMessage ? 'rounded-[18px]' : 'rounded-[18px]') : ''}
              ${isDeleting ? 'opacity-40' : ''}
              transition-opacity duration-200 select-none
            `}
            onMouseEnter={() => isMyMessage && setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchEnd}
          >
            <p className="text-[15px] leading-[1.45] break-words whitespace-pre-wrap px-3.5 pt-[9px] pb-[24px] pr-[54px]">
              {message.message}
            </p>

            {/* Time + tick */}
            <div className="absolute bottom-[7px] right-[10px] flex items-center gap-1 pointer-events-none">
              <span className="text-[11px] leading-none whitespace-nowrap opacity-60">{time}</span>
              {isMyMessage && (
                <svg className="w-[14px] h-[14px] opacity-70 flex-shrink-0" viewBox="0 0 16 11" fill="none">
                  <path d="M1 6l4 4L15 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                </svg>
              )}
            </div>

            {/* Delete button */}
            {isMyMessage && showMenu && !isDeleting && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                className={`
                  absolute -top-3 ${isMyMessage ? '-left-8' : '-right-8'}
                  w-7 h-7 rounded-full bg-[#1a1a20] border border-white/10
                  flex items-center justify-center
                  text-[#9999b0] hover:text-red-400 hover:border-red-500/30
                  shadow-lg transition-all duration-150 animate-pop-in
                `}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            )}

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
