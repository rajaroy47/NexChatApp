import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";
import { 
  BoltIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  FingerPrintIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: BoltIcon,
    title: "Real-Time Messaging",
    desc: "Experience zero-latency communication powered by enterprise-grade infrastructure.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: ShieldCheckIcon,
    title: "End-to-End Privacy",
    desc: "Your conversations remain yours. Enterprise-grade encryption for every message.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Connectivity",
    desc: "Connect across borders with our globally distributed network infrastructure.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: UserGroupIcon,
    title: "Live Presence",
    desc: "Intelligent status tracking with real-time activity indicators and typing awareness.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Adaptive Interface",
    desc: "Seamless experience across all devices with our responsive, native-like interface.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: FingerPrintIcon,
    title: "Verified Community",
    desc: "Multi-factor authentication and advanced bot detection for a secure environment.",
    gradient: "from-indigo-500 to-purple-500"
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-200 selection:bg-purple-500/30">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-pink-600/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse animation-delay-4000" />
        
        {/* Subtle Grid Pattern */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`} />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 text-center">
        {/* Live Status Badge */}
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-8 animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-gray-300">
            <span className="text-gray-400">v2.0 — </span>Now available globally
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          <span className="block text-white">Chat Instantly with</span>
          <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Anyone, Anywhere
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          The next evolution in real-time communication. Join millions of users in secure, 
          instant conversations that feel as natural as being in the same room.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/chat"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <span>Start Chatting Now</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            to="/about"
            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            View Documentation
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            99.9% Uptime
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            10M+ Messages/day
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            150+ Countries
          </span>
        </div>
      </section>

      {/* Premium Ad Placement */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="p-[2px] rounded-2xl bg-gradient-to-r from-white/5 via-white/20 to-white/5">
          <div className="bg-[#0C0C0C] rounded-2xl overflow-hidden">
            <AdBanner slot="1234567890" format="horizontal" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Engineered for Excellence
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Every feature is meticulously crafted to deliver an unparalleled communication experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.02] to-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500 hover:translate-y-[-4px]"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                {/* Icon with Gradient */}
                <div className={`relative w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px]`}>
                  <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                    <Icon className="w-7 h-7 text-white group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 border border-white/10 p-12 sm:p-20 text-center">
          {/* Background Pattern */}
          <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M0 0h20v20H0V0zm10 10h10v10H10V10zM0 10h10v10H0V10z"/%3E%3C/g%3E%3C/svg%3E')] opacity-30` } />


          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to transform your communication?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of teams and millions of users who trust us for their daily conversations. 
              No credit card required. No commitment. Just pure, instant connection.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35"
            >
              <span>Get Started Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Ad */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AdBanner slot="0987654321" format="rectangle" />
      </div>
    </div>
  );
};

export default Home;