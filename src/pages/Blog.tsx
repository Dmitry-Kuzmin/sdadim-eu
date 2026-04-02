import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBlogPosts, type BlogPost } from "@/lib/supabase";
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Newspaper,
  GraduationCap,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SeoHead } from "@/components/seo/SeoHead";

const CATEGORIES = [
  { id: "all", label: "Все статьи", icon: Newspaper },
  { id: "Гайды", label: "Гайды", icon: MapPin },
  { id: "Подготовка", label: "Подготовка", icon: GraduationCap },
  { id: "Советы", label: "Советы", icon: Lightbulb },
  { id: "Актуально", label: "Актуально", icon: BookOpen },
];

function PostSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/8 bg-white/[0.02] p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 bg-white/5 rounded-full w-16" />
        <div className="h-4 bg-white/5 rounded w-10" />
      </div>
      <div className="h-6 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-6 bg-white/5 rounded w-1/2 mb-4" />
      <div className="space-y-2">
        <div className="h-3.5 bg-white/5 rounded w-full" />
        <div className="h-3.5 bg-white/5 rounded w-5/6" />
        <div className="h-3.5 bg-white/5 rounded w-4/6" />
      </div>
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
        <div className="h-3.5 bg-white/5 rounded w-24" />
        <div className="h-3.5 bg-white/5 rounded w-14" />
      </div>
    </div>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const getCategoryCount = (catId: string) =>
    catId === "all" ? posts.length : posts.filter((p) => p.category === catId).length;

  return (
    <div className="min-h-screen bg-[#050B14]">
      <SeoHead
        title="Блог о правах в Испании | Сдадим"
        description="Полезные статьи о получении прав в Испании для русскоязычных: гайды, советы, разбор экзамена DGT."
        canonicalUrl="https://sdadim.eu/blog"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-10">

          {/* ── Left Sidebar ─────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-black text-white mb-1.5">Блог</h1>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Инструкции и советы о правах в Испании
                </p>
              </div>

              {/* Categories */}
              <nav className="space-y-0.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  const count = getCategoryCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3",
                        isActive
                          ? "bg-blue-500/10 text-blue-300 border-l-2 border-blue-500"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-blue-400" : "text-zinc-600")} />
                        <span>{cat.label}</span>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full tabular-nums",
                        isActive ? "bg-blue-500/15 text-blue-400" : "bg-white/5 text-zinc-600"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* CTA mini */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-white font-semibold text-sm mb-1">Готовиться к DGT?</p>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  Тренируйте тесты с полной базой вопросов DGT в SkilyApp.
                </p>
                <a
                  href="https://t.me/skilyapp_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Попробовать бесплатно <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────── */}
          <main className="lg:col-span-3 xl:col-span-4">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Поиск статей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
              />
              <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 bg-white/5 border border-white/10 rounded">
                ⌘K
              </kbd>
            </div>

            {/* States */}
            {error && (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-sm">Не удалось загрузить статьи.</p>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
                <p className="text-zinc-400 font-semibold mb-1">Статьи не найдены</p>
                <p className="text-zinc-600 text-sm">Попробуйте изменить запрос или категорию</p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filtered.map((post) => (
                    <article
                      key={post.id}
                      className="group flex flex-col cursor-pointer rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200 overflow-hidden"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      {/* Cover */}
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
                        <div className="h-44 bg-gradient-to-br from-blue-600/8 to-cyan-600/4 flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-blue-500/20" />
                        </div>
                      )}

                      <div className="flex flex-col flex-1 p-6">
                        {/* Meta */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-zinc-600">
                            <Clock className="w-3 h-3" />
                            {post.reading_time} мин
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-bold text-white text-[17px] leading-snug mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-zinc-500 text-[13px] leading-relaxed flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.published_at).toLocaleDateString("ru-RU", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <span className="flex items-center gap-1 text-[12px] text-zinc-500 group-hover:text-blue-400 transition-colors font-medium">
                            Читать <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 p-8 text-center">
                  <p className="text-white font-black text-xl mb-2">Готовы сдать теорию DGT?</p>
                  <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                    Присоединяйтесь к курсу с живыми уроками или тренируйтесь самостоятельно в SkilyApp.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="https://t.me/skilyapp_bot?start=course"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                    >
                      Записаться на курс →
                    </a>
                    <a
                      href="https://t.me/skilyapp_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors"
                    >
                      Тренировать тесты бесплатно
                    </a>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
