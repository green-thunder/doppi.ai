import type { Metadata } from "next";
import { Landing } from "@/components/landing";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("uz", "home");

export default function Home() {
  return <Landing lang="uz" />;
}
