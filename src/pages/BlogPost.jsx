import { useParams, Link } from "react-router-dom";
import { posts } from "../blog-data/posts";
import AdBanner from "../components/AdBanner";
import BlogCard from "../components/BlogCard";

const BlogPost = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-purple-400 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const related = posts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-300 truncate">{post.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold bg-purple-900 text-purple-300 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden mb-8 h-56 md:h-72">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Ad before content */}
        <AdBanner slot="3344556677" format="horizontal" className="mb-8" />

        {/* Content */}
        <div
          className="prose prose-invert prose-purple max-w-none text-gray-300 leading-relaxed
            [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
            [&_p]:text-gray-400 [&_p]:leading-relaxed [&_p]:mb-4
            [&_pre]:bg-gray-900 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:text-green-300
            [&_code]:text-purple-300 [&_code]:bg-gray-800 [&_code]:px-1 [&_code]:rounded
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Ad after content */}
        <AdBanner slot="7766554433" format="rectangle" className="mt-10" />

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10">
          <Link to="/blog" className="text-purple-400 hover:underline text-sm">
            ← Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
