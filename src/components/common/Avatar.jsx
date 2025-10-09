import React from 'react';

const getAvatarLetterAndHash = (nameOrEmail) => {
    if (!nameOrEmail) return { letter: '?', hash: 0 };
    const letter = nameOrEmail.charAt(0).toUpperCase();
    
    let hash = 0;
    for (let i = 0; i < nameOrEmail.length; i++) {
        hash = nameOrEmail.charCodeAt(i) + ((hash << 5) - hash);
    }
    return { letter, hash: hash & 0xFFFFFFFF };
};

const getGradientClasses = (hash) => {
    const gradients = [
        'from-red-500 to-pink-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-teal-500',
        'from-yellow-500 to-amber-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-fuchsia-500',
        'from-cyan-500 to-blue-500',
        'from-lime-500 to-green-500',
        'from-orange-500 to-red-500',
    ];
    return `bg-gradient-to-br ${gradients[hash % gradients.length]}`;
};

export const Avatar = ({ user, size = '10' }) => {
    const nameForHash = user.displayName; 
    const { letter, hash } = getAvatarLetterAndHash(nameForHash);
    const gradientClasses = getGradientClasses(hash);
    
    return (
        <div className={`flex-shrink-0 w-${size} h-${size} rounded-full overflow-hidden flex items-center justify-center shadow-md ring-2 ring-gray-700 text-white font-bold text-xl ${gradientClasses}`}>
            {letter}
        </div>
    );
};

export default Avatar;