import React from 'react';

export const AdminBadge = ({ size = 'md' }) => {
  const cls = size === 'sm'
    ? 'text-[9px] px-1.5 py-px gap-0.5'
    : 'text-[10px] px-2 py-0.5 gap-1';

  return (
    <span className={`inline-flex items-center ${cls} font-bold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-full leading-none flex-shrink-0`}>
      <svg className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
      ADMIN
    </span>
  );
};

export default AdminBadge;