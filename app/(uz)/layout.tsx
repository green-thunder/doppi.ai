import type { Metadata, Viewport } from "next";
import "../globals.css";
import { RootHtml } from "@/components/root-html";
import { baseMetadata } from "@/lib/seo";

export const metadata: Metadata = baseMetadata("uz");

export const viewport: Viewport = {
  // Dark is the site default; ThemeProvider rewrites this tag when the visitor
  // toggles, so the browser chrome tracks the SITE theme rather than the OS one.
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

export default function UzLayout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="uz">{children}</RootHtml>;
}
