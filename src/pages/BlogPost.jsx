import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts } from '../blog-data/posts';
import AdBanner from '../components/AdBanner';

export default function BlogPost() {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);

  if (!post) return (
    <div className="min-h-screen bg-[#060608] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-violet-400 hover:text-violet-300 transition-colors">← Back to Blog</Link>
      </div>
    </div>
  );

  const related = posts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/3 w-80 h-80 bg-violet-600/6 rounded-full filter blur-[100px]"/>
      </div>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#55556a] mb-8">
          <Link to="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-violet-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#9999b0] truncate">{post.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wide bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">{post.category}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#9999b0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white">{post.author[0]}</div>
              <span>{post.author}</span>
            </div>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Cover */}
        <div className="rounded-3xl overflow-hidden mb-8 aspect-video bg-[#0e0e12]">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
        </div>

        <AdBanner slot="3344556677" format="horizontal" className="mb-8"/>

        {/* Content */}
        <div
          className="prose-nexchat text-[15px] leading-relaxed text-[#c0c0d0] space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-[#9999b0] [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <AdBanner slot="9988776655" format="rectangle" className="my-10"/>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/[0.05]">
            <h2 className="text-lg font-bold text-white mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.id}`} className="group bg-[#0e0e12] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all">
                  {r.image && <img src={r.image} alt={r.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"/>}
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white leading-tight group-hover:text-violet-300 transition-colors line-clamp-2">{r.title}</p>
                    <p className="text-xs text-[#55556a] mt-1">{r.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
