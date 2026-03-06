import { posts } from "../blog-data/posts";
import BlogCard from "../components/BlogCard";
import AdBanner from "../components/AdBanner";

const Blog = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2">Blog</h1>
        <p className="text-gray-400 mb-10 text-lg">
          Thoughts on real-time apps, web development, and online communication.
        </p>

        <AdBanner slot="1122998877" format="horizontal" className="mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <AdBanner slot="7788991122" format="rectangle" className="mt-12" />
      </div>
    </div>
  );
};

export default Blog;
