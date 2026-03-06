import React, { useState } from 'react';
import { updateDisplayName, getDefaultName } from '../../firebase/db';
import { updateUserPassword } from '../../firebase/auth';
import { ADMIN_EMAIL } from '../../firebase/config';
import Avatar from './Avatar';
import AdminBadge from './AdminBadge';

// Replace SVG strings with actual React components
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 5.5c-.3 0-.5.2-.5.5s.2.5.5.5h.01c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm5.5 4.5c-2.4 0-4.5 2.1-4.5 4.5s2.1 4.5 4.5 4.5 4.5-2.1 4.5-4.5-2.1-4.5-4.5-4.5zm0 8c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.352 3.438 9.387 8.207 10.925.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.758-1.334-1.758-1.087-.745.083-.73.083-.73 1.205.084 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.492.998.108-.77.417-1.305.76-1.605-2.665-.3-5.466-1.33-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.125-.303-.535-1.52.117-3.176 0 0 1.008-.323 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.652 1.656.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.805 5.623-5.478 5.922.43.37.823 1.102.823 2.222 0 1.605-.014 2.897-.014 3.295 0 .318.223.69.825.575C20.565 21.385 24 17.35 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.291-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const DEVELOPER_INFO = [
  { name: 'Instagram', url: 'https://www.instagram.com/raja_roy47', icon: <InstagramIcon /> },
  { name: 'GitHub', url: 'https://github.com/rajaroy47', icon: <GitHubIcon /> },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rajaroy47', icon: <LinkedInIcon /> },
];

const isAdmin = (email) => email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

export const SettingsModal = ({ currentUser, usersCache, onClose, isInitialSetup = false }) => {
    const userInfo = usersCache[currentUser.uid] || { displayName: getDefaultName(currentUser.email) };
    const [newDisplayName, setNewDisplayName] = useState(userInfo.displayName || getDefaultName(currentUser.email));
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [displayNameMessage, setDisplayNameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const isDefaultName = (name) => name.toLowerCase() === getDefaultName(currentUser.email).toLowerCase();

    const handleUpdateDisplayName = async () => {
        const trimmedName = newDisplayName.trim();

        if (trimmedName === userInfo.displayName) {
            setDisplayNameMessage('Display name is the same.');
            return;
        }
        if (!isDefaultName(trimmedName) && (trimmedName.length < 3 || trimmedName.length > 20)) {
            setDisplayNameMessage('Custom display name must be between 3 and 20 characters.');
            return;
        }

        setLoading(true);
        setDisplayNameMessage('');

        try {
            await updateDisplayName(currentUser.uid, trimmedName); 
            setDisplayNameMessage('Display Name updated successfully! 🎉');
            if (isInitialSetup) {
                setTimeout(onClose, 1000); 
            }
        } catch (error) {
            console.error("Error updating display name:", error);
            setDisplayNameMessage(`Error updating name: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        setPasswordMessage('');

        if (newPassword.length < 6) {
            setPasswordMessage('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setPasswordMessage('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        
        try {
            await updateUserPassword(currentUser, currentPassword, newPassword);
            setPasswordMessage('Password changed successfully! Please remember your new password. 🔒');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setPasswordMessage(`Error: ${error.message}`); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-chat-panel border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-lg space-y-6 transform transition-all duration-300 scale-100 overflow-y-auto max-h-[90vh]">
                <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
                    {isInitialSetup ? 'Welcome! Set Your Name' : 'User Settings ⚙️'}
                </h3>
                
                {isInitialSetup && (
                    <div className="p-3 bg-purple-900/50 text-purple-200 rounded-lg text-sm">
                        👋 Welcome to NexChat! Please choose a **Display Name (DP Name)** to start chatting 😊.
                    </div>
                )}
                
                <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                    <Avatar user={userInfo} />
                    <div className="flex flex-col">
                        <p className="text-gray-400 text-sm">Email:</p>
                        <p className="text-white font-mono break-all text-sm">{currentUser.email}</p>
                        {isAdmin(currentUser.email) && <AdminBadge />}
                    </div>
                </div>
                
                <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h4 className="text-lg font-bold text-gray-200">1. Update Display Name</h4>
                    <div className="space-y-2">
                        <label htmlFor="displayName" className="text-gray-300 font-semibold">Display Name (DP Name)</label>
                        <input
                            id="displayName"
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            placeholder="Enter new display name (3-20 characters)"
                            className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            maxLength={20}
                        />
                        <p className="text-xs text-gray-500">
                            Current Name: <span className="text-purple-400">{userInfo.displayName}</span>
                            {isDefaultName(userInfo.displayName) && <span className="text-red-400 ml-2">(Default from Email)</span>}
                        </p>
                    </div>

                    {displayNameMessage && (
                        <p className={`text-sm font-medium p-2 rounded-lg text-center ${displayNameMessage.includes('Error') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                            {displayNameMessage}
                        </p>
                    )}
                    <div className="flex justify-end pt-2">
                         <button
                            onClick={handleUpdateDisplayName}
                            disabled={loading || newDisplayName.trim().length < 3}
                            className="py-2 px-4 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 transition duration-150 disabled:bg-purple-400"
                        >
                            {loading ? 'Saving...' : 'Save Name'}
                        </button>
                    </div>
                </div>

                <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h4 className="text-lg font-bold text-gray-200">2. Change Password</h4>
                    <p className="text-sm text-yellow-400 bg-yellow-900/30 p-2 rounded-lg">
                        ⚠️ **Security Alert:** You must enter your **current password** to proceed with the change.
                    </p>
                    <div className="space-y-2">
                        <label htmlFor="currentPassword" className="text-gray-300 font-semibold">Current Password</label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter your current password"
                            className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            required
                        />

                        <label htmlFor="newPassword" className="text-gray-300 font-semibold">New Password (Min 6 chars)</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new password"
                            className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            minLength={6}
                            required
                        />

                        <label htmlFor="confirmNewPassword" className="text-gray-300 font-semibold">Confirm New Password</label>
                        <input
                            id="confirmNewPassword"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm your new password"
                            className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            minLength={6}
                            required
                        />
                    </div>
                    
                    {passwordMessage && (
                        <p className={`text-sm font-medium p-2 rounded-lg text-center ${passwordMessage.includes('Error') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                            {passwordMessage}
                        </p>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleUpdatePassword}
                            disabled={loading || !currentPassword || newPassword.length < 6 || newPassword !== confirmNewPassword}
                            className="py-2 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition duration-150 disabled:bg-red-400"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-700 pt-5">
                    {!isInitialSetup && (
                        <button
                            onClick={onClose}
                            className="py-2 px-4 rounded-xl text-sm font-bold text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-150"
                        >
                            Close Settings
                        </button>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 space-y-3">
                    <h4 className="text-base font-bold text-gray-300">Follow Me On</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {DEVELOPER_INFO.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-purple-600 hover:text-white transition duration-150 text-center"
                            >
                                <div className="flex items-center justify-center mb-1">
                                    {link.icon}
                                </div>
                                <span className="text-xs font-medium">{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;