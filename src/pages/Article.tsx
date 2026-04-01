import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPost, type BlogPost } from "@/lib/supabase";
import { Clock, ArrowLeft, Calendar } from "lucide-react";

function useSEOMeta(post: BlogPost | null) {
  useEffect(() => {
    if (!post) return;
    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
      ogDesc: document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? "",
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "",
    };

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        if (attr === "name") el.name = sel.match(/\[name="(.+?)"\]/)?.[1] ?? "";
        if (attr === "property") el.setAttribute("property", sel.match(/\[property="(.+?)"\]/)?.[1] ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    document.title = `${post.title} | Сдадим — DGT`;
    setMeta('meta[name="description"]', "name", post.excerpt);
    setMeta('meta[property="og:title"]', "property", post.title);
    setMeta('meta[property="og:description"]', "property", post.excerpt);
    if (post.cover_image) setMeta('meta[property="og:image"]', "property", post.cover_image.startsWith("http") ? post.cover_image : `https://sdadim.eu${post.cover_image}`);
    setMeta('meta[property="og:url"]', "property", `https://sdadim.eu/blog/${post.slug}`);
    setMeta('meta[property="og:type"]', "property", "article");

    // JSON-LD structured data
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
      document.querySelector('meta[property="og:title"]')?.setAttribute("content", prev.ogTitle);
      document.querySelector('meta[property="og:description"]')?.setAttribute("content", prev.ogDesc);
      document.querySelector('meta[property="og:image"]')?.setAttribute("content", prev.ogImage);
      document.querySelector('meta[property="og:url"]')?.setAttribute("content", prev.ogUrl);
      document.getElementById(ldId)?.remove();
    };
  }, [post]);
}

function Skeleton() {
  return (
    <div className="animate-pulse max-w-2xl mx-auto py-24 px-4">
      <div className="h-6 bg-white/5 rounded w-24 mb-8" />
      <div className="h-10 bg-white/5 rounded w-3/4 mb-4" />
      <div className="h-4 bg-white/5 rounded w-1/3 mb-10" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 bg-white/5 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBlogPost(slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  useSEOMeta(post);

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

  return (
    <main className="pt-24 pb-20 px-4">
      <article className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Блог
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-600">
            <Calendar className="w-3.5 h-3.5" />
            {publishedDate}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-600">
            <Clock className="w-3.5 h-3.5" />
            {post.reading_time} мин чтения
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Cover */}
        {post.cover_image && (
          <div className="rounded-2xl overflow-hidden mb-10 border border-white/8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-sm md:prose-base max-w-none
            prose-headings:font-black prose-headings:text-white
            prose-p:text-zinc-400 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-zinc-400 prose-li:marker:text-blue-400
            prose-blockquote:border-blue-500 prose-blockquote:text-zinc-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <div className="mt-14 p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
          <p className="text-white font-bold mb-2">Готовы начать?</p>
          <p className="text-zinc-400 text-sm mb-5">Ближайший поток стартует 5 мая. Осталось несколько мест.</p>
          <a
            href="https://t.me/skilyapp_bot?start=course"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            Занять место →
          </a>
        </div>

      </article>
    </main>
  );
}
