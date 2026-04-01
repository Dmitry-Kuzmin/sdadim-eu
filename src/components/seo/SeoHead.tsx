import { useEffect } from "react";

const examYear = new Date().getFullYear();

const SEO_CONFIG = {
  title: `Sdadim - Впервые сдаем теорию DGT ${examYear} вместе`,
  description: `Сдай теоретический экзамен DGT ${examYear} с первого раза! Официальные вопросы на русском языке, AI-репетитор 24/7, симуляция реального экзамена. Бесплатное приложение для подготовки к экзамену по вождению в Испании.`,
  keywords: [
    "теоретический экзамен DGT", "ПДД Испания", "экзамен по вождению Испания",
    "тесты DGT на русском", "водительские права Испания", "подготовка к экзамену DGT",
    "DGT тест онлайн", "Sdadim", "Сдадим",
    "экзамен на права в Испании на русском", "дорожные знаки Испании"
  ].join(", "),
  ogTitle: `Sdadim - Экзамен DGT ${examYear} на русском | ИИ-репетитор`,
  ogDescription: "Сдай экзамен DGT с первого раза! Тесты на русском, AI объясняет ошибки, симуляция реального экзамена. Бесплатно.",
  ogLocale: "ru_RU",
  lang: "ru",
};

function setMetaTag(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

export function SeoHead({ title, description, canonicalUrl }: SeoHeadProps) {
  useEffect(() => {
    const config = SEO_CONFIG;

    document.documentElement.lang = config.lang;
    document.title = title || config.title;

    setMetaTag("name", "description", description || config.description);
    setMetaTag("name", "keywords", config.keywords);
    setMetaTag("property", "og:title", title || config.ogTitle);
    setMetaTag("property", "og:description", description || config.ogDescription);
    setMetaTag("property", "og:locale", config.ogLocale);
    setMetaTag("property", "og:url", canonicalUrl || "https://sdadim.eu");
    setMetaTag("property", "og:type", "website");
    
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title || config.ogTitle);
    setMetaTag("name", "twitter:description", description || config.description);
    
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl || "https://sdadim.eu";

  }, [title, description, canonicalUrl]);

  return null;
}
