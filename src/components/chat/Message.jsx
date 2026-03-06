import React, { useState } from 'react';
import { ADMIN_UID } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import { deleteMessage, deletePrivateMessage } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';
import ConfirmationModal from '../common/ConfirmationModal';

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    }).toLowerCase();
};

const isMessageFromAdmin = (uid) => uid === ADMIN_UID;

export const Message = ({ 
    message, 
    isMyMessage, 
    usersCache, 
    currentUser, 
    selectedChatPartner, 
    chatId,
    showAvatar = true,        // ✅ Default to true
    isConsecutive = false      // ✅ Default to false
}) => { 
    const [showActions, setShowActions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const messageTime = formatTime(message.timestamp);
    
    const senderUid = message.senderUid || message.uid;
    const senderInfo = usersCache[senderUid];
    const senderDisplay = message.displayName || message.senderDisplayName || (senderInfo?.displayName || getDefaultName(senderUid)); 
    const isSenderAdmin = isMessageFromAdmin(senderUid);

    const handleDeleteMessage = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);
        
        try {
            if (selectedChatPartner) {
                await deletePrivateMessage(chatId, message.id);
            } else {
                await deleteMessage(message.id);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        } finally {
            setIsDeleting(false);
            setShowActions(false);
        }
    };

    return (
        <>
            <div 
                className={`
                    flex group px-4
                    ${isMyMessage ? 'justify-end' : 'justify-start'}
                    ${isConsecutive ? 'mt-0.5' : 'mt-3'}
                `}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* Avatar Column - WhatsApp style */}
                <div className="flex-shrink-0 w-9">
                    {!isMyMessage && showAvatar && (   // ✅ Only show avatar if showAvatar is true
                        <Avatar user={{ displayName: senderDisplay }} size="sm" />
                    )}
                </div>

                {/* Spacer for consecutive messages without avatar */}
                {!isMyMessage && !showAvatar && (
                    <div className="w-9 flex-shrink-0" /> // ✅ Add spacer to maintain alignment
                )}

                {/* Message Content */}
                <div className={`flex flex-col max-w-[65%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble - WhatsApp style */}
                    <div className="relative group">
                        {/* Message Bubble */}
                        <div className={`
                            relative px-3.5 py-2 rounded-2xl
                            ${isMyMessage 
                                ? 'bg-purple-500 text-white rounded-br-none' 
                                : isSenderAdmin
                                    ? 'bg-red-800/80 text-white rounded-bl-none'
                                    : 'bg-[#1A1A1A] text-white rounded-bl-none'
                            }
                            ${isConsecutive && isMyMessage ? 'rounded-tr-2xl' : ''}
                            ${isConsecutive && !isMyMessage ? 'rounded-tl-2xl' : ''}
                            transition-all
                        `}>
                            {/* Message Text */}
                            <p className="text-sm leading-relaxed break-words pr-10">
                                {message.message}
                            </p>

                            {/* Time & Actions - WhatsApp style inside bubble */}
                            <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                <span className="text-[10px] opacity-70">
                                    {messageTime}
                                </span>

                                {/* Delete button - Instagram style */}
                                {isMyMessage && showActions && !isDeleting && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}

                                {/* Loading Spinner */}
                                {isDeleting && (
                                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Message Tail - WhatsApp style (only for first message) */}
                        {!isConsecutive && (
                            <div className={`
                                absolute top-0 w-3 h-3
                                ${isMyMessage 
                                    ? 'right-0 -mr-2 border-l-8 border-l-transparent border-t-8 border-t-purple-500' 
                                    : 'left-0 -ml-2 border-r-8 border-r-transparent border-t-8 border-t-[#1A1A1A]'
                                }
                                ${isSenderAdmin && !isMyMessage ? 'border-t-red-800/80' : ''}
                            `} />
                        )}
                    </div>

                    {/* Sender Name - Only show for first message in group */}
                    {!isMyMessage && !isConsecutive && (
                        <div className="flex items-center gap-1 mt-1 ml-1">
                            <span className="text-xs font-medium text-gray-400">
                                {senderDisplay}
                            </span>
                            {isSenderAdmin && <AdminBadge size="sm" />}
                        </div>
                    )}
                </div>

                {/* Avatar for own messages - only for first in group */}
                {isMyMessage && showAvatar && (   // ✅ Only show avatar for first own message
                    <div className="flex-shrink-0 ml-2">
                        <Avatar user={{ displayName: senderDisplay }} size="sm" />
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteMessage}
                title="Delete Message"
                message="Are you sure you want to delete this message?"
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default Message;