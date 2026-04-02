#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const unquoted = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = unquoted;
    }
  }
}

function ensureEnv() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY for blog discovery.");
  }

  return { url, anonKey };
}

export async function getPublishedBlogPosts() {
  const { url, anonKey } = ensureEnv();
  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, cover_image, published_at, updated_at, category, reading_time")
    .eq("published", true)
    .eq("site_id", "sdadim")
    .order("published_at", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(`Failed to fetch published blog posts: ${error.message}`);
  }

  return data ?? [];
}
