import type { Metadata } from "next";

// The terms page itself is a client component (it reads the language context),
// so it can't export metadata. This server layout supplies per-route metadata so
// /terms no longer inherits the homepage title, description and canonical.
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your access to and use of the Do'ppi.ai platform, website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
