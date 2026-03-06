import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";

const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
    ),
    title: "Real-Time Messaging",
    desc: "Experience zero-latency communication powered by Firebase and optimized WebSockets.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
    ),
    title: "End-to-End Privacy",
    desc: "Your conversations are your business. Secure, private channels for 1-on-1 chats.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
    ),
    title: "Global Connectivity",
    desc: "Connect with the world in our public square. Scaled for thousands of concurrent users.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    ),
    title: "Live Presence",
    desc: "Intelligent status tracking showing who's active and when they were last seen.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
    ),
    title: "Adaptive Interface",
    desc: "A mobile-first experience that feels native on every device and screen size.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    ),
    title: "Verified Community",
    desc: "Multi-factor authentication ensures your chat environment stays bot-free.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-purple-500/30">
      {/* Dynamic Background Ornament */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium tracking-wide uppercase text-slate-300">NexChat v2.0 is live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-white bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-white to-white/60 bg-clip-text text-transparent">
          Chat Instantly with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text">
            Anyone, Anywhere
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          The next generation of real-time messaging. Join the global conversation or start a secure private chat in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/chat"
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Chatting Now
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Modern Ad Slot */}
      <div className="max-w-5xl mx-auto px-6 mb-24">
        <div className="p-1 rounded-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5">
          <div className="bg-[#0A0A0A] rounded-[14px] overflow-hidden">
            <AdBanner slot="1234567890" format="horizontal" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Engineered for Connection</h2>
          <p className="text-slate-500">Fast, secure, and built for the modern web.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-purple-600/20 to-transparent border border-white/10 p-12 md:p-20 text-center">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to jump in?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              No credit card required. No tedious onboarding. Just pure, instant communication.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-purple-500/20"
            >
              Create Free Account
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
          {/* Decorative background flare */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-500/10 blur-[100px] rounded-full" />
        </div>
      </section>

      {/* Footer-area Ad */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <AdBanner slot="0987654321" format="rectangle" />
      </div>
    </div>
  );
};

export default Home;