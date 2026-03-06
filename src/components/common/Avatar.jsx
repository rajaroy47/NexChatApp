import React, { useMemo } from 'react';

const getAvatarLetterAndHash = (nameOrEmail) => {
    if (!nameOrEmail) return { letter: '?', hash: 0 };
    
    // Get first letter, or first two letters if available
    const words = nameOrEmail.split(/[ ._@-]/);
    let letter = words[0]?.charAt(0)?.toUpperCase() || '?';
    if (words.length > 1 && words[1]) {
        letter += words[1].charAt(0).toUpperCase();
    } else if (nameOrEmail.length > 1) {
        letter = nameOrEmail.charAt(0).toUpperCase() + nameOrEmail.charAt(1).toLowerCase();
    }
    
    // Generate hash for consistent color
    let hash = 0;
    for (let i = 0; i < nameOrEmail.length; i++) {
        hash = nameOrEmail.charCodeAt(i) + ((hash << 5) - hash);
    }
    return { letter, hash: Math.abs(hash) };
};

const getGradientClasses = (hash, size) => {
    const gradients = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-pink-500 to-rose-500',
        'from-cyan-500 to-blue-500',
        'from-amber-500 to-orange-500',
        'from-teal-500 to-green-500',
        'from-fuchsia-500 to-pink-500',
    ];
    
    return `bg-gradient-to-br ${gradients[hash % gradients.length]}`;
};

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
};

export const Avatar = ({ user, size = 'md', showRing = true, status }) => {
    const { letter, hash } = useMemo(() => 
        getAvatarLetterAndHash(user?.displayName || user?.email || 'Guest'), 
        [user]
    );
    
    const gradientClasses = useMemo(() => getGradientClasses(hash, size), [hash]);
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div className="relative flex-shrink-0">
            <div className={`
                ${sizeClass} rounded-full flex items-center justify-center
                text-white font-semibold shadow-lg
                ${gradientClasses}
                ${showRing ? 'ring-2 ring-white/10 ring-offset-2 ring-offset-[#0A0A0A]' : ''}
                transform transition-transform duration-300 hover:scale-110
                relative overflow-hidden
            `}>
                {/* Inner glow */}
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                
                {/* Avatar letter */}
                <span className="relative z-10">{letter}</span>
            </div>

            {/* Status indicator */}
            {status && (
                <span className={`
                    absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full 
                    border-2 border-[#0A0A0A]
                    ${status === 'online' ? 'bg-green-500 animate-pulse' : 
                      status === 'away' ? 'bg-yellow-500' : 
                      status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}
                `} />
            )}
        </div>
    );
};

export default Avatar;