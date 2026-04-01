import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published_at: string;
  category: string;
  reading_time: number;
}

export interface CourseLeadPayload {
  name: string;
  phone: string;
  telegram?: string;
  comment?: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image, published_at, category, reading_time")
    .eq("published", true)
    .eq("site_id", "sdadim")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .eq("site_id", "sdadim")
    .single();

  if (error) return null;
  return data;
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export async function submitCourseLead(payload: CourseLeadPayload): Promise<void> {
  const { error } = await supabase.from("course_leads").insert({
    ...payload,
    source: "sdadim.eu",
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}
