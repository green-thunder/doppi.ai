import type { MetadataRoute } from "next";
import { LAST_UPDATED } from "@/lib/content";
import { pathFor, SITE_URL, type Page } from "@/lib/seo";

const PAGES: { page: Page; changeFrequency: "weekly" | "yearly"; priority: number }[] = [
  { page: "home", changeFrequency: "weekly", priority: 1 },
  { page: "privacy", changeFrequency: "yearly", priority: 0.3 },
  { page: "terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_UPDATED);

  return PAGES.flatMap(({ page, changeFrequency, priority }) =>
    (["uz", "en"] as const).map((lang) => ({
      url: `${SITE_URL}${pathFor(lang, page)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          "uz-UZ": `${SITE_URL}${pathFor("uz", page)}`,
          en: `${SITE_URL}${pathFor("en", page)}`,
        },
      },
    })),
  );
}
