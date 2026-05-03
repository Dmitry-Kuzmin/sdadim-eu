import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_POSTS = JSON.parse(
  readFileSync(resolve(__dirname, "../src/lib/blog-posts.json"), "utf8")
);

export { BLOG_POSTS };

export async function getPublishedBlogPosts() {
  return BLOG_POSTS;
}
