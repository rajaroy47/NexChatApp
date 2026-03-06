import React, { useState, useEffect, useRef } from 'react';

const EMOJI_CATEGORIES = {
    '😊': ['😊', '😂', '😎', '🥳', '😍', '🤔', '😴', '🥺', '😤', '🤯'],
    '👍': ['👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '👊', '💪', '🫶'],
    '❤️': ['❤️', '🔥', '🌟', '💯', '✨', '⭐', '💔', '💖', '💫', '⚡'],
    '🎉': ['🎉', '🎊', '🎈', '🎁', '🎂', '🥂', '🍕', '☕', '🍔', '🍦'],
    '🚀': ['🚀', '✈️', '🌍', '⭐', '☀️', '🌈', '🌙', '⚡', '💧', '🔥'],
    '⚽': ['⚽', '🏀', '🎮', '🎵', '📚', '💻', '📱', '🎨', '🔧', '💡'],
};

const CATEGORY_ICONS = {
    '😊': '😊',
    '👍': '👍',
    '❤️': '❤️',
    '🎉': '🎉',
    '🚀': '🚀',
    '⚽': '⚽',
};

export const EmojiPicker = ({ onEmojiSelect, onClose }) => {
    const [activeCategory, setActiveCategory] = useState('😊');
    const [searchTerm, setSearchTerm] = useState('');
    const pickerRef = useRef(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Get all emojis for search
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    
    // Filter emojis based on search
    const filteredEmojis = searchTerm
        ? allEmojis.filter(emoji => 
            emoji.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : EMOJI_CATEGORIES[activeCategory];

    return (
        <div 
            ref={pickerRef}
            className="w-72 bg-[#0C0C0C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up"
        >
            {/* Header */}
            <div className="p-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">Emoji Picker</h4>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search emojis..."
                        className="w-full px-3 py-2 pl-8 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                    />
                    <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Categories (hide when searching) */}
            {!searchTerm && (
                <div className="flex gap-1 p-2 border-b border-white/5">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`
                                flex-1 p-2 rounded-lg text-lg transition-all
                                ${activeCategory === category 
                                    ? 'bg-purple-500/20 text-purple-400 scale-105' 
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                }
                            `}
                        >
                            {CATEGORY_ICONS[category]}
                        </button>
                    ))}
                </div>
            )}

            {/* Emoji Grid */}
            <div className="p-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-6 gap-1">
                    {filteredEmojis.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => {
                                onEmojiSelect(emoji);
                                onClose();
                            }}
                            className="aspect-square flex items-center justify-center text-xl hover:bg-white/5 rounded-lg transition-all hover:scale-125 hover:text-purple-400"
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* No results */}
                {filteredEmojis.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No emojis found</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/5 bg-white/5">
                <p className="text-[10px] text-gray-500 text-center">
                    Click emoji to insert • {filteredEmojis.length} emojis
                </p>
            </div>
        </div>
    );
};

export default EmojiPicker;