import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './firebase/hooks';

// Layout Components (keep these eager-loaded as they're critical)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthScreen from './components/auth/AuthScreen';

// Lazy load pages for better performance
const ChatPage = lazy(() => import('./pages/ChatPage'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));

// ─── Constants ─────────────────────────────────────────────────────────────

const PUBLIC_ROUTES = ['/home', '/about', '/contact', '/blog', '/privacy-policy', '/terms'];
const AUTH_ROUTES = ['/login', '/register'];

// ─── Route Guard ───────────────────────────────────────────────────────────

const ProtectedRoute = ({ children, currentUser }) => {
  const location = useLocation();
  
  if (!currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  return children;
};

const PublicRoute = ({ children, currentUser }) => {
  const location = useLocation();
  
  if (currentUser && AUTH_ROUTES.includes(location.pathname)) {
    return <Navigate to="/chat" replace />;
  }
  
  return children;
};

// ─── Loading Component ─────────────────────────────────────────────────────

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" />
      
      {/* Main Loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-pink-500/20 animate-ping animation-delay-150" />
          <div className="absolute inset-4 rounded-full border-2 border-blue-500/20 animate-ping animation-delay-300" />
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-8 text-center">
          <p className="text-lg font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Loading NexChat
          </p>
          <p className="mt-2 text-sm text-gray-500">Preparing your experience...</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Page Transition Component ─────────────────────────────────────────────

const PageTransition = ({ children, location }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    setTransitionStage('fadeOut');
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('fadeIn');
    }, 200);

    return () => clearTimeout(timeout);
  }, [children, location]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === 'fadeIn' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {displayChildren}
    </div>
  );
};

// ─── Layout Wrapper ────────────────────────────────────────────────────────

const AppLayout = ({ currentUser }) => {
  const location = useLocation();
  const isChatRoute = location.pathname === '/chat' && currentUser;
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  const showLayout = !isChatRoute && !isAuthRoute;

  return (
    <div className="min-h-screen flex flex-col bg-black selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {showLayout && <Navbar />}
      
      <main className={`flex-1 relative z-10 ${isChatRoute ? 'p-0' : ''}`}>
        <Suspense fallback={<LoadingScreen />}>
          <PageTransition location={location}>
            <Routes location={location}>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  currentUser ? 
                    <Navigate to="/chat" replace /> : 
                    <Home />
                } 
              />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Auth Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute currentUser={currentUser}>
                    <AuthScreen mode="login" />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute currentUser={currentUser}>
                    <AuthScreen mode="register" />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute currentUser={currentUser}>
                    <ChatPage currentUser={currentUser} />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all - 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                      <p className="text-gray-400 mb-8">Page not found</p>
                      <a 
                        href="/" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                      >
                        <span>Go Home</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </PageTransition>
        </Suspense>
      </main>

      {showLayout && <Footer />}
    </div>
  );
};

// ─── Global Styles ─────────────────────────────────────────────────────────

const GlobalStyles = () => {
  useEffect(() => {
    // Add Inter font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <style>{`
      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%);
        border-radius: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #7C3AED 0%, #DB2777 100%);
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }

      /* Base Styles */
      body {
        font-family: 'Inter', sans-serif;
        background-color: #000000;
        color: #ffffff;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        padding: 0;
      }

      /* Selection */
      ::selection {
        background: rgba(139, 92, 246, 0.3);
        color: #ffffff;
      }

      /* Focus Styles */
      *:focus-visible {
        outline: 2px solid #8B5CF6;
        outline-offset: 2px;
      }

      /* Animation Keyframes */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @keyframes ping {
        75%, 100% { transform: scale(1.5); opacity: 0; }
      }

      /* Animation Classes */
      .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
      }

      .animate-fade-out {
        animation: fadeOut 0.3s ease-out forwards;
      }

      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      .animate-ping {
        animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      .animation-delay-150 {
        animation-delay: 150ms;
      }

      .animation-delay-300 {
        animation-delay: 300ms;
      }

      /* Glass Effect */
      .glass {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .glass-hover:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(139, 92, 246, 0.3);
      }

      /* Gradient Text */
      .gradient-text {
        background: linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Mobile Optimizations */
      @media (max-width: 768px) {
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      }
    `}</style>
  );
};

// ─── Root App ──────────────────────────────────────────────────────────────

export default function App() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <GlobalStyles />
      <BrowserRouter>
        <AppLayout currentUser={currentUser} />
      </BrowserRouter>
    </>
  );
}