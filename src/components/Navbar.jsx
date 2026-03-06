import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled 
            ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 py-3" 
            : "bg-transparent py-5"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo with animated gradient */}
            <Link 
              to="/" 
              className="relative group flex items-center gap-3"
              aria-label="NexChat Home"
            >
              {/* Logo Container with Glow Effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white/10 group-hover:ring-purple-500/50 transition-all duration-300">
                  <img 
                    src="#" 
                    alt="NexChat" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Brand Name with Gradient */}
              <span className="text-white font-bold text-xl tracking-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                  NexChat
                </span>
              </span>

              {/* Live Badge (optional) */}
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-medium text-green-400 uppercase tracking-wider">Live</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    relative text-sm font-medium transition-all duration-300 group
                    ${isActive(link.to) 
                      ? "text-white" 
                      : "text-gray-400 hover:text-white"
                    }
                  `}
                >
                  {link.label}
                  
                  {/* Animated Underline */}
                  <span 
                    className={`
                      absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 
                      transition-all duration-300 ease-out
                      ${isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"}
                    `}
                  />
                </Link>
              ))}

              {/* Chat CTA Button */}
              <Link
                to="/chat"
                className="relative group overflow-hidden rounded-xl"
              >
                {/* Button Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button Content */}
                <div className="relative px-5 py-2.5 flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">Open Chat</span>
                  
                  {/* Animated Arrow */}
                  <svg 
                    className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {menuOpen ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`
            md:hidden absolute left-0 right-0 top-full mt-2 mx-4 transition-all duration-300 transform
            ${menuOpen 
              ? "opacity-100 translate-y-0 visible" 
              : "opacity-0 -translate-y-4 invisible pointer-events-none"
            }
          `}
        >
          <div className="bg-[#0C0C0C] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Menu Links */}
            <div className="p-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive(link.to)
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive(link.to) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-2" />

            {/* Mobile Chat Button */}
            <div className="p-2">
              <Link
                to="/chat"
                className="relative group block overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
                <div className="relative px-4 py-3.5 flex items-center justify-center gap-2">
                  <span className="text-white font-semibold text-sm">Open Chat</span>
                  <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Live Status for Mobile */}
            <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500">System Status</span>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className={`transition-all duration-500 ${scrolled ? "h-16" : "h-20"}`} />
    </>
  );
};

export default Navbar;