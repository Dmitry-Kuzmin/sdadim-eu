#!/usr/bin/env node

import puppeteerCore from "puppeteer-core";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readManifestFrom } from "./content-platform.mjs";

const hasVercelSignals = Boolean(
  process.env.VERCEL === "1" ||
  process.env.VERCEL_ENV ||
  process.env.VERCEL_URL ||
  process.env.VERCEL_PROJECT_ID ||
  process.env.VERCEL_DEPLOYMENT_ID
);
const isHostedVercel =
  process.cwd().startsWith("/vercel/path") ||
  process.env.HOME === "/vercel" ||
  (hasVercelSignals && process.env.CI === "1");
const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);

let chromium = null;
let puppeteer = null;

if (isHostedVercel || hasVercelSignals) {
  try {
    chromium = await import("@sparticuz/chromium");
  } catch {
    chromium = null;
  }
}

try {
  puppeteer = await import("puppeteer");
} catch {
  puppeteer = null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST_DIR = join(__dirname, "../dist");
const PUBLIC_DIR = join(__dirname, "../public");
const BASE_URL = "http://localhost:4173";

function resolveChromiumModule(mod) {
  return mod?.default ?? mod;
}

function findLocalChromeExecutable() {
  return execSync('which google-chrome-stable || which chromium || which chromium-browser || echo ""', {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

async function getServerlessLaunchOptions(reason) {
  const chromiumPackage = resolveChromiumModule(chromium);
  const launcher = puppeteer?.default ?? puppeteerCore?.default;

  if (!chromiumPackage?.executablePath || !chromiumPackage?.args) {
    throw new Error(reason || "Serverless prerender requires @sparticuz/chromium.");
  }

  const executablePath = await chromiumPackage.executablePath();
  if (!executablePath) {
    throw new Error(reason || "Could not resolve Chromium executable path.");
  }

  return {
    args: launcher?.defaultArgs
      ? launcher.defaultArgs({ args: chromiumPackage.args, headless: "shell" })
      : chromiumPackage.args,
    executablePath,
    headless: "shell",
  };
}

async function getLaunchOptions() {
  const launchOptions = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--disable-gpu",
    ],
  };

  // Priority 1: full `puppeteer` package is installed and ships with bundled Chromium.
  // This works everywhere (local, Vercel build, CI) — no executablePath needed.
  if (puppeteer?.default) {
    return launchOptions;
  }

  // Priority 2: system Chrome/Chromium (available in most CI images).
  const chromePath = findLocalChromeExecutable();
  if (chromePath) {
    launchOptions.executablePath = chromePath;
    return launchOptions;
  }

  // Priority 3: @sparticuz/chromium — last resort for Lambda-like environments
  // where neither puppeteer nor system Chrome is present.
  return getServerlessLaunchOptions(
    "No bundled puppeteer or system Chrome found; falling back to @sparticuz/chromium."
  );
}

function getOutputPath(route) {
  if (route === "/") {
    return join(DIST_DIR, "index.html");
  }

  if (route === "/404") {
    return join(DIST_DIR, "404.html");
  }

  if (route.startsWith("/blog/")) {
    const slug = route.replace("/blog/", "");
    const blogDir = join(DIST_DIR, "blog");
    mkdirSync(blogDir, { recursive: true });
    return join(blogDir, `${slug}.html`);
  }

  if (route.startsWith("/legal/")) {
    const tab = route.replace("/legal/", "");
    const legalDir = join(DIST_DIR, "legal");
    mkdirSync(legalDir, { recursive: true });
    return join(legalDir, `${tab}.html`);
  }

  return join(DIST_DIR, `${route.replace("/", "")}.html`);
}

async function waitForPageReadiness(page) {
  await Promise.allSettled([
    page.evaluate(async () => {
      if (document.fonts && document.fonts.status !== "loaded") {
        await document.fonts.ready;
      }
    }),
    page.waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      { timeout: 2500 }
    ),
  ]);
}

async function prerender() {
  if (!existsSync(DIST_DIR)) {
    throw new Error('dist directory not found. Run "npm run build:app" first.');
  }

  const manifest = readManifestFrom(PUBLIC_DIR);
  const shellHtml = readFileSync(join(DIST_DIR, "index.html"), "utf8");
  const expectedCanonicalByRoute = new Map(
    manifest.pages.map((page) => [page.route, page.canonical])
  );
  const routesToRender = process.env.PRERENDER_ROUTES
    ? process.env.PRERENDER_ROUTES.split(",").map((route) => route.trim()).filter(Boolean)
    : manifest.prerenderRoutes;

  const express = (await import("express")).default;
  const pathModule = await import("node:path");
  const app = express();

  app.use(express.static(DIST_DIR));
  app.use((req, res) => {
    res.type("html").send(shellHtml);
  });

  const server = app.listen(4173);
  let browser;

  try {
    const launchOptions = await getLaunchOptions();
    const browserImpl = puppeteer?.default ?? puppeteerCore?.default;

    if (!browserImpl) {
      throw new Error("Puppeteer is not available.");
    }

    browser = await browserImpl.launch(launchOptions);

    // Patterns for external requests that hang in the CI/build environment.
    // Aborted immediately so React renders with hard-coded fallbacks instead of waiting.
    const ABORT_PATTERNS = [
      "supabase.co",
      "mc.yandex.ru",
      "mc.yandex.com",
      "crisp.chat",
      "posthog.com",
      "sentry.io",
      "paddle.com",
      "google-analytics.com",
      "googletagmanager.com",
    ];

    async function renderRoute(route) {
      // Use a fresh page per route to avoid cross-route state pollution.
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 1024 });
        await page.setRequestInterception(true);
        page.on("request", (req) => {
          try {
            const url = req.url();
            if (ABORT_PATTERNS.some((p) => url.includes(p))) {
              req.abort();
            } else {
              req.continue();
            }
          } catch {
            // Request may have already been handled; ignore.
          }
        });

        const url = `${BASE_URL}${route}`;
        const expectedCanonical = expectedCanonicalByRoute.get(route);
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForFunction(
          () => {
            const root = document.querySelector("#root");
            return root && root.textContent && root.textContent.trim().length > 60;
          },
          { timeout: 30000 }
        );
        if (expectedCanonical) {
          await page.waitForFunction(
            (canonical) =>
              document.querySelector('link[rel="canonical"]')?.getAttribute("href") === canonical,
            { timeout: 30000 },
            expectedCanonical
          );
        }
        await waitForPageReadiness(page);

        const html = await page.content();
        if (/<div id="root">\s*<\/div>/i.test(html)) {
          throw new Error(`Route ${route} produced an empty root`);
        }
        if (!/<title>[^<]+<\/title>/i.test(html)) {
          throw new Error(`Route ${route} is missing a <title> tag`);
        }
        return { ok: true, html };
      } finally {
        await page.close().catch(() => {});
      }
    }

    const warnings = [];

    for (const route of routesToRender) {
      try {
        const { html } = await renderRoute(route);
        writeFileSync(getOutputPath(route), html);
        console.log(`[prerender] ✓ ${route}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isTimeout = message.includes("Waiting failed") || message.includes("timeout");
        if (isTimeout) {
          // Timeout: write shell HTML so the route works as a CSR SPA.
          // This is a soft failure — the build continues.
          console.warn(`[prerender] ⚠ Timeout for ${route} — writing shell HTML (CSR fallback)`);
          writeFileSync(getOutputPath(route), shellHtml);
          warnings.push(route);
        } else {
          // Hard failure (empty root, missing title, etc.) — still non-fatal but logged.
          console.warn(`[prerender] ✗ ${route}: ${message}`);
          writeFileSync(getOutputPath(route), shellHtml);
          warnings.push(route);
        }
      }
    }

    if (warnings.length > 0) {
      console.warn(`[prerender] Done with ${warnings.length} CSR fallback(s): ${warnings.join(", ")}`);
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    server.close();
  }
}

prerender().catch((error) => {
  console.error("[sdadim-eu prerender]", error);
  process.exit(1);
});
