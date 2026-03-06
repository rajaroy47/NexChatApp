import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './firebase/hooks';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Auth
import AuthScreen from './components/auth/AuthScreen';
import ChatPage from './pages/ChatPage';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// ─── Layout Wrapper ────────────────────────────────────────────────────────────
// Shows Navbar + Footer on public pages, hides them inside the chat app

const AppLayout = ({ currentUser }) => {
  const location = useLocation();

  // Routes that use full-screen chat UI (no navbar/footer)
  const isChatRoute = location.pathname === '/' && currentUser;

  if (isChatRoute) {
    return <ChatPage currentUser={currentUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={currentUser ? null : <AuthScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/register" element={<AuthScreen />} />
          <Route path="/chat" element={currentUser ? <ChatPage currentUser={currentUser} /> : <AuthScreen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// ─── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const { currentUser, isLoading } = useAuth();

  const globalStyle = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #4b5563; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background-color: #1f2937; }
    body { font-family: 'Inter', sans-serif; background-color: #000000; }
    .bg-dark-bg { background-color: #000000; }
    .bg-chat-panel { background-color: #0D1117; }
    @media (max-width: 768px) {
      .mobile\\:bg-dark-bg { background-color: #000000 !important; }
    }
  `;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-200 font-semibold">Loading NexChat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{globalStyle}</style>
      <BrowserRouter>
        <AppLayout currentUser={currentUser} />
      </BrowserRouter>
    </>
  );
}
