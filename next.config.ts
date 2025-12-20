import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-64c8e98de340487ca31162c0a1ae0a24.r2.dev",
      },
    ],
    // Cache optimized images for 31 days
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
