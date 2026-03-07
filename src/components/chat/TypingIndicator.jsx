// components/chat/TypingIndicator.jsx
import React, { useEffect, useState } from 'react';

const TypingIndicator = ({ users, currentUserId }) => {
    const [dots, setDots] = useState('');
    const [displayNames, setDisplayNames] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 400);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const names = Object.values(users)
            .filter(user => user.id !== currentUserId)
            .map(user => user.displayName || user.email?.split('@')[0] || 'Someone');
        setDisplayNames(names);
    }, [users, currentUserId]);

    if (displayNames.length === 0) return null;

    const text = displayNames.length === 1
        ? `${displayNames[0]} is typing`
        : displayNames.length === 2
            ? `${displayNames[0]} and ${displayNames[1]} are typing`
            : `${displayNames.length} people are typing`;

    return (
        <div className="flex items-center gap-2 px-4 py-2 animate-fade-in">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-violet-400/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-violet-400/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-violet-400/60 rounded-full animate-bounce" />
            </div>
            <span className="text-xs text-gray-500">{text}{dots}</span>
        </div>
    );
};

export default TypingIndicator;