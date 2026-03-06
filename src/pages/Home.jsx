import { Link } from "react-router-dom";
import AdBanner from "../components/AdBanner";

const features = [
  {
    icon: "⚡",
    title: "Real-Time Messaging",
    desc: "Messages delivered instantly via Firebase Realtime Database with WebSocket connections.",
  },
  {
    icon: "🔒",
    title: "Private Chats",
    desc: "Send direct messages to any user. Only you and the recipient can see the conversation.",
  },
  {
    icon: "🌐",
    title: "Global Chat Room",
    desc: "Join the shared public room and chat with everyone connected at the same time.",
  },
  {
    icon: "👤",
    title: "Online Presence",
    desc: "See who's online right now with real-time status indicators and last-seen timestamps.",
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    desc: "Fully responsive design that works seamlessly on phones, tablets, and desktops.",
  },
  {
    icon: "🛡️",
    title: "Email Verification",
    desc: "Accounts require email verification, keeping the community safe and spam-free.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-700 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Live & Free to Use
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-white">
          Chat Instantly with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Anyone, Anywhere
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          NexChat is a free, real-time messaging app. Join the global chat or start a private
          conversation — no downloads, no hassle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chat"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-base"
          >
            Start Chatting →
          </Link>
          <Link
            to="/about"
            className="border border-gray-700 hover:border-purple-500 text-gray-300 font-semibold px-8 py-3 rounded-xl transition-colors text-base"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner slot="1234567890" format="horizontal" />
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Connect</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 hover:border-purple-700 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner slot="0987654321" format="rectangle" />
      </div>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-800 rounded-3xl p-10">
          <h2 className="text-3xl font-bold mb-4">Ready to join the conversation?</h2>
          <p className="text-gray-400 mb-8">
            Create a free account in seconds. No credit card, no setup.
          </p>
          <Link
            to="/chat"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-3 rounded-xl transition-colors text-base"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
