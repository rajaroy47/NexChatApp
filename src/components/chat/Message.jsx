import React, { useState, useRef } from 'react';
import { ADMIN_UID } from '../../firebase/config';
import { getDefaultName, deleteMessage, deletePrivateMessage } from '../../firebase/db';
import { PALETTE, hashName } from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';
import ConfirmationModal from '../common/ConfirmationModal';

const fmtTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const MiniAvatar = ({ name }) => {
  const [from, to] = PALETTE[hashName(name) % PALETTE.length];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 self-end mb-0.5"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
};

export const Message = ({
  message, isMyMessage, usersCache,
  currentUser, selectedChatPartner, chatId,
  showAvatar = true, isConsecutive = false,
}) => {
  const [hover, setHover] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const lpTimer = useRef(null);

  const uid = message.senderUid || message.uid;
  const info = usersCache?.[uid];
  const name = message.displayName || message.senderDisplayName || info?.displayName || getDefaultName(uid);
  const fromAdmin = uid === ADMIN_UID;
  const time = fmtTime(message.timestamp);

  const doDelete = async () => {
    setConfirmDel(false);
    setDeleting(true);
    try {
      if (selectedChatPartner) await deletePrivateMessage(chatId, message.id);
      else await deleteMessage(message.id);
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  // Long press mobile
  const onTS = () => { if (!isMyMessage) return; lpTimer.current = setTimeout(() => setConfirmDel(true), 500); };
  const onTE = () => clearTimeout(lpTimer.current);

  /* ─── Bubble styles ─── */
  const base = 'relative px-3.5 pt-[9px] pb-[22px] pr-[52px] max-w-full break-words text-[14.5px] leading-[1.45] transition-opacity';
  const myStyle   = `${base} bg-gradient-to-br from-violet-600 to-violet-700 text-white ${isConsecutive ? 'rounded-[18px]' : 'rounded-[18px] rounded-br-[5px]'}`;
  const admStyle  = `${base} bg-gradient-to-br from-red-900 to-red-800 text-white border border-red-700/30 ${isConsecutive ? 'rounded-[18px]' : 'rounded-[18px] rounded-bl-[5px]'}`;
  const othStyle  = `${base} bg-[#1e1e1e] text-gray-100 border border-white/[0.05] ${isConsecutive ? 'rounded-[18px]' : 'rounded-[18px] rounded-bl-[5px]'}`;
  const bubbleCls = isMyMessage ? myStyle : fromAdmin ? admStyle : othStyle;

  return (
    <>
      <div
        className={`flex items-end gap-1.5 px-2 sm:px-4 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? 'mt-[2px]' : 'mt-3'}`}
      >
        {/* Avatar (other side only) */}
        <div className="w-7 flex-shrink-0">
          {!isMyMessage && showAvatar && <MiniAvatar name={name} />}
        </div>

        {/* Bubble column */}
        <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%] md:max-w-[55%]`}>
          {/* Sender label */}
          {!isMyMessage && !isConsecutive && (
            <div className="flex items-center gap-1 mb-[3px] ml-1">
              <span className="text-[11px] font-semibold text-gray-400">{name}</span>
              {fromAdmin && <AdminBadge size="sm" />}
            </div>
          )}

          {/* Bubble */}
          <div
            className={`${bubbleCls} ${deleting ? 'opacity-40' : ''}`}
            onMouseEnter={() => isMyMessage && setHover(true)}
            onMouseLeave={() => setHover(false)}
            onTouchStart={onTS} onTouchEnd={onTE} onTouchMove={onTE}
          >
            {message.message}

            {/* Time + tick */}
            <div className="absolute bottom-[6px] right-[9px] flex items-center gap-1 pointer-events-none">
              <span className="text-[10px] leading-none opacity-60 whitespace-nowrap">{time}</span>
              {isMyMessage && (
                <svg className="w-3.5 h-3.5 opacity-70" viewBox="0 0 18 12" fill="none">
                  <path d="M1 7l4 4L17 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 7l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
                </svg>
              )}
            </div>

            {/* Hover delete (desktop) */}
            {isMyMessage && hover && !deleting && (
              <button
                onClick={e => { e.stopPropagation(); setConfirmDel(true); }}
                className="absolute -top-2.5 -left-7 w-6 h-6 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-500/30 transition-all shadow-lg nc-pop"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            {/* Deleting spinner */}
            {deleting && (
              <div className="absolute inset-0 rounded-[inherit] flex items-center justify-center bg-black/20">
                <svg className="w-4 h-4 animate-spin text-white/70" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmDel}
        onClose={() => setConfirmDel(false)}
        onConfirm={doDelete}
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