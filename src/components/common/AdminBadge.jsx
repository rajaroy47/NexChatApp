import React from 'react';

export const AdminBadge = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2 py-0.5',
        lg: 'text-sm px-2.5 py-1'
    };

    return (
        <span className={`
            inline-flex items-center gap-1 ml-1.5 font-bold text-white 
            bg-gradient-to-r from-red-600 to-red-500 
            rounded-full shadow-lg ${sizeClasses[size]}
            relative overflow-hidden group
        `}>
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Crown icon for admin */}
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 12l2-4 3 2 3-2 2 4H5z M4 8l1-2 2 1 2-2 2 2 2-1 1 2-2 4-3-2-3 2-2-4z" />
            </svg>
            
            <span className="relative">ADMIN</span>
            
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400/30" />
        </span>
    );
};

export default AdminBadge;