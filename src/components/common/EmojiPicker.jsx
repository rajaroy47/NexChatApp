import React from 'react';

const EMOJIS = [
    '👍', '👋', '😊', '😂', '🔥', '❤️', '🌟', '🚀', '🥳', '🤔',
    '🎉', '💯', '🙏', '🤯', '😎', '🥶', '🍕', '☕', '💻', '💡',
    '✅', '❌', '⬇️', '⬆️', '👈', '👉', '👇', '👆', '👏', '💔'
];

export const EmojiPicker = ({ onEmojiSelect, onClose }) => {
    return (
        <div className="absolute bottom-16 right-4 md:right-0 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 z-50 transform origin-bottom-right animate-in fade-in zoom-in-50">
            <div className="grid grid-cols-7 gap-2 max-w-xs">
                {EMOJIS.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => onEmojiSelect(emoji)}
                        className="text-2xl hover:bg-gray-800 p-1 rounded transition-colors"
                        aria-label={`Select emoji ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <button
                onClick={onClose}
                className="absolute top-1 right-1 text-gray-500 hover:text-white text-lg p-1"
                aria-label="Close emoji picker"
            >
                &times;
            </button>
        </div>
    );
};

export default EmojiPicker;