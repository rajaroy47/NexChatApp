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

const getGradientClasses = (hash) => {
    const gradients = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-pink-500 to-rose-500',
        'from-cyan-500 to-blue-500',
        'from-amber-500 to-orange-500',
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

export const Avatar = ({ user, size = 'sm', showRing = true }) => {
    // Debug: Log user prop
    console.log('Avatar - user prop:', user);
    
    const displayName = user?.displayName || 'Guest';
    console.log('Avatar - displayName:', displayName);
    
    const { letter, hash } = useMemo(() => 
        getAvatarLetterAndHash(displayName), 
        [displayName]
    );
    
    console.log('Avatar - letter:', letter, 'hash:', hash);
    
    const gradientClasses = useMemo(() => getGradientClasses(hash), [hash]);
    const sizeClass = sizeClasses[size] || sizeClasses.sm;

    return (
        <div className="relative flex-shrink-0">
            <div className={`
                ${sizeClass} rounded-full flex items-center justify-center
                text-white font-semibold shadow-lg
                ${gradientClasses}
                ${showRing ? 'ring-2 ring-white/10' : ''}
                relative overflow-hidden
            `}>
                <span className="relative z-10">{letter}</span>
            </div>
        </div>
    );
};

export default Avatar;