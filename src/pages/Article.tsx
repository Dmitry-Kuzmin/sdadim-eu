import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogPost, getBlogPosts, type BlogPost } from "@/lib/supabase";
import {
  Clock,
  ArrowLeft,
  Calendar,
  Share2,
  Twitter,
  Link2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── SEO ─────────────────────────────────────────────────────────────────────

function useSEOMeta(post: BlogPost | null) {
  useEffect(() => {
    if (!post) return;
    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    };

    const setMeta = (selector: string, attr: string, val: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, selector.match(/\[(?:name|property)="(.+?)"\]/)?.[1] ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    document.title = `${post.title} | Сдадим`;
    setMeta('meta[name="description"]', "name", post.excerpt);
    setMeta('meta[property="og:title"]', "property", post.title);
    setMeta('meta[property="og:description"]', "property", post.excerpt);
    if (post.cover_image) {
      const img = post.cover_image.startsWith("http") ? post.cover_image : `https://sdadim.eu${post.cover_image}`;
      setMeta('meta[property="og:image"]', "property", img);
    }
    setMeta('meta[property="og:url"]', "property", `https://sdadim.eu/blog/${post.slug}`);
    setMeta('meta[property="og:type"]', "property", "article");

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const canonicalUrl = `https://sdadim.eu/blog/${post.slug}`;
    canonical.href = canonicalUrl;

    // JSON-LD
    const ldId = "ld-article";
    document.getElementById(ldId)?.remove();
    const ld = document.createElement("script");
    ld.id = ldId;
    ld.type = "application/ld+json";
    ld.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: post.cover_image ? (post.cover_image.startsWith("http") ? post.cover_image : `https://sdadim.eu${post.cover_image}`) : undefined,
      datePublished: post.published_at,
      publisher: { "@type": "Organization", name: "Сдадим", url: "https://sdadim.eu" },
    });
    document.head.appendChild(ld);

    return () => {
      document.title = prev.title;
      document.querySelector('meta[name="description"]')?.setAttribute("content", prev.desc);
      document.querySelector('link[rel="canonical"]')?.remove();
      document.getElementById(ldId)?.remove();
    };
  }, [post]);
}

