/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Inline the (single, ~9KB gz) stylesheet into the HTML: removes the
    // render-blocking CSS round trip on cold loads. The usual trade-off —
    // losing cross-page CSS caching — is moot on a one-page site.
    inlineCss: true,
  },
  images: {
    // AVIF first, WebP fallback — the three team avatars are the only images.
    formats: ["image/avif", "image/webp"],
    // Default is 60s, which re-optimises head-shots that change twice a year.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
