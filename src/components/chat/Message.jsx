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

    if (diff < 60) return diff + "s ago";
    const m = Math.floor(diff / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
};

const isMessageFromAdmin = (uid) => uid === ADMIN_UID;

export const Message = ({ message, isMyMessage, usersCache, currentUser, selectedChatPartner, chatId }) => { 
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const displayTime = timeAgo(message.timestamp);
    
    const senderUid = message.senderUid || message.uid;
    const senderInfo = usersCache[senderUid];
    
    const senderDisplay = message.displayName || message.senderDisplayName || (senderInfo ? senderInfo.displayName : getDefaultName(senderUid)); 
    
    const isSenderAdmin = isMessageFromAdmin(senderUid); 
    const showAdminBadgeAndStyle = isSenderAdmin;

    const handleDeleteMessage = async () => {
        setShowDeleteModal(false);
        setIsDeleting(true);
        
        try {
            if (selectedChatPartner) {
                // Delete private message
                await deletePrivateMessage(chatId, message.id);
            } else {
                // Delete global message
                await deleteMessage(message.id);
            }
            // Message will be removed from the list automatically via real-time listener
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowOptions(false);
        }
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        if (isMyMessage && !isDeleting) {
            setShowDeleteModal(true);
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    return (
        <>
            <div 
                className={`flex mb-4 items-end transition-opacity duration-300 ${isMyMessage ? 'justify-end' : 'justify-start'} relative`}
                onContextMenu={handleRightClick}
            >
                {!isMyMessage && <Avatar user={{displayName: senderDisplay}} />}
                
                <div className={`flex flex-col max-w-[75%] mx-2 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    <span className={`text-xs font-semibold ${isMyMessage ? 'text-gray-400 mr-2' : 'text-gray-300 ml-2'} mb-1`}>
                        {isMyMessage ? 'You' : senderDisplay}
                        {showAdminBadgeAndStyle && <AdminBadge />}
                        &middot; {displayTime}
                    </span>
                    
                    {/* Message bubble with hover area */}
                    <div 
                        className={`p-3 rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out relative
                            ${isMyMessage 
                                ? 'bg-purple-600 text-white rounded-br-md active:scale-[0.98]' 
                                : showAdminBadgeAndStyle
                                    ? 'bg-red-800 text-white rounded-tl-md active:scale-[0.98] border border-red-700'
                                    : 'bg-gray-700 text-gray-100 rounded-tl-md active:scale-[0.98] border border-gray-600'
                            } ${isDeleting ? 'opacity-50' : ''}`}
                        onMouseEnter={() => setShowOptions(true)}
                        onMouseLeave={() => setShowOptions(false)}
                    >
                        {message.message}
                        
                        {/* Delete button - only show for own messages when hovering the bubble */}
                        {isMyMessage && showOptions && !isDeleting && (
                            <button
                                onClick={openDeleteModal}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg transition-all duration-200 transform scale-100 hover:scale-110 z-10"
                                title="Delete message"
                            >
                                ×
                            </button>
                        )}

                        {/* Loading indicator */}
                        {isDeleting && (
                            <div className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {isMyMessage && <Avatar user={{displayName: senderDisplay}} />}
            </div>

            {/* Custom Confirmation Modal */}
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