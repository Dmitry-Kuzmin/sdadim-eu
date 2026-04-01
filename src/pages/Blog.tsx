import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/lib/supabase";
import { Clock, ArrowRight, Rss } from "lucide-react";

function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/8 overflow-hidden">
      <div className="h-44 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/5 rounded w-1/4" />
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-6">
            <Rss className="w-3.5 h-3.5" />
            Блог
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Всё о правах в Испании
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Инструкции, советы и реальный опыт — от тех, кто прошёл этот путь.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-sm">Не удалось загрузить статьи.</p>
          </div>
        )}

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
          </div>
        )}

        {/* Posts */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-sm">Статьи скоро появятся.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all overflow-hidden"
              >
                {post.cover_image ? (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} мин
                    </span>
                  </div>
                  <h2 className="font-bold text-white text-base mb-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-zinc-500 text-xs leading-relaxed flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500 group-hover:text-blue-400 transition-colors font-medium">
                    Читать <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
