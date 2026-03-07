import React from 'react';

export const AdminBadge = ({ size = 'md' }) => (
  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-[9px] font-bold text-red-400 uppercase tracking-wide">
    <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.514 1.306L7.333 10h5.334l-2.424 5.664A1 1 0 019.072 16H4a1 1 0 01-.832-1.555L6.06 10H3a1 1 0 01-.832-1.555L9.243 3.03z" clipRule="evenodd"/>
    </svg>
    Admin
  </span>
);

export default AdminBadge;
