import React, { useState } from 'react';
import { authMethods } from '../../firebase/auth';
import { saveUserInfo, getDefaultName } from '../../firebase/db';

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

export const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState(''); 
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (!email || !password) {
            setMessage('Email and password are required.');
            setLoading(false);
            return;
        }

        try {
            if (isSigningUp) {
                const { user } = await authMethods.signup(email, password);
                await authMethods.sendVerification(user);
                
                setTimeout(async () => {
                    try {
                        await saveUserInfo(user.uid, user.email, displayName.trim());
                    } catch (dbError) {
                        console.error("RTDB save failed despite delay (Race condition likely):", dbError);
                    }
                }, 50); 

                setMessage('Signup success! Check email(Spam Folder) to verify, then log in.');
            } else {
                const { user } = await authMethods.login(email, password);
                if (!user.emailVerified) {
                    await authMethods.logout();
                    setMessage('Error: Your email address is not verified. Check your inbox.');
                }
            }
        } catch (e) {
            let msg = e.message;
            if (e.code === 'auth/user-not-found') msg = 'No user found with this email.';
            if (e.code === 'auth/wrong-password') msg = 'Incorrect password.';
            if (e.code === 'auth/email-already-in-use') msg = 'Email already registered.';
            if (e.code === 'auth/invalid-email') msg = 'Invalid email format.';
            if (e.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';

            setMessage(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setMessage('Enter your email to reset the password.');
            return;
        }
        setLoading(true);
        try {
            await authMethods.resetPassword(email);
            setMessage('Password reset email sent! Check your inbox(Spam Folder).');
        } catch (e) {
            setMessage(`Reset Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 font-inter mobile:bg-dark-bg">
            <div className="w-full max-w-sm p-6 sm:p-8 space-y-6 bg-chat-panel rounded-2xl shadow-2xl transition-all duration-300 mobile:shadow-none mobile:p-4 mobile:bg-chat-panel border border-gray-700">

                {/* Compact Header Section */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src="/nexchat.png"
                            alt="NexChat Logo"
                            className="w-full h-full object-cover animate-pulse"
                          />
                        </div>

                        <div className="text-left">
                            <h1 className="text-xl font-bold text-white">NexChat</h1>
                            <p className="text-xs text-purple-300">2025 v2.1</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400">
                        {isSigningUp ? 'Join the conversation' : 'Sign in to start chatting'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mobile:bg-chat-panel mobile:p-0 mobile:rounded-xl mobile:shadow-lg">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                        required
                    />

                    {/* {isSigningUp && (
                        <input
                            type="text"
                            placeholder="Display Name (Optional, e.g., 'User99')"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                            maxLength={20}
                        />
                    )} */}

                    {message && (
                        <p className={`text-sm font-medium p-2 rounded-lg text-center ${message.includes('Error') || message.includes('not verified') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 transform active:scale-95 disabled:bg-purple-400"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : isSigningUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <div className="flex flex-col space-y-2 justify-center items-center text-sm text-gray-300">
                    <button
                        onClick={() => {
                            setIsSigningUp(!isSigningUp);
                            setMessage('');
                        }}
                        className="font-medium text-purple-400 hover:text-purple-300 transition duration-150"
                    >
                        {isSigningUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                    </button>
                    {!isSigningUp && (
                        <button
                            onClick={handleResetPassword}
                            className="font-medium text-purple-400 hover:text-purple-300 transition duration-150"
                        >
                            Forgot Password?
                        </button>
                    )}
                </div>

                {/* Developer Info Section */}
                <div className="mt-6 pt-4 border-t border-gray-700 space-y-3">
                    <h4 className="text-base font-bold text-gray-300 text-center">Follow Me On</h4>
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
                <div className="flex justify-center items-center">
                    {/* <p className="text-xs text-gray-400">By Raja With ❤️</p> */}
                    <p className="text-xs text-gray-400">
                      By Raja With <span className="animate-heartbeat text-red-500 drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]">❤️</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
