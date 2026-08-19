import { Space_Grotesk, DM_Sans } from "next/font/google";
import { content } from "@/lib/content";
import type { Lang } from "@/lib/lang";
import { jsonLd } from "@/lib/seo";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { ScrollProgress } from "@/components/scroll-progress";
import { GrainOverlay } from "@/components/grain-overlay";

// Both are variable fonts: enumerating weights would emit a separate @font-face
// per weight instead of one file per family, and would pin the axis range.
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * The document shell shared by both language trees. There is no root
 * app/layout.tsx: the (uz) and (en) route groups each own a root layout so that
 * <html lang> is a real server-rendered attribute rather than something patched
 * in an effect after hydration.
 */
export function RootHtml({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  const t = content[lang];

  return (
    <html
      lang={lang === "uz" ? "uz" : "en"}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
        >
          {t.a11y.skipToContent}
        </a>
        <ThemeProvider>
          <ScrollProgress />
          <GrainOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
