import React, { useMemo } from 'react';

const PALETTE = [
  ['#7C3AED','#A78BFA'], // violet
  ['#2563EB','#60A5FA'], // blue
  ['#059669','#34D399'], // emerald
  ['#D97706','#FCD34D'], // amber
  ['#DB2777','#F9A8D4'], // pink
  ['#DC2626','#FCA5A5'], // red
  ['#0891B2','#67E8F9'], // cyan
  ['#7C2D12','#FDBA74'], // orange
];

function hashName(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

const SIZE = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[12px]',
  md: 'w-10 h-10 text-[14px]',
  lg: 'w-12 h-12 text-[16px]',
  xl: 'w-16 h-16 text-[22px]',
};

export const Avatar = ({ user, size = 'sm', showRing = false, online }) => {
  const name = user?.displayName || user?.email || '?';
  const [from, to] = useMemo(() => PALETTE[hashName(name) % PALETTE.length], [name]);
  const initials = useMemo(() => {
    const parts = name.trim().split(/[\s._@-]+/);
    if (parts.length >= 2 && parts[1]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${SIZE[size] || SIZE.sm} rounded-full flex items-center justify-center font-bold text-white select-none ${showRing ? 'ring-2 ring-white/10' : ''}`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        aria-label={name}
      >
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[#0d0d0d] ${size === 'lg' || size === 'xl' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} ${online ? 'bg-emerald-500' : 'bg-gray-600'}`} />
      )}
    </div>
  );
};

export default Avatar;
// Named export for convenience in chat components
export { hashName, PALETTE };