// ─── TOC from HTML ────────────────────────────────────────────────────────────

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): Heading[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const els = doc.querySelectorAll("h2, h3");
    return Array.from(els).map((el) => ({
      id: el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "",
      text: el.textContent ?? "",
      level: parseInt(el.tagName[1]),
    })).filter((h) => h.id && h.text);
  } catch {
    return [];
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-5 bg-white/5 rounded w-24" />
          <div className="h-11 bg-white/5 rounded w-3/4" />
          <div className="h-11 bg-white/5 rounded w-1/2" />
          <div className="h-5 bg-white/5 rounded w-40" />
          <div className="space-y-3 pt-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`h-4 bg-white/5 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
            ))}
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 h-48" />
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, behavior: "auto" });
    setLoading(true);
    Promise.all([
      getBlogPost(slug),
      getBlogPosts(),
    ]).then(([p, all]) => {
      setPost(p);
      setRelated(all.filter((a) => a.slug !== slug).slice(0, 2));
    }).finally(() => setLoading(false));
  }, [slug]);

  useSEOMeta(post);

  // Share handlers
  const shareUrl = `https://sdadim.eu/blog/${slug}`;
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title ?? "")}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post?.title, url: shareUrl });
    } else {
      handleCopyLink();
    }
  };

  if (loading) return <Skeleton />;

  if (!post) {
    return (
      <main className="pt-32 pb-20 px-4 text-center">
        <p className="text-zinc-500 mb-6">Статья не найдена.</p>
        <Link to="/blog" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          ← Вернуться в блог
        </Link>
      </main>
    );
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const headings = extractHeadings(post.content);

  return (
    <div className="min-h-screen bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

          {/* ── Main Article ────────────────────────────────────── */}
          <main className="lg:col-span-8">

            {/* Back nav */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Все статьи
            </Link>

            {/* Article header */}
            <div className="mb-8">
              <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5">
                {post.title}
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-5">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {publishedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.reading_time} мин чтения
                </span>
              </div>
            </div>

            {/* Mobile: TOC + Share */}
            <div className="lg:hidden space-y-3 mb-8">
              {/* Share row */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c1523]">
                <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Clock className="w-4 h-4" />
                  {post.reading_time} мин чтения
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-medium">Поделиться</span>
                  <button
                    onClick={handleTwitter}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Twitter"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNativeShare}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Поделиться"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mobile TOC */}
              {headings.length > 0 && (
                <div className="rounded-xl bg-[#0c1523] overflow-hidden">
                  <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                  >
                    <span>Содержание</span>
                    {tocOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {tocOpen && (
                    <nav className="px-4 pb-4 space-y-2 max-h-56 overflow-y-auto border-t border-white/5 pt-3">
                      {headings.map((h, i) => (
                        <a
                          key={i}
                          href={`#${h.id}`}
                          onClick={() => setTocOpen(false)}
                          className={cn(
                            "block text-sm transition-colors hover:text-white",
                            h.level === 3
                              ? "ml-4 text-zinc-500 hover:text-zinc-300"
                              : "text-zinc-400 font-medium"
                          )}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              )}
            </div>

            {/* Cover image */}
            {post.cover_image && (
              <div className="rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full object-cover max-h-[420px]"
                />
              </div>
            )}

            {/* Article content */}
            <div
              className="prose prose-invert max-w-none
                prose-headings:font-black prose-headings:text-white prose-headings:scroll-mt-24
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3
                prose-h2:border-b prose-h2:border-white/5
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-zinc-300 prose-p:leading-[1.85] prose-p:text-[15px]
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-zinc-300 prose-ol:text-zinc-300
                prose-li:marker:text-blue-400 prose-li:leading-relaxed prose-li:text-[15px]
                prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5
                prose-blockquote:rounded-r-xl prose-blockquote:text-zinc-300 prose-blockquote:py-1
                prose-table:text-zinc-300 prose-thead:border-white/10 prose-tr:border-white/5
                prose-th:text-white prose-th:font-semibold
                prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:rounded prose-code:px-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share section */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-sm font-semibold text-zinc-400 mb-4">Поделиться статьёй</p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleTwitter}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
                    copied
                      ? "border-green-500/40 bg-green-500/10 text-green-400"
                      : "border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                  )}
                >
                  <Link2 className="w-4 h-4" />
                  {copied ? "Скопировано!" : "Копировать ссылку"}
                </button>
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-14 pt-12 border-t border-white/5">
                <h2 className="text-xl font-black text-white mb-6">Читайте также</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((r) => (
                    <article
                      key={r.id}
                      className="group cursor-pointer rounded-2xl bg-[#0c1523] hover:bg-[#0f1a2b] transition-all p-5"
                      onClick={() => navigate(`/blog/${r.slug}`)}
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full mb-3 inline-block">
                        {r.category}
                      </span>
                      <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{r.excerpt}</p>
                      <div className="flex items-center gap-1 text-xs text-zinc-600">
                        <Clock className="w-3 h-3" />
                        {r.reading_time} мин
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-14 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-cyan-600/5 overflow-hidden">
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
                  🎓 Онлайн-курс теории DGT
                </div>
                <p className="text-white font-black text-xl mb-2">Сдайте теорию с первого раза</p>
                <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                  Живые уроки с куратором, разбор всех вопросов DGT, чат поддержки и практика через SkilyApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://t.me/skilyapp_bot?start=course"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
                  >
                    Записаться на курс →
                  </a>
                  <a
                    href="https://t.me/skilyapp_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-colors"
                  >
                    Практиковать тесты бесплатно
                  </a>
                </div>
              </div>
            </div>
          </main>

          {/* ── Right Sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              {/* Meta card */}
              <div className="rounded-xl bg-[#0c1523] p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="w-4 h-4 text-zinc-600" />
                    <span>{post.reading_time} мин чтения</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Calendar className="w-4 h-4 text-zinc-600" />
                    <span>{publishedDate}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Поделиться</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTwitter}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg border transition-colors",
                          copied
                            ? "border-green-500/40 bg-green-500/10 text-green-400"
                            : "border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                        )}
                        title={copied ? "Скопировано!" : "Копировать ссылку"}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleNativeShare}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Поделиться"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* TOC */}
              {headings.length > 0 && (
                <div className="rounded-xl bg-[#0c1523] p-5">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Содержание</p>
                  <nav className="space-y-2">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={cn(
                          "block text-sm transition-colors hover:text-white leading-snug",
                          h.level === 3
                            ? "ml-3.5 text-zinc-600 hover:text-zinc-300"
                            : "text-zinc-400 font-medium"
                        )}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Mini CTA */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-white font-bold text-sm mb-1.5">Готовьтесь к DGT</p>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  Полная база вопросов DGT, объяснения на русском, тренировки и дуэли в SkilyApp.
                </p>
                <a
                  href="https://t.me/skilyapp_bot?start=course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Начать подготовку <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
