import React, { useState, useRef, useEffect } from 'react';

const EMOJI_CATEGORIES = {
  'Smileys': ['😊','😂','🤣','😍','🥰','😘','😎','🤔','😴','🥺','😤','🤯','😅','😇','🤩','🥳','😬','🙄','😯','😳','🤗','🫠','😶','🫡','🤭'],
  'Hands':   ['👍','👎','👏','🙌','🤝','✌️','🤞','👊','💪','🫶','🙏','🤙','👋','✋','👌','🤌','🫵','🖖','👈','👉','👆','👇','☝️','🤏','🫳'],
  'Hearts':  ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','💖','💗','💓','💞','💝','💘','💟','✨','💫','⭐','🌟','🔥','💯','🎯','⚡'],
  'Party':   ['🎉','🎊','🎈','🎁','🎂','🥂','🍕','☕','🍔','🍦','🍰','🥳','🎵','🎶','🎤','🪅','🎆','🎇','🧁','🍾','🥐','🍜','🍣','🧃','🍺'],
  'Nature':  ['🚀','✈️','🌍','☀️','🌈','🌙','💧','🌸','🌺','🌻','🌿','🍃','🌊','🌄','🦋','🐶','🐱','🦁','🐼','🦊','🐸','🌵','🦄','🌙','🌏'],
  'Objects': ['⚽','🏀','🎮','📚','💻','📱','🎨','🔧','💡','🔑','🏆','🎯','🎲','♟️','🎭','🎬','📷','🔭','⌚','💎','🧲','🪄','🧩','🚗','🏠'],
};

const CATEGORY_ICONS = {
  'Smileys': '😊',
  'Hands':   '👍',
  'Hearts':  '❤️',
  'Party':   '🎉',
  'Nature':  '🌍',
  'Objects': '🎮',
};

export const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 50);
  }, []);

  const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
  const displayed = search.trim()
    ? allEmojis.filter(e => e.includes(search))
    : EMOJI_CATEGORIES[activeCategory];

  // KEY FIX: Do NOT call onClose after selecting emoji
  const handleEmojiClick = (e, emoji) => {
    e.stopPropagation();
    onEmojiSelect(emoji);
    // Intentionally NOT calling onClose — picker stays open
  };

  return (
    <div
      className="w-80 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
      onMouseDown={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-gray-300">Emoji</span>
        <button
          onClick={onClose}
          onMouseDown={e => e.stopPropagation()}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search emoji…"
            style={{ fontSize: '16px' }}
            onMouseDown={e => e.stopPropagation()}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/[0.07] text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex gap-0.5 px-2 pb-2 border-b border-white/[0.06]">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <button
              key={cat}
              onClick={e => { e.stopPropagation(); setActiveCategory(cat); }}
              onMouseDown={e => e.stopPropagation()}
              title={cat}
              className={`flex-1 py-1.5 rounded-lg text-base transition-all ${
                activeCategory === cat
                  ? 'bg-violet-500/20 scale-105'
                  : 'hover:bg-white/5 opacity-50 hover:opacity-100'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="p-2 overflow-y-auto nexchat-scrollbar" style={{ height: '200px' }}>
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <span className="text-2xl mb-1">🔍</span>
            <p className="text-[12px]">No results</p>
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-0.5">
            {displayed.map((emoji, i) => (
              <button
                key={`${emoji}-${i}`}
                onClick={e => handleEmojiClick(e, emoji)}
                onMouseDown={e => e.stopPropagation()}
                className="aspect-square flex items-center justify-center text-lg rounded-lg hover:bg-white/10 hover:scale-110 transition-all active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-white/[0.05]">
        <p className="text-[10px] text-gray-600 text-center">Click to insert · picker stays open</p>
      </div>
    </div>
  );
};

export default EmojiPicker;