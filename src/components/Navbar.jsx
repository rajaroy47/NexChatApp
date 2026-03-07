import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <div className="relative">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/40 transition-shadow duration-300">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#060608] animate-pulse"/>
    </div>
    <div>
      <span className="text-lg font-bold text-white tracking-tight">Nex<span className="gradient-text">Chat</span></span>
      <span className="hidden sm:block text-[10px] text-[#55556a] -mt-0.5 leading-none tracking-wide">v2.1 · Futuristic</span>
    </div>
  </Link>
);

const navLinks = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (to) => location.pathname === to || (to === '/home' && location.pathname === '/');

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-[#060608]/90 backdrop-blur-xl border-b border-white/[0.05] shadow-xl shadow-black/40' : 'bg-transparent'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(to)
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-[#9999b0] hover:text-white hover:bg-white/[0.05]'}
                  `}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 text-sm font-medium text-[#9999b0] hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/chat"
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-gradient shadow-lg shadow-violet-900/30 hover:shadow-violet-600/40 hover:scale-[1.03] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                Open App
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(p => !p)}
                className="md:hidden w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#9999b0] hover:text-white transition-colors"
              >
                {menuOpen
                  ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div ref={menuRef} className="md:hidden border-t border-white/[0.05] bg-[#060608]/95 backdrop-blur-xl animate-fade-in-down">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive(to) ? 'text-white bg-violet-600/15 border border-violet-500/20' : 'text-[#9999b0] hover:text-white hover:bg-white/[0.04]'}
                  `}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/login"
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-[#9999b0] hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}
