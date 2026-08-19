import { ImageResponse } from "next/og";
import { content } from "@/lib/content";
import { ogSize, ogTemplate } from "@/lib/og";

export const alt = content.en.seo.title;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(ogTemplate("en"), { ...size });
}
