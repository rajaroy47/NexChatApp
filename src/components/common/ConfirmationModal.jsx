import React from 'react';

export const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) => {
    if (!isOpen) return null;

    const getButtonColor = () => {
        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700';
            default:
                return 'bg-purple-600 hover:bg-purple-700';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-chat-panel border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 rounded-xl text-sm font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-150"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`py-2 px-4 rounded-xl text-sm font-bold text-white transition duration-150 ${getButtonColor()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;