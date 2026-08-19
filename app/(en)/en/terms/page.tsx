import type { Metadata } from "next";
import { TermsPage } from "@/components/legal/terms";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "terms");

export default function Page() {
  return <TermsPage lang="en" />;
}
