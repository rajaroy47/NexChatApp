import AdBanner from "../components/AdBanner";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-4">About NexChat</h1>
        <p className="text-purple-400 text-lg mb-10">A real-time chat app built for everyone.</p>

        <AdBanner slot="1122334455" format="horizontal" className="mb-10" />

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What is NexChat?</h2>
            <p>
              NexChat is a free, open real-time messaging application built with React, Firebase
              Realtime Database, and Tailwind CSS. It supports both a global public chat room and
              private one-on-one conversations between registered users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Why We Built It</h2>
            <p>
              NexChat started as a personal project to explore real-time web technologies. The goal
              was to create a lightweight, fast, and genuinely useful chat application without the
              overhead of large commercial platforms. It has since grown into a complete, polished
              product that anyone can use for free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">The Technology</h2>
            <ul className="space-y-2 mt-2">
              {[
                ["React 19", "Fast, component-based UI with hooks"],
                ["Firebase RTDB", "Real-time data sync with WebSocket technology"],
                ["Firebase Auth", "Secure email/password authentication with verification"],
                ["Tailwind CSS 4", "Utility-first responsive styling"],
                ["Vite 7", "Lightning-fast build tool and dev server"],
              ].map(([tech, desc]) => (
                <li key={tech} className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold min-w-[130px]">{tech}</span>
                  <span className="text-gray-400">{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">The Developer</h2>
            <p>
              NexChat is designed and built by{" "}
              <a
                href="https://github.com/rajaroy47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                Raja Roy
              </a>
              , a full-stack developer passionate about real-time web applications, clean UX, and
              open-source software.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com/rajaroy47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 border border-purple-700 px-4 py-2 rounded-lg hover:bg-purple-900/40 transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.instagram.com/raja_roy47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 border border-purple-700 px-4 py-2 rounded-lg hover:bg-purple-900/40 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/rajaroy47"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 border border-purple-700 px-4 py-2 rounded-lg hover:bg-purple-900/40 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </section>

          <AdBanner slot="5566778899" format="rectangle" className="mt-10" />
        </div>
      </div>
    </div>
  );
};

export default About;
