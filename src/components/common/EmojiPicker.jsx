import React, { useState } from 'react';

const EMOJI_CATEGORIES = {
  '😊': ['😊','😂','😎','🥳','😍','🤔','😴','🥺','😤','🤯','😅','🤩','😇','🥰','😘'],
  '👍': ['👍','👎','👏','🙌','🤝','✌️','🤞','👊','💪','🫶','🤙','👋','🫂','🙏','💅'],
  '❤️': ['❤️','🔥','🌟','💯','✨','⭐','💔','💖','💫','⚡','💥','🎯','💎','🏆','🌈'],
  '🎉': ['🎉','🎊','🎈','🎁','🎂','🥂','🍕','☕','🍔','🍦','🎮','🎵','🎸','🎤','🎬'],
  '🚀': ['🚀','✈️','🌍','☀️','🌙','⭐','❄️','💧','🌊','🔥','💨','🌿','🍀','🌸','🦋'],
};

export const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('😊');

  return (
    <div className="bg-[#141418] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
      {/* Category tabs */}
      <div className="flex items-center gap-0.5 px-2 pt-2">
        {Object.keys(EMOJI_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-2 rounded-xl text-base transition-all ${activeCategory === cat ? 'bg-violet-600/20' : 'hover:bg-white/[0.04]'}`}
          >
            {cat}
          </button>
        ))}
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-[#55556a] hover:text-white hover:bg-white/[0.05] ml-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      {/* Emojis grid */}
      <div className="grid grid-cols-8 gap-0.5 p-2">
        {EMOJI_CATEGORIES[activeCategory].map(emoji => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl hover:bg-white/[0.08] active:scale-90 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
