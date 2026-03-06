import React, { useEffect, useRef } from 'react';

const TYPE_MAP = {
  danger:  { bar: 'from-red-500 to-rose-600',    btn: 'bg-red-600 hover:bg-red-500',    icon: 'text-red-400',  ring: 'ring-red-500/20'  },
  warning: { bar: 'from-amber-500 to-orange-500', btn: 'bg-amber-600 hover:bg-amber-500', icon: 'text-amber-400', ring: 'ring-amber-500/20' },
  info:    { bar: 'from-blue-500 to-violet-500',  btn: 'bg-blue-600 hover:bg-blue-500',   icon: 'text-blue-400', ring: 'ring-blue-500/20'  },
};

const ICONS = {
  danger: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export const ConfirmationModal = ({
  isOpen, onClose, onConfirm,
  title = 'Confirm', message = 'Are you sure?',
  confirmText = 'Confirm', cancelText = 'Cancel',
  type = 'warning',
}) => {
  const cancelRef = useRef(null);
  const styles = TYPE_MAP[type] || TYPE_MAP.warning;

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-nc-pop">
        {/* Top accent bar */}
        <div className={`h-[3px] bg-gradient-to-r ${styles.bar}`} />

        <div className="p-5">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${styles.icon} flex-shrink-0`}>
              {ICONS[type] || ICONS.warning}
            </div>
            <h3 className="text-[15px] font-semibold text-white leading-tight">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-[13px] text-gray-400 leading-relaxed mb-5 pl-[48px]">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              ref={cancelRef}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] font-medium text-gray-300 bg-white/5 hover:bg-white/10 border border-white/[0.07] transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold text-white ${styles.btn} transition-all active:scale-95 ring-2 ring-transparent hover:${styles.ring}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;