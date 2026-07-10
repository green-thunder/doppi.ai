import type { Metadata } from "next";

// The privacy page itself is a client component (it reads the language context),
// so it can't export metadata. This server layout supplies per-route metadata so
// /privacy no longer inherits the homepage title, description and canonical.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Do'ppi.ai collects, uses and protects your information when you visit the site or request a demo.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
