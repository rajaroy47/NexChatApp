import React, { useState, useEffect } from 'react';
import { updateDisplayName, getDefaultName } from '../../firebase/db';
import { updateUserPassword } from '../../firebase/auth';
import { ADMIN_EMAIL } from '../../firebase/config';
import Avatar from './Avatar';
import AdminBadge from './AdminBadge';

// Social Icons Components
const InstagramIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
    </svg>
);

const GitHubIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
);

const DEVELOPER_INFO = [
    { name: 'Instagram', url: 'https://www.instagram.com/raja_roy47', icon: <InstagramIcon />, color: 'from-pink-500 to-red-500' },
    { name: 'GitHub', url: 'https://github.com/rajaroy47', icon: <GitHubIcon />, color: 'from-gray-700 to-gray-900' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajaroy47', icon: <LinkedInIcon />, color: 'from-blue-500 to-blue-600' },
];

const isAdmin = (email) => email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

export const SettingsModal = ({ currentUser, usersCache, onClose, isInitialSetup = false }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState({ profile: '', password: '' });

    // Profile state
    const userInfo = usersCache?.[currentUser?.uid] || { displayName: getDefaultName(currentUser?.email) };
    const [newDisplayName, setNewDisplayName] = useState(userInfo.displayName || '');

    // Password state
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const isDefaultName = (name) => name?.toLowerCase() === getDefaultName(currentUser?.email)?.toLowerCase();

    const handleUpdateDisplayName = async () => {
        const trimmedName = newDisplayName.trim();
        if (trimmedName === userInfo.displayName) {
            setMessages(prev => ({ ...prev, profile: '⚠️ Display name is unchanged' }));
            return;
        }
        if (!isDefaultName(trimmedName) && (trimmedName.length < 3 || trimmedName.length > 20)) {
            setMessages(prev => ({ ...prev, profile: '❌ Name must be 3-20 characters' }));
            return;
        }

        setLoading(true);
        try {
            await updateDisplayName(currentUser.uid, trimmedName);
            setMessages(prev => ({ ...prev, profile: '✅ Display name updated successfully!' }));
            if (isInitialSetup) {
                setTimeout(onClose, 1500);
            }
        } catch (error) {
            setMessages(prev => ({ ...prev, profile: `❌ Error: ${error.message}` }));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.new.length < 6) {
            setMessages(prev => ({ ...prev, password: '❌ Password must be at least 6 characters' }));
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setMessages(prev => ({ ...prev, password: '❌ Passwords do not match' }));
            return;
        }

        setLoading(true);
        try {
            await updateUserPassword(currentUser, passwords.current, passwords.new);
            setMessages(prev => ({ ...prev, password: '✅ Password updated successfully!' }));
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            setMessages(prev => ({ ...prev, password: `❌ Error: ${error.message}` }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#0C0C0C] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg transform animate-slide-in-up max-h-[90vh] overflow-hidden">
                {/* Header with Gradient */}
                <div className="relative p-6 pb-4 border-b border-white/5">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {isInitialSetup ? 'Welcome to NexChat! 👋' : 'Settings'}
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                {isInitialSetup ? 'Set up your profile to get started' : 'Manage your account preferences'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    {!isInitialSetup && (
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`
                                    flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all
                                    ${activeTab === 'profile'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`
                                    flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all
                                    ${activeTab === 'security'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                Security
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                    {/* User Info Card */}
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 mb-6">
                        <Avatar user={userInfo} size="lg" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-400">Signed in as</p>
                            <p className="text-white font-medium truncate">{currentUser?.email}</p>
                            {isAdmin(currentUser?.email) && <AdminBadge size="sm" />}
                        </div>
                    </div>

                    {/* Profile Tab */}
                    {(activeTab === 'profile' || isInitialSetup) && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Display Name</label>
                                <input
                                    type="text"
                                    value={newDisplayName}
                                    onChange={(e) => setNewDisplayName(e.target.value)}
                                    placeholder="Enter display name (3-20 characters)"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                                    maxLength={20}
                                />
                                <p className="text-xs text-gray-500">
                                    Current: <span className="text-purple-400">{userInfo.displayName}</span>
                                    {isDefaultName(userInfo.displayName) && (
                                        <span className="ml-2 text-yellow-500">(Default)</span>
                                    )}
                                </p>
                            </div>

                            {messages.profile && (
                                <div className={`
                                    p-3 rounded-xl text-sm
                                    ${messages.profile.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                                    ${messages.profile.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                                    ${messages.profile.includes('⚠️') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : ''}
                                `}>
                                    {messages.profile}
                                </div>
                            )}

                            <button
                                onClick={handleUpdateDisplayName}
                                disabled={loading || newDisplayName.trim().length < 3}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:hover:shadow-none"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && !isInitialSetup && (
                        <div className="space-y-4">
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <p className="text-sm text-yellow-400 flex items-center gap-2">
                                    <span>⚠️</span>
                                    You'll need your current password to change it
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-300">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all mt-1"
                                        placeholder="Enter current password"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">New Password</label>
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all mt-1"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all mt-1"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {messages.password && (
                                <div className={`
                                    p-3 rounded-xl text-sm
                                    ${messages.password.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : ''}
                                    ${messages.password.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                                `}>
                                    {messages.password}
                                </div>
                            )}

                            <button
                                onClick={handleUpdatePassword}
                                disabled={loading || !passwords.current || passwords.new.length < 6 || passwords.new !== passwords.confirm}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50 disabled:hover:shadow-none"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    )}

                    {/* Social Links */}
                    {!isInitialSetup && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-medium text-gray-400 mb-3">Connect with Developer</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {DEVELOPER_INFO.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${link.color} transition-opacity`} />
                                        <div className="relative flex flex-col items-center gap-1">
                                            <div className="text-gray-400 group-hover:text-white transition-colors">
                                                {link.icon}
                                            </div>
                                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                                {link.name}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isInitialSetup && (
                    <div className="p-4 border-t border-white/5 bg-white/5">
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Close Settings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsModal;