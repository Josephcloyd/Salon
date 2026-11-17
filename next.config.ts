import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Unsplash's CDN resizes and serves AVIF/WebP for us; see src/lib/imageLoader.ts
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.ts",
  },
  poweredByHeader: false,
};

export default nextConfig;
