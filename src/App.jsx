import React from 'react';
import { useAuth } from './firebase/hooks';
import AuthScreen from './components/auth/AuthScreen';
import ChatPage from './pages/ChatPage';

export default function App() {
    const { currentUser, isLoading } = useAuth();

    const style = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #1f2937;
        }
        
        body { 
            font-family: 'Inter', sans-serif; 
            --tw-bg-opacity: 1;
            background-color: #000000;
        }

        .bg-dark-bg { background-color: #000000; } 
        .bg-chat-panel { background-color: #0D1117; } 
        
        @media (max-width: 768px) { 
            .mobile\\:bg-dark-bg {
                background-color: #000000 !important;
            }
        }
    `;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-purple-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-4 text-white font-semibold">Loading App...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{style}</style>
            {currentUser ? <ChatPage currentUser={currentUser} /> : <AuthScreen />}
        </>
    );
}