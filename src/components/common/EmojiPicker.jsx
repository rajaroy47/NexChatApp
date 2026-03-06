import React, { useState, useRef, useEffect } from 'react';

const CATS = {
  '🙂': ['😊','😂','😎','🥳','😍','🤔','😴','🥺','😤','🤯','😭','😅','🤣','😇','🥰','😏','😬','🤗','😶','🙄'],
  '👋': ['👍','👎','👏','🙌','🤝','✌️','🤞','👊','💪','🫶','🤜','👋','🤙','🖐️','👌','🤏','🤘','🫵','🫱','🫲'],
  '❤️': ['❤️','🔥','🌟','💯','✨','⭐','💔','💖','💫','⚡','💝','🌈','💎','🏆','🎯','💡','🔑','🌺','🍀','🦋'],
  '🎉': ['🎉','🎊','🎈','🎁','🎂','🥂','🍕','☕','🍔','🍦','🍩','🍣','🍜','🥗','🍿','🧁','🥤','🍓','🍇','🍑'],
  '🚀': ['🚀','✈️','🌍','☀️','🌙','🌊','🏔️','🌸','🦁','🐬','🦋','🌻','⛰️','🏖️','🌌','🎆','🌅','🌠','🌋','❄️'],
  '🎮': ['🎮','🎵','📚','💻','📱','🎨','🔧','💡','📷','🎬','🏆','⚽','🏀','🎸','🎺','🎭','📡','🔭','🎲','♟️'],
};

const CAT_LABELS = { '🙂':'Smileys','👋':'Gestures','❤️':'Symbols','🎉':'Food & Fun','🚀':'Nature','🎮':'Objects' };

export const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [cat, setCat] = useState('🙂');
  const [q, setQ] = useState('');
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  const all = Object.values(CATS).flat();
  const emojis = q.trim()
    ? all.filter(e => e.includes(q))
    : CATS[cat];

  return (
    <div
      ref={ref}
      className="w-[280px] sm:w-72 bg-[#141414] border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/[0.06]">
        <span className="text-[13px] font-semibold text-gray-300">Emoji</span>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search…"
            style={{ fontSize: '16px' }}
            className="w-full bg-white/5 border border-white/[0.07] rounded-xl pl-8 pr-3 py-1.5 text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Category tabs */}
      {!q && (
        <div className="flex gap-0.5 px-3 pb-1">
          {Object.keys(CATS).map(k => (
            <button
              key={k}
              onClick={() => setCat(k)}
              title={CAT_LABELS[k]}
              className={`flex-1 py-1.5 rounded-lg text-base transition-all ${cat === k ? 'bg-violet-500/20 scale-110' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
            >
              {k}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-8 gap-0.5 px-2 pb-2 max-h-48 overflow-y-auto nc-scroll">
        {emojis.map(e => (
          <button
            key={e}
            onClick={() => { onEmojiSelect(e); onClose(); }}
            className="aspect-square flex items-center justify-center text-lg hover:bg-white/5 rounded-lg transition-all hover:scale-125 active:scale-95"
          >
            {e}
          </button>
        ))}
        {emojis.length === 0 && (
          <div className="col-span-8 py-6 text-center text-[12px] text-gray-600">No results</div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;