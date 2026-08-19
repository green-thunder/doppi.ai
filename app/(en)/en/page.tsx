import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("en", "home");

export default function Home() {
  return <Landing lang="en" />;
}
