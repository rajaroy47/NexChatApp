import React from 'react';

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-[#0e0e12] border border-white/[0.08] rounded-3xl shadow-2xl w-full max-w-sm animate-pop-in overflow-hidden">
        <div className={`h-0.5 w-full ${type === 'danger' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-violet-500 to-pink-500'}`}/>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${type === 'danger' ? 'bg-red-500/15' : 'bg-violet-500/15'}`}>
              {type === 'danger'
                ? <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                : <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              }
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-sm text-[#9999b0] mt-1 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-semibold text-[#9999b0] hover:text-white hover:bg-white/[0.08] transition-all">
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] ${type === 'danger' ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-900/30' : 'btn-gradient shadow-lg shadow-violet-900/30'}`}
            >
              {confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
