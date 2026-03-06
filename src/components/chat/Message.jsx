import React, { useState } from 'react';
import { ADMIN_UID } from '../../firebase/config';
import { getDefaultName } from '../../firebase/db';
import { deleteMessage, deletePrivateMessage } from '../../firebase/db';
import Avatar from '../common/Avatar';
import AdminBadge from '../common/AdminBadge';
import ConfirmationModal from '../common/ConfirmationModal';

const timeAgo = (timestamp) => {
    if (!timestamp || typeof timestamp !== 'number') return '';
    
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diff < 60) return rtf.format(-diff, 'second');
    const m = Math.floor(diff / 60);
    if (m < 60) return rtf.format(-m, 'minute');
    const h = Math.floor(m / 60);
    if (h < 24) return rtf.format(-h, 'hour');
    const d = Math.floor(h / 24);
    if (d < 7) return rtf.format(-d, 'day');
    const w = Math.floor(d / 7);
    if (w < 4) return rtf.format(-w, 'week');
    return new Date(timestamp).toLocaleDateString();
};

const isMessageFromAdmin = (uid) => uid === ADMIN_UID;

export const Message = ({ message, isMyMessage, usersCache, currentUser, selectedChatPartner, chatId }) => { 
    const [showActions, setShowActions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const displayTime = timeAgo(message.timestamp);
    
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
                className={`flex mb-3 group ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                {/* Avatar for other users */}
                {!isMyMessage && (
                    <div className="flex-shrink-0 mr-2">
                        <Avatar user={{ displayName: senderDisplay }} size="sm" />
                    </div>
                )}
                
                <div className={`flex flex-col max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {/* Message Header */}
                    <div className={`flex items-center gap-2 mb-1 px-1 ${isMyMessage ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-medium text-gray-400">
                            {isMyMessage ? 'You' : senderDisplay}
                        </span>
                        
                        {isSenderAdmin && <AdminBadge size="sm" />}
                        
                        <span className="text-[10px] text-gray-500">
                            {displayTime}
                        </span>

                        {/* Delete button for own messages */}
                        {isMyMessage && showActions && !isDeleting && (
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete message"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}

                        {/* Loading Spinner */}
                        {isDeleting && (
                            <svg className="w-3.5 h-3.5 text-gray-500 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`
                        relative p-3 rounded-2xl transition-all duration-300
                        ${isMyMessage 
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-tr-none' 
                            : isSenderAdmin
                                ? 'bg-gradient-to-r from-red-900/80 to-red-800/80 text-white rounded-tl-none border border-red-700/30'
                                : 'bg-[#1A1A1A] text-gray-100 rounded-tl-none border border-white/5'
                        }
                        ${isMyMessage && showActions ? 'scale-[1.02]' : ''}
                        hover:shadow-lg
                    `}>
                        <p className="text-sm leading-relaxed break-words">
                            {message.message}
                        </p>

                        {/* Message Tail */}
                        <div className={`
                            absolute top-0 w-3 h-3
                            ${isMyMessage 
                                ? 'right-0 -mr-2 border-l-8 border-l-transparent border-t-8 border-t-purple-600' 
                                : 'left-0 -ml-2 border-r-8 border-r-transparent border-t-8 border-t-[#1A1A1A]'
                            }
                            ${isSenderAdmin && !isMyMessage ? 'border-t-red-900/80' : ''}
                        `} />
                    </div>
                </div>

                {/* Avatar for own messages */}
                {isMyMessage && (
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
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default Message;