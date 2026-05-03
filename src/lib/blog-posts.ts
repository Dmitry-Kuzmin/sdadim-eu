import data from "./blog-posts.json";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string;
  updated_at: string;
  category: string;
  reading_time: number;
}

export const blogPosts: BlogPost[] = data;

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return blogPosts.slice(0, limit);
  const sameCategory = blogPosts.filter((p) => p.slug !== slug && p.category === current.category);
  const others = blogPosts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}
