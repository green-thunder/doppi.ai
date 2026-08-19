import type { Metadata } from "next";
import { content } from "@/lib/content";
import type { Lang } from "@/lib/lang";

export const SITE_URL = "https://doppi.ai";

export type Page = "home" | "privacy" | "terms";

const SUFFIX: Record<Page, string> = { home: "", privacy: "/privacy", terms: "/terms" };

/** Uzbek is served from the root, English from /en. */
export function pathFor(lang: Lang, page: Page): string {
  return `${lang === "en" ? "/en" : ""}${SUFFIX[page]}` || "/";
}

/** Layout-level metadata: everything that doesn't change between pages. */
export function baseMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: content[lang].seo.title, template: "%s · Do'ppi.ai" },
    applicationName: "Do'ppi.ai",
    authors: [{ name: "Do'ppi.ai" }],
    creator: "Do'ppi.ai",
    publisher: "Do'ppi.ai",
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "technology",
  };
}

/** Page-level metadata, including the reciprocal hreflang set. */
export function pageMetadata(lang: Lang, page: Page): Metadata {
  const seo = content[lang].seo;
  const title =
    page === "home" ? seo.title : page === "privacy" ? seo.privacyTitle : seo.termsTitle;
  const description =
    page === "home"
      ? seo.description
      : page === "privacy"
        ? seo.privacyDescription
        : seo.termsDescription;
  const url = pathFor(lang, page);

  return {
    // The home title is the full brand string already — don't run it through the
    // "%s · Do'ppi.ai" template.
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "uz-UZ": pathFor("uz", page),
        en: pathFor("en", page),
        "x-default": pathFor("uz", page),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "Do'ppi.ai",
      title,
      description,
      locale: lang === "uz" ? "uz_UZ" : "en_US",
      alternateLocale: lang === "uz" ? ["en_US"] : ["uz_UZ"],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide graph, emitted on every route (legal pages included): just the
 * Organization + WebSite entities. The product/FAQ graph lives in homeJsonLd —
 * Google's guidance is that FAQPage markup belongs only on pages whose visible
 * content contains the FAQ.
 */
export function jsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Do'ppi.ai",
        url: SITE_URL,
        email: "admin@doppi.ai",
        foundingDate: "2025",
        areaServed: { "@type": "Country", name: "Uzbekistan" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tashkent",
          addressCountry: "UZ",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+998939033301",
          contactType: "sales",
          email: "admin@doppi.ai",
          areaServed: "UZ",
          availableLanguage: ["uz", "en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE_URL,
        name: "Do'ppi.ai",
        inLanguage: lang === "uz" ? "uz-UZ" : "en",
        publisher: { "@id": ORG_ID },
      },
    ],
  };
}

/** Home-page-only graph: the product entity + the FAQ that is visible there. */
export function homeJsonLd(lang: Lang) {
  const seo = content[lang].seo;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Do'ppi.ai",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Marketing Automation",
        operatingSystem: "Web",
        description: seo.description,
        url: SITE_URL,
        inLanguage: lang === "uz" ? "uz-UZ" : "en",
        publisher: { "@id": ORG_ID },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: "19",
          highPrice: "99",
          // Three published prices; the Enterprise tier is quote-only and carries
          // no price, so counting it here would contradict the range above.
          offerCount: "3",
        },
      },
      {
        "@type": "FAQPage",
        inLanguage: lang === "uz" ? "uz-UZ" : "en",
        mainEntity: content[lang].faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}
