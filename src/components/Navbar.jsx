import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/nexchat.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={logo} alt="Logo" className="relative z-10 w-full h-full rounded-xl object-cover" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
              NexChat
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? "text-purple-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/chat"
              className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M12 12h8M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        md:hidden absolute top-full left-0 w-full bg-[#0A0A0A] border-b border-white/5 transition-all duration-300 overflow-hidden
        ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
      `}>
        <div className="p-6 flex flex-col gap-6">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-lg font-medium text-slate-300">
              {link.label}
            </Link>
          ))}
          <Link to="/chat" className="w-full py-4 bg-purple-600 text-center rounded-2xl font-bold">
            Open Chat
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;