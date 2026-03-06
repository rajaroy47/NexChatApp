import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  return (
    <article className="bg-[#0D1117] border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-700 transition-colors group">
      <Link to={`/blog/${post.id}`}>
        <div className="h-44 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-gray-500">{post.readTime}</span>
        </div>
        <Link to={`/blog/${post.id}`}>
          <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-xs font-bold text-white">
              {post.author.charAt(0)}
            </div>
            <span className="text-xs text-gray-400">{post.author}</span>
          </div>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
