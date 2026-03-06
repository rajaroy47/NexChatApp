import React, { useEffect } from 'react';

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
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '⚠️',
                    gradient: 'from-red-600 to-red-500',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    text: 'text-red-400',
                    button: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                };
            case 'info':
                return {
                    icon: 'ℹ️',
                    gradient: 'from-blue-600 to-blue-500',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                    text: 'text-blue-400',
                    button: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                };
            default:
                return {
                    icon: '⚠️',
                    gradient: 'from-yellow-600 to-yellow-500',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    text: 'text-yellow-400',
                    button: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className={`
                relative bg-[#0C0C0C] border ${styles.border} rounded-2xl shadow-2xl 
                w-full max-w-md transform transition-all duration-300
                animate-slide-in-up
            `}>
                {/* Gradient Header */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${styles.gradient} rounded-t-2xl`} />
                
                <div className="p-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`
                            w-12 h-12 rounded-xl ${styles.bg} border ${styles.border}
                            flex items-center justify-center text-2xl
                        `}>
                            {styles.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {title}
                            </h3>
                            <p className={`text-sm ${styles.text} mt-0.5`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)} Action
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 
                                     bg-white/5 hover:bg-white/10 border border-white/10
                                     transition-all duration-300 hover:scale-105"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`
                                px-4 py-2.5 rounded-xl text-sm font-bold text-white
                                ${styles.button} transition-all duration-300
                                hover:scale-105 hover:shadow-lg hover:shadow-${type}-500/25
                                active:scale-95
                            `}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                             rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                             transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;