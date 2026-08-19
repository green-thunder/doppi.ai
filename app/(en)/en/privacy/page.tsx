import type { Metadata } from "next";
import { PrivacyPage } from "@/components/legal/privacy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "privacy");

export default function Page() {
  return <PrivacyPage lang="en" />;
}
