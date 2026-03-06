import { useState } from "react";
import AdBanner from "../components/AdBanner";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, wire to EmailJS, Formspree, or a Firebase Function
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-gray-400 mb-8">Have a question, bug report, or just want to say hi? Drop us a message.</p>

        <AdBanner slot="2233445566" format="horizontal" className="mb-10" />

        {submitted ? (
          <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
            <p className="text-sm text-green-400">Thanks for reaching out. We'll get back to you at {form.email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Raja Roy"
                className="w-full bg-[#0D1117] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#0D1117] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full bg-[#0D1117] border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 p-6 bg-[#0D1117] border border-gray-800 rounded-2xl text-sm text-gray-400 space-y-2">
          <p><span className="text-white font-semibold">Email:</span> eduroket001@gmail.com</p>
          <p><span className="text-white font-semibold">GitHub:</span>{" "}
            <a href="https://github.com/rajaroy47" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
              github.com/rajaroy47
            </a>
          </p>
        </div>

        <AdBanner slot="6677889900" format="rectangle" className="mt-10" />
      </div>
    </div>
  );
};

export default Contact;
