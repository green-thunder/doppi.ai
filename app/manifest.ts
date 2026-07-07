import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Do'ppi.ai — AI Marketing OS",
    short_name: "Do'ppi.ai",
    description:
      "The all-in-one AI marketing operating system for Uzbekistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#0A0A0B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
