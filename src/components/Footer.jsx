import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0D1117] border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://res.cloudinary.com/dys8on0yh/image/upload/v1772786485/nexchat_zvxgkf.png" alt="NexChat" className="w-7 h-7 rounded-lg" />
              <span className="text-white font-bold text-lg">NexChat</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Real-time messaging built with React & Firebase. Fast, simple, and open.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Pages</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
                { to: "/chat", label: "Launch Chat" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} NexChat. Built with ❤️ by Raja Roy.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/rajaroy47" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/raja_roy47" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2zm-.2 5.5c-.3 0-.5.2-.5.5s.2.5.5.5h.01c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm5.5 4.5c-2.4 0-4.5 2.1-4.5 4.5s2.1 4.5 4.5 4.5 4.5-2.1 4.5-4.5-2.1-4.5-4.5-4.5zm0 8c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
