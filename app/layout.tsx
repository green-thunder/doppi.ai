import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://doppi.ai";
const DESCRIPTION =
  "Do'ppi.ai is the all-in-one AI marketing operating system for Uzbekistan — AI voice agent, social media automation, AI video & content, CRM and chatbots in one platform.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Do'ppi.ai — The AI Marketing OS for Uzbekistan",
    template: "%s · Do'ppi.ai",
  },
  description: DESCRIPTION,
  applicationName: "Do'ppi.ai",
  keywords: [
    "AI marketing",
    "marketing automation",
    "AI voice agent",
    "CRM",
    "Uzbekistan",
    "SIP call center",
    "chatbot",
    "Instagram Telegram WhatsApp automation",
    "Do'ppi.ai",
  ],
  authors: [{ name: "Do'ppi.ai" }],
  creator: "Do'ppi.ai",
  publisher: "Do'ppi.ai",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Do'ppi.ai",
    title: "Do'ppi.ai — The AI Marketing OS for Uzbekistan",
    description: DESCRIPTION,
    locale: "uz_UZ",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do'ppi.ai — The AI Marketing OS for Uzbekistan",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Do'ppi.ai",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Marketing Automation",
  operatingSystem: "Web",
  description: DESCRIPTION,
  url: SITE_URL,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "19",
    highPrice: "99",
    offerCount: "4",
  },
  publisher: {
    "@type": "Organization",
    name: "Do'ppi.ai",
    email: "admin@doppi.ai",
    url: SITE_URL,
    foundingDate: "2025",
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
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0A0A0B]"
        >
          Skip to content
        </a>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
