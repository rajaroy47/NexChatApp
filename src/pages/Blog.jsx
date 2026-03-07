import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../blog-data/posts';
import AdBanner from '../components/AdBanner';

const categories = ['All', ...new Set(posts.map(p => p.category))];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-600/6 rounded-full filter blur-[100px]"/>
      </div>
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="inline-block text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">Blog</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Insights & Updates</h1>
          <p className="text-[#9999b0] max-w-lg mx-auto">Thoughts on real-time apps, web development, and online communication.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === cat ? 'btn-gradient text-white shadow-md' : 'bg-white/[0.04] border border-white/[0.07] text-[#9999b0] hover:text-white hover:border-white/[0.1]'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <AdBanner slot="1122998877" format="horizontal" className="mb-10"/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(post => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group bg-[#0e0e12] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-violet-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              {post.image && (
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wide bg-violet-500/10 px-2 py-1 rounded-lg">{post.category}</span>
                  <span className="text-[10px] text-[#55556a]">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-bold text-white leading-tight mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-[12px] text-[#9999b0] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-[10px] font-bold text-white">{post.author[0]}</div>
                    <span className="text-[11px] text-[#55556a]">{post.author}</span>
                  </div>
                  <span className="text-[11px] text-[#55556a]">{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdBanner slot="7788991122" format="rectangle" className="mt-12"/>
      </div>
    </div>
  );
}